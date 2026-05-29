import os
import json
import faiss
import numpy as np
from typing import List, Dict, Tuple

DATA_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "data"
)

class VectorService:
    @staticmethod
    def get_video_dir(video_id: str) -> str:
        """
        Gets the directory path where data for a specific video is stored.
        """
        video_dir = os.path.join(DATA_DIR, video_id)
        os.makedirs(video_dir, exist_ok=True)
        return video_dir

    @classmethod
    def is_video_processed(cls, video_id: str) -> bool:
        """
        Checks if the video has already been processed and its index is stored.
        """
        video_dir = cls.get_video_dir(video_id)
        index_path = os.path.join(video_dir, "index.faiss")
        chunks_path = os.path.join(video_dir, "chunks.json")
        return os.path.exists(index_path) and os.path.exists(chunks_path)

    @classmethod
    def save_vector_db(cls, video_id: str, embeddings: np.ndarray, chunks: List[Dict[str, any]]):
        """
        Creates and stores a FAISS index and the corresponding chunks on disk.
        """
        video_dir = cls.get_video_dir(video_id)
        index_path = os.path.join(video_dir, "index.faiss")
        chunks_path = os.path.join(video_dir, "chunks.json")

        # Create FAISS L2 distance index
        dimension = embeddings.shape[1]
        index = faiss.IndexFlatL2(dimension)
        index.add(embeddings)

        # Write FAISS index to file
        faiss.write_index(index, index_path)

        # Save the transcript chunks as JSON
        with open(chunks_path, "w", encoding="utf-8") as f:
            json.dump(chunks, f, ensure_ascii=False, indent=2)

    @classmethod
    def load_chunks(cls, video_id: str) -> List[Dict[str, any]]:
        """
        Loads cached chunks for a given video.
        """
        video_dir = cls.get_video_dir(video_id)
        chunks_path = os.path.join(video_dir, "chunks.json")
        if not os.path.exists(chunks_path):
            raise FileNotFoundError(f"Transcript chunks not found for video: {video_id}")
        
        with open(chunks_path, "r", encoding="utf-8") as f:
            return json.load(f)

    @classmethod
    def similarity_search(
        cls, video_id: str, query_embedding: np.ndarray, k: int = 5
    ) -> List[Dict[str, any]]:
        """
        Loads the FAISS index for a video and performs similarity search.
        Returns the top k matching chunks with similarity scores.
        """
        video_dir = cls.get_video_dir(video_id)
        index_path = os.path.join(video_dir, "index.faiss")
        
        if not os.path.exists(index_path):
            raise FileNotFoundError(f"Vector index not found for video: {video_id}")

        # Read FAISS index
        index = faiss.read_index(index_path)
        
        # Load transcript chunks
        chunks = cls.load_chunks(video_id)

        # Ensure query embedding is 2D float32
        query_vector = np.array([query_embedding]).astype("float32")
        
        # Perform search (k can be capped by the number of actual chunks)
        k = min(k, len(chunks))
        if k == 0:
            return []

        distances, indices = index.search(query_vector, k)

        results = []
        for i, idx in enumerate(indices[0]):
            if idx == -1 or idx >= len(chunks):
                continue
            
            chunk = chunks[idx].copy()
            # Map L2 distance to a friendly similarity score: 1 / (1 + distance)
            distance = float(distances[0][i])
            similarity = round(1.0 / (1.0 + distance), 4)
            
            chunk["score"] = similarity
            results.append(chunk)

        return results
