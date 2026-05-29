from youtube_transcript_api import YouTubeTranscriptApi
from typing import List, Dict

class TranscriptService:
    @staticmethod
    def fetch_transcript(video_id: str) -> List[Dict[str, any]]:
        """
        Fetches the transcript for a given YouTube video ID.
        Tries English first, then falls back to other available languages.
        """
        try:
            # Support both older (0.6.x) and newer (1.x.x) versions of youtube-transcript-api
            transcript_list = None
            if hasattr(YouTubeTranscriptApi, 'list_transcripts'):
                # Older version classmethod
                transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            else:
                # Newer version instance method
                try:
                    api_instance = YouTubeTranscriptApi()
                    if hasattr(api_instance, 'list'):
                        transcript_list = api_instance.list(video_id)
                except Exception:
                    pass

            if transcript_list is None:
                # Fallback to get_transcript directly if list methods are not available
                if hasattr(YouTubeTranscriptApi, 'get_transcript'):
                    raw_data = YouTubeTranscriptApi.get_transcript(video_id)
                    formatted_transcript = []
                    for entry in raw_data:
                        text = entry.text if hasattr(entry, 'text') else getattr(entry, 'get', lambda k, d: '')('text', '')
                        start = entry.start if hasattr(entry, 'start') else getattr(entry, 'get', lambda k, d: 0.0)('start', 0.0)
                        duration = entry.duration if hasattr(entry, 'duration') else getattr(entry, 'get', lambda k, d: 0.0)('duration', 0.0)
                        formatted_transcript.append({
                            "text": str(text).replace("\n", " ").strip(),
                            "start": float(start),
                            "duration": float(duration)
                        })
                    return formatted_transcript
                else:
                    raise Exception("YouTubeTranscriptApi does not support transcript listing or retrieval in this environment.")

            # Try to get English transcript (manual or generated)
            try:
                transcript = transcript_list.find_transcript(['en'])
            except Exception:
                # If English is not available, try to find any manually created transcript
                # and fall back to the first available transcript (e.g. auto-generated)
                try:
                    transcript = next(iter(transcript_list))
                except StopIteration:
                    raise Exception("No transcripts available for this video.")
            
            raw_data = transcript.fetch()
            # Standardize output format
            formatted_transcript = []
            for entry in raw_data:
                # Handle both library versions (dictionary elements or FetchedTranscriptSnippet dataclass elements)
                text = entry.text if hasattr(entry, 'text') else getattr(entry, 'get', lambda k, d: '')('text', '')
                start = entry.start if hasattr(entry, 'start') else getattr(entry, 'get', lambda k, d: 0.0)('start', 0.0)
                duration = entry.duration if hasattr(entry, 'duration') else getattr(entry, 'get', lambda k, d: 0.0)('duration', 0.0)
                
                formatted_transcript.append({
                    "text": str(text).replace("\n", " ").strip(),
                    "start": float(start),
                    "duration": float(duration)
                })
            return formatted_transcript
            
        except Exception as e:
            error_msg = str(e)
            if "Subtitles are disabled" in error_msg or "disabled" in error_msg.lower():
                raise Exception("Subtitles are disabled for this video by the creator.")
            elif "Could not retrieve a transcript" in error_msg:
                raise Exception("Could not retrieve a transcript for this video. It may be too new, private, or have disabled captions.")
            else:
                raise Exception(f"YouTube Transcript error: {error_msg}")
