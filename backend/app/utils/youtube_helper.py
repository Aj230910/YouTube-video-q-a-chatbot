import re
import requests
from typing import Optional, Dict

YOUTUBE_REGEX = re.compile(
    r'(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})'
)

def extract_video_id(url: str) -> Optional[str]:
    """
    Extracts the 11-character YouTube video ID from a URL.
    """
    match = YOUTUBE_REGEX.search(url)
    if match:
        return match.group(1)
    return None

def get_video_details(video_id: str) -> Dict[str, any]:
    """
    Fetches basic video information using the oEmbed API.
    """
    url = f"https://www.youtube.com/watch?v={video_id}"
    oembed_url = f"https://www.youtube.com/oembed?url={url}&format=json"
    
    try:
        response = requests.get(oembed_url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            return {
                "title": data.get("title", "Unknown YouTube Video"),
                "author": data.get("author_name", "Unknown Creator"),
                "thumbnail_url": data.get("thumbnail_url", f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"),
                "duration": 0 # oEmbed does not provide duration, we can set default or calculate from transcript
            }
    except Exception:
        pass
        
    return {
        "title": "YouTube Video",
        "author": "Unknown Creator",
        "thumbnail_url": f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg",
        "duration": 0
    }
