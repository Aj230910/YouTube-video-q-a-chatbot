from youtube_transcript_api import YouTubeTranscriptApi


class TranscriptService:

    @staticmethod
    def fetch_transcript(video_id: str):

        try:
            api = YouTubeTranscriptApi()

            transcript = api.fetch(video_id)

            return [
                {
                    "text": item.text,
                    "start": float(item.start),
                    "duration": float(item.duration)
                }
                for item in transcript
            ]

        except Exception as e:
            import traceback

            print("TRANSCRIPT ERROR")
            print(str(e))
            print(traceback.format_exc())

            raise Exception(
                f"YouTube Transcript error: {str(e)}"
            )