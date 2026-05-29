# Use a lightweight python runtime as parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# Set the working directory in container
WORKDIR /app

# Install libgomp1 (required for FAISS on Linux environments) and other dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file first to utilize Docker layer caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Pre-download the SentenceTransformer model to avoid runtime download delays and timeouts
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

# Copy the rest of the application files
COPY . .

# Expose port
EXPOSE 8000

# Start FastAPI application using uvicorn, honoring the PORT environment variable for Render
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
