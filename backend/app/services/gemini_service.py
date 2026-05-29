import os
import google.generativeai as genai
from typing import List, Dict

class GeminiService:
    @staticmethod
    def generate_answer(retrieved_chunks: List[Dict[str, any]], user_question: str) -> str:
        """
        Uses Google Gemini (gemini-2.5-flash) to answer a question based on retrieved transcript chunks.
        Strictly adheres to instructions to prevent hallucinations.
        """
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            # Fallback Mode: retrieve relevant segments directly to show search works
            if not retrieved_chunks:
                return "The video does not contain enough information to answer this question."
            
            top_chunk = retrieved_chunks[0]
            start_sec = top_chunk.get("start", 0)
            hours = int(start_sec // 3600)
            minutes = int((start_sec % 3600) // 60)
            seconds = int(start_sec % 60)
            timestamp = f"{hours:02d}:{minutes:02d}:{seconds:02d}" if hours > 0 else f"{minutes:02d}:{seconds:02d}"
            
            answer = (
                f"⚠️ **[Demo Mode - GEMINI_API_KEY Not Configured]**\n\n"
                f"Based on the most relevant video segment found by FAISS search (at **{timestamp}**), the transcript says:\n\n"
                f"> \"{top_chunk['text']}\"\n\n"
                f"👉 To enable full AI response synthesis, please add your `GEMINI_API_KEY` to the `backend/.env` file and restart the backend server."
            )
            return answer
        
        # Configure Gemini SDK
        genai.configure(api_key=api_key)
        
        # Format the retrieved chunks for the context
        context_blocks = []
        for idx, chunk in enumerate(retrieved_chunks):
            start_sec = chunk.get("start", 0)
            hours = int(start_sec // 3600)
            minutes = int((start_sec % 3600) // 60)
            seconds = int(start_sec % 60)
            timestamp = f"[{hours:02d}:{minutes:02d}:{seconds:02d}]" if hours > 0 else f"[{minutes:02d}:{seconds:02d}]"
            context_blocks.append(f"Source Chunk {idx+1} (Timestamp: {timestamp}):\n{chunk['text']}")
            
        retrieved_chunks_str = "\n\n".join(context_blocks)
        
        # Exact prompt template matching instructions
        prompt = f"""You are an AI assistant answering questions only from the provided transcript context.

Context:
{retrieved_chunks_str}

Question:
{user_question}

Instructions:
* Answer only using the context.
* Do not hallucinate.
* If answer is unavailable, say "The video does not contain enough information to answer this question."
"""

        try:
            # Using the gemini-2.5-flash model
            model = genai.GenerativeModel("gemini-2.5-flash")
            
            # Generate response
            response = model.generate_content(prompt)
            
            if not response.text:
                return "The video does not contain enough information to answer this question."
                
            return response.text.strip()
            
        except Exception as e:
            raise Exception(f"Gemini API Error: {str(e)}")
