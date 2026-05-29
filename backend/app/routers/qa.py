import logging
from fastapi import APIRouter, HTTPException, status
from app.models.schemas import QuestionRequest, QuestionResponse, SourceChunk
from app.services.embedding_service import EmbeddingService
from app.services.vector_service import VectorService
from app.services.gemini_service import GeminiService

logger = logging.getLogger("app.routers.qa")

router = APIRouter()

@router.post("/ask-question", response_model=QuestionResponse, status_code=status.HTTP_200_OK)
async def ask_question(request: QuestionRequest):
    """
    Performs similarity search over transcript chunks and generates an answer using Google Gemini.
    """
    video_id = request.video_id.strip()
    question = request.question.strip()

    logger.info(f"Received question for video {video_id}: {question}")

    if not video_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="video_id is required."
        )
    if not question:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="question is required."
        )

    # Step 1: Check if the FAISS database exists for this video
    if not VectorService.is_video_processed(video_id):
        logger.error(f"Video {video_id} has not been processed or cached yet.")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This video has not been processed yet. Please process the video URL first."
        )

    try:
        # Step 2: Generate embedding for the question query
        logger.info(f"Generating embedding for query...")
        query_embedding = EmbeddingService.generate_query_embedding(question)

        # Step 3: Retrieve top 5 similar chunks from FAISS vector store
        logger.info(f"Retrieving top chunks from FAISS database...")
        retrieved_chunks = VectorService.similarity_search(video_id, query_embedding, k=5)

        if not retrieved_chunks:
            logger.warning("No relevant chunks found in the transcript.")
            return QuestionResponse(
                answer="The video does not contain enough information to answer this question.",
                sources=[]
            )

        # Step 4: Pass retrieved chunks as context to Gemini & generate answer
        logger.info(f"Generating answer from Gemini API...")
        answer = GeminiService.generate_answer(retrieved_chunks, question)

        # Step 5: Format and return the response
        sources = [
            SourceChunk(
                text=c["text"],
                start=c["start"],
                duration=c["duration"],
                score=c["score"]
            )
            for c in retrieved_chunks
        ]

        return QuestionResponse(
            answer=answer,
            sources=sources
        )

    except Exception as e:
        logger.exception(f"Error answering question for video {video_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
