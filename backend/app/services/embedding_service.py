import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List

class EmbeddingService:
    _model = None

    @classmethod
    def get_model(cls) -> SentenceTransformer:
        """
        Lazy-loads the SentenceTransformer model to prevent startup lags.
        """
        if cls._model is None:
            # Using the required model: all-MiniLM-L6-v2
            cls._model = SentenceTransformer('all-MiniLM-L6-v2')
        return cls._model

    @classmethod
    def generate_embeddings(cls, texts: List[str]) -> np.ndarray:
        """
        Generates vector embeddings for a list of text chunks.
        """
        model = cls.get_model()
        embeddings = model.encode(texts, show_progress_bar=False)
        return np.array(embeddings).astype('float32')

    @classmethod
    def generate_query_embedding(cls, query: str) -> np.ndarray:
        """
        Generates vector embedding for a single user query.
        """
        model = cls.get_model()
        embedding = model.encode(query, show_progress_bar=False)
        return np.array(embedding).astype('float32')
