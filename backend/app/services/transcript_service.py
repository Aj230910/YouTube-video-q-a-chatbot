import os
import requests
from dotenv import load_dotenv

load_dotenv()


class TranscriptService:

    @staticmethod
    def fetch_transcript(video_id: str):

        api_key = os.getenv("SUPADATA_API_KEY")

        if not api_key:
            raise Exception(
                "SUPADATA_API_KEY not found"
            )

        video_url = (
            f"https://www.youtube.com/watch?v={video_id}"
        )

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

        if response.status_code != 200:
            raise Exception(
                f"Supadata API Error: {response.text}"
            )

        data = response.json()

        transcript = []

        for item in data.get(
            "transcript",
            []
        ):

            transcript.append(
                {
                    "text": item.get(
                        "text",
                        ""
                    ),
                    "start": float(
                        item.get(
                            "offset",
                            0
                        )
                    ),
                    "duration": 0.0
                }
            )

        return transcript