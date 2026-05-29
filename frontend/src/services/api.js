import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // transcripts or embedding generation might take a bit of time
});

export const apiService = {
  /**
   * Sends the YouTube URL to the backend to fetch transcripts and build the vector index.
   */
  processVideo: async (videoUrl) => {
    try {
      const response = await apiClient.post('/process-video', { video_url: videoUrl });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || error.message || 'Failed to process YouTube video. Please try again.';
      throw new Error(message);
    }
  },

  /**
   * Sends the user's question along with the video ID to receive RAG-generated answers and sources.
   */
  askQuestion: async (videoId, question) => {
    try {
      const response = await apiClient.post('/ask-question', {
        video_id: videoId,
        question: question,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || error.message || 'Failed to get an answer. Please try again.';
      throw new Error(message);
    }
  },

  /**
   * Performs a backend system health check.
   */
  checkHealth: async () => {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Backend server is offline or unreachable.');
    }
  },
};
