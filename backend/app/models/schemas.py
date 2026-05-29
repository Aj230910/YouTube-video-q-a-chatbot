from pydantic import BaseModel, Field
from typing import List, Optional

class VideoProcessRequest(BaseModel):
    video_url: str = Field(..., description="The full YouTube video URL")

class TranscriptSegment(BaseModel):
    text: str
    start: float
    duration: float

class VideoProcessResponse(BaseModel):
    video_id: str
    title: str
    author: str
    thumbnail_url: str
    duration: int
    transcript: List[TranscriptSegment]
    message: str

class QuestionRequest(BaseModel):
    video_id: str
    question: str

class SourceChunk(BaseModel):
    text: str
    start: float
    duration: float
    score: float

class QuestionResponse(BaseModel):
    answer: str
    sources: List[SourceChunk]

class HealthResponse(BaseModel):
    status: str
    version: str
    services: dict
