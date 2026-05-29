from typing import List, Dict

class ChunkingService:
    @staticmethod
    def chunk_transcript(
        transcript: List[Dict[str, any]], 
        min_chars: int = 500, 
        max_chars: int = 1000,
        overlap_segments: int = 1
    ) -> List[Dict[str, any]]:
        """
        Chunks transcript segments into continuous blocks of text.
        Tracks starting timestamps, duration, and maintains a small overlap of segments for context.
        """
        if not transcript:
            return []

        chunks = []
        current_segments = []
        current_length = 0

        for segment in transcript:
            text = segment["text"]
            
            # Check if adding the next segment exceeds the max length limit, 
            # and verify if the current chunk is at least of minimum size.
            if current_length + len(text) > max_chars and current_length >= min_chars:
                # Compile current chunk
                chunk_text = " ".join([s["text"] for s in current_segments])
                start_time = current_segments[0]["start"]
                end_time = current_segments[-1]["start"] + current_segments[-1]["duration"]
                
                chunks.append({
                    "text": chunk_text,
                    "start": start_time,
                    "duration": round(end_time - start_time, 2)
                })

                # Implement overlap to maintain context across chunks
                if overlap_segments > 0 and len(current_segments) > overlap_segments:
                    current_segments = current_segments[-overlap_segments:]
                    current_length = sum(len(s["text"]) + 1 for s in current_segments) - 1
                else:
                    current_segments = []
                    current_length = 0
            
            current_segments.append(segment)
            current_length += len(text) + (1 if current_length > 0 else 0) # Account for space separator

        # Handle any remaining segments in the buffer
        if current_segments:
            chunk_text = " ".join([s["text"] for s in current_segments])
            start_time = current_segments[0]["start"]
            end_time = current_segments[-1]["start"] + current_segments[-1]["duration"]
            chunks.append({
                "text": chunk_text,
                "start": start_time,
                "duration": round(end_time - start_time, 2)
            })

        return chunks
