import os
import requests
from dotenv import load_dotenv

load_dotenv()


class TranscriptService:

    @staticmethod
    def fetch_transcript(video_id: str):

        api_key = os.getenv("SUPADATA_API_KEY")

        print("=== TRANSCRIPT SERVICE STARTED ===")
        print("VIDEO ID:", video_id)
        print("API KEY EXISTS:", bool(api_key))

        if not api_key:
            raise Exception("SUPADATA_API_KEY not found")

        video_url = f"https://www.youtube.com/watch?v={video_id}"

        response = requests.get(
            "https://api.supadata.ai/v1/youtube/transcript",
            headers={
                "x-api-key": api_key
            },
            params={
                "url": video_url
            },
            timeout=30
        )

        print("STATUS CODE:", response.status_code)
        print("RAW RESPONSE:", response.text[:1000])

        if response.status_code != 200:
            raise Exception(
                f"Supadata API Error ({response.status_code}): {response.text}"
            )

        data = response.json()

        print("JSON RESPONSE:", data)

        transcript = []

        # Case 1: content is list
        if isinstance(data.get("content"), list):

            for item in data["content"]:

                transcript.append({
                    "text": item.get("text", ""),
                    "start": float(item.get("offset", 0)) / 1000.0,
                    "duration": float(item.get("duration", 0)) / 1000.0
                })

        # Case 2: content is string
        elif isinstance(data.get("content"), str):

            transcript.append({
                "text": data["content"],
                "start": 0.0,
                "duration": 0.0
            })

        else:
            raise Exception(
                f"Unexpected Supadata response format: {data}"
            )

        print("TRANSCRIPT LENGTH:", len(transcript))

        return transcript