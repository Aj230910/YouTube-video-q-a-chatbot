import os
import json
import logging
from fastapi import APIRouter, HTTPException, status
from app.models.schemas import VideoProcessRequest, VideoProcessResponse, TranscriptSegment
from app.utils.youtube_helper import extract_video_id, get_video_details
from app.services.transcript_service import TranscriptService
from app.services.chunking_service import ChunkingService
from app.services.embedding_service import EmbeddingService
from app.services.vector_service import VectorService, DATA_DIR

# Set up logger
logger = logging.getLogger("app.routers.video")

router = APIRouter()

@router.post("/process-video", response_model=VideoProcessResponse, status_code=status.HTTP_200_OK)
async def process_video(request: VideoProcessRequest):
    """
    Extracts the YouTube video ID, fetches the transcript, chunks it,
    generates embeddings, and stores them in FAISS.
    """
    video_url = request.video_url.strip()
    logger.info(f"Received request to process video: {video_url}")

    # Step 1: Extract Video ID
    video_id = extract_video_id(video_url)
    if not video_id:
        logger.error(f"Failed to extract Video ID from URL: {video_url}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid YouTube URL. Please provide a valid YouTube video link."
        )

    video_dir = VectorService.get_video_dir(video_id)
    transcript_path = os.path.join(video_dir, "transcript.json")
    meta_path = os.path.join(video_dir, "metadata.json")

    # Step 2: Fetch basic video details from YouTube oEmbed
    video_details = get_video_details(video_id)

    # Step 3: Check if already processed and cached on disk
    if VectorService.is_video_processed(video_id) and os.path.exists(transcript_path):
        logger.info(f"Video {video_id} found in cache. Loading cached transcript...")
        try:
            with open(transcript_path, "r", encoding="utf-8") as f:
                cached_transcript = json.load(f)
            
            # If metadata exists, load details from it
            if os.path.exists(meta_path):
                with open(meta_path, "r", encoding="utf-8") as f:
                    cached_meta = json.load(f)
                    video_details.update(cached_meta)
            
            # Calculate total duration from transcript if duration is 0
            duration = video_details.get("duration", 0)
            if duration == 0 and cached_transcript:
                duration = int(cached_transcript[-1]["start"] + cached_transcript[-1]["duration"])

            return VideoProcessResponse(
                video_id=video_id,
                title=video_details.get("title", "YouTube Video"),
                author=video_details.get("author", "Unknown Channel"),
                thumbnail_url=video_details.get("thumbnail_url", ""),
                duration=duration,
                transcript=[TranscriptSegment(**s) for s in cached_transcript],
                message="Video processed successfully (Loaded from cache)."
            )
        except Exception as e:
            logger.warning(f"Error loading cached files for {video_id}: {str(e)}. Reprocessing...")

    # Step 4: Run the RAG pipeline if not cached
    try:
        # 1. Fetch transcript
        logger.info(f"Fetching transcript for video {video_id}...")
        raw_transcript = TranscriptService.fetch_transcript(video_id)

        # 2. Chunk transcript (chunks of 500-1000 characters)
        logger.info(f"Chunking transcript for video {video_id}...")
        chunks = ChunkingService.chunk_transcript(raw_transcript, min_chars=500, max_chars=1000)
        
        if not chunks:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Transcript is empty or too short to be indexed."
            )

        # 3. Generate embeddings for chunks
        logger.info(f"Generating embeddings for {len(chunks)} chunks...")
        chunk_texts = [c["text"] for c in chunks]
        embeddings = EmbeddingService.generate_embeddings(chunk_texts)

        # 4. Store embeddings in FAISS and chunks on disk
        logger.info(f"Storing FAISS index for video {video_id}...")
        VectorService.save_vector_db(video_id, embeddings, chunks)

        # Calculate duration
        duration = 0
        if raw_transcript:
            duration = int(raw_transcript[-1]["start"] + raw_transcript[-1]["duration"])
            video_details["duration"] = duration

        # Save raw transcript & metadata for fast reload
        with open(transcript_path, "w", encoding="utf-8") as f:
            json.dump(raw_transcript, f, ensure_ascii=False, indent=2)
            
        with open(meta_path, "w", encoding="utf-8") as f:
            json.dump(video_details, f, ensure_ascii=False, indent=2)

        return VideoProcessResponse(
            video_id=video_id,
            title=video_details["title"],
            author=video_details["author"],
            thumbnail_url=video_details["thumbnail_url"],
            duration=duration,
            transcript=[TranscriptSegment(**s) for s in raw_transcript],
            message="Video processed and indexed successfully."
        )

    except Exception as e:
        logger.exception(f"Error processing video {video_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
