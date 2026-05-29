# YouTube Video Q&A Assistant (AI-Powered RAG System)

An advanced, production-ready Full-Stack AI Assistant that allows users to paste any YouTube video URL and ask questions about it. The system fetches the video transcript, chunks it, generates vector embeddings using Sentence Transformers, indexes them using a FAISS vector database, retrieves the most relevant contexts, and utilizes Google Gemini to provide accurate, hallucination-free answers with precise timestamp citations.

---

## 🚀 Key Features

* **Instant Transcript Processing**: Fetches transcripts automatically (supports manual and auto-generated captions).
* **Semantic RAG Pipeline**: Splits transcripts into smart chunks (500–1000 characters with overlap) and generates dense embeddings using `all-MiniLM-L6-v2`.
* **Fast Vector Store**: Indexes chunks using FAISS L2 flat vector index, serializing video states to disk for persistent caching.
* **Timeline Citations**: Clicking on an AI source citation jumps the embedded YouTube player directly to that time segment.
* **Searchable Transcript Viewer**: Highlights matching lines as you type, and supports downloading the full transcript as text.
* **Multi-Video History**: Side panel cache allows users to revisit previously indexed videos and retain independent chat sessions.
* **Premium Glassmorphic Design**: Modern dark/light mode toggle with vibrant gradients and full mobile responsiveness.
* **Zero Hallucination Guarantee**: Strictly binds Google Gemini to the retrieved context; returns a standard fallback if not present.

---

## 🛠️ Tech Stack

### Frontend
* **React 18** (Vite-powered SPA framework)
* **Tailwind CSS** (Modern utility styling and glassmorphic UI components)
* **Axios** (API communication client)
* **Lucide React** (Clean developer icons)

### Backend
* **FastAPI** (High-performance Python Web Framework)
* **Uvicorn** (Asynchronous ASGI server)
* **youtube-transcript-api** (Extract transcripts directly without heavy API keys)
* **Sentence Transformers** (`all-MiniLM-L6-v2` for local high-fidelity embedding generation)
* **FAISS (CPU)** (Facebook AI Similarity Search vector library)
* **Google Generative AI SDK** (`gemini-1.5-flash` for answering queries)
* **Pydantic** (API validation and data schemas)

---

## 📁 Folder Structure

```text
c:/YouTube video q&a assistant/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py              # Pydantic request/response validation schemas
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── qa.py                   # /ask-question endpoint router
│   │   │   └── video.py                # /process-video endpoint router
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── chunking_service.py     # Intelligent character-based text chunker
│   │   │   ├── embedding_service.py    # SentenceTransformers all-MiniLM-L6-v2 singleton
│   │   │   ├── gemini_service.py       # Google Gemini 1.5 Flash prompt orchestration
│   │   │   ├── transcript_service.py   # Subtitles parser with language fallback
│   │   │   └── vector_service.py       # FAISS index creation, search & serialization
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   └── youtube_helper.py       # Video ID extractor and oEmbed metadata scraper
│   │   └── main.py                     # App startup, CORS configuration, and endpoints
│   ├── data/                           # Serialized FAISS indexes and raw transcripts (disk-cached)
│   ├── .env.example
│   ├── .env
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx       # Chat layout with loaders and citation pills
│   │   │   ├── LandingPage.jsx         # URL submission card and features grid
│   │   │   ├── Navbar.jsx              # Active video details, metadata and back button
│   │   │   ├── Sidebar.jsx             # Left drawer with system status and search history
│   │   │   ├── ThemeToggle.jsx         # Dark/Light selector with localStorage persistence
│   │   │   ├── TranscriptViewer.jsx    # Searchable list with down-stream download utilities
│   │   │   └── VideoPlayer.jsx         # Pinned IFrame controller
│   │   ├── services/
│   │   │   └── api.js                  # Axios client to access FastAPI
│   │   ├── App.jsx                     # Root router and state synchronization
│   │   ├── index.css                   # Custom scrollbars, glass layers, and Tailwind bindings
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── index.html
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── package.json
└── docker-compose.yml                  # Root multi-container compositor
```

---

## ⚡ Local Setup Instructions

### Prerequisites
* **Python**: `3.9` through `3.14`
* **Node.js**: `v18` or higher and `npm`
* **Google Gemini API Key**: Obtain one from [Google AI Studio](https://aistudio.google.com/)

---

### Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   * **Windows**:
     ```bash
     python -m venv .venv
     .venv\Scripts\activate
     ```
   * **macOS / Linux**:
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables. Copy `.env.example` to `.env` and enter your Gemini API key:
   ```bash
   copy .env.example .env   # Windows
   cp .env.example .env     # macOS / Linux
   ```
   Edit `.env` and set:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```
5. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```
   * The API docs will be active at: `http://localhost:8000/docs`

---

### Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

---

## 🐳 Docker Deployment (Optional)

You can launch both the frontend and backend instantly using Docker Compose. The setup handles the installation of libraries like `libgomp1` needed for FAISS.

1. Ensure Docker and Docker Compose are installed.
2. Create a `.env` file in the root workspace directory (same level as `docker-compose.yml`) containing:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
3. Run the compose script:
   ```bash
   docker-compose up --build
   ```
4. Open `http://localhost` in your browser. The backend is automatically routed and mapped.

---

## 📡 API Endpoints

### 1. `GET /health`
Verifies backend connectivity and configurations.
* **Response**:
  ```json
  {
    "status": "healthy",
    "version": "1.0.0",
    "services": {
      "database": "ready",
      "gemini_api": "configured",
      "faiss": "available"
    }
  }
  ```

### 2. `POST /process-video`
Extracts transcript, chunks text, generates embeddings, and indexes them.
* **Request**:
  ```json
  {
    "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }
  ```
* **Response**:
  ```json
  {
    "video_id": "dQw4w9WgXcQ",
    "title": "Rick Astley - Never Gonna Give You Up (Official Music Video)",
    "author": "Rick Astley",
    "thumbnail_url": "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    "duration": 212,
    "transcript": [
      { "text": "we're no strangers to love", "start": 0.43, "duration": 4.12 },
      { "text": "you know the rules and so do I", "start": 4.55, "duration": 3.8 }
    ],
    "message": "Video processed and indexed successfully."
  }
  ```

### 3. `POST /ask-question`
Queries the FAISS index and runs RAG query against Google Gemini.
* **Request**:
  ```json
  {
    "video_id": "dQw4w9WgXcQ",
    "question": "What is the key message of the video?"
  }
  ```
* **Response**:
  ```json
  {
    "answer": "The key message of the video is that the speaker is committed to never giving you up, letting you down, running around, deserting you, making you cry, saying goodbye, or telling a lie to hurt you.",
    "sources": [
      {
        "text": "never gonna give you up never gonna let you down never gonna run around and desert you never gonna make you cry never gonna say goodbye never gonna tell a lie and hurt you",
        "start": 18.5,
        "duration": 15.2,
        "score": 0.942
      }
    ]
  }
  ```

---

## 🌍 Cloud Deployment Steps

### Backend Deployment (FastAPI on Render)
1. Commit the backend files to a GitHub repository.
2. Sign up on [Render](https://render.com/) and click **New > Web Service**.
3. Link your repository and set:
   * **Root Directory**: `backend` (if in a monorepo, or leave empty if repository contains only backend)
   * **Runtime**: `Python`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Under **Environment Variables**, add:
   * `GEMINI_API_KEY`: *Your Gemini API Key*
5. Click **Deploy Web Service**.

### Frontend Deployment (React on Vercel)
1. Sign up on [Vercel](https://vercel.com/) and click **Add New > Project**.
2. Connect your repository.
3. Configure the build options:
   * **Root Directory**: `frontend`
   * **Framework Preset**: `Vite`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   * `VITE_API_URL`: *The URL of your Render backend* (e.g. `https://your-backend.onrender.com`)
5. Click **Deploy**.
