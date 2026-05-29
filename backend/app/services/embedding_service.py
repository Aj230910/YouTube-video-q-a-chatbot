import os
# Limit PyTorch threads to reduce memory footprint on Render
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"

try:
    import torch
    try:
        torch.set_num_threads(1)
    except Exception:
        pass
    try:
        torch.set_num_interop_threads(1)
    except Exception:
        pass
except ImportError:
    pass

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
        Optimized with batch_size=1, no_grad, and garbage collection to prevent OOM on Render.
        """
        import torch
        import gc
        model = cls.get_model()
        with torch.no_grad():
            embeddings = model.encode(texts, batch_size=1, show_progress_bar=False)
        result = np.array(embeddings).astype('float32')
        gc.collect()
        return result

    @classmethod
    def generate_query_embedding(cls, query: str) -> np.ndarray:
        """
        Generates vector embedding for a single user query.
        """
        import torch
        import gc
        model = cls.get_model()
        with torch.no_grad():
            embedding = model.encode(query, batch_size=1, show_progress_bar=False)
        result = np.array(embedding).astype('float32')
        gc.collect()
        return result
