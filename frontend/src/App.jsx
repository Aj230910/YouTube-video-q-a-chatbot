import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import VideoPlayer from './components/VideoPlayer';
import ChatInterface from './components/ChatInterface';
import TranscriptViewer from './components/TranscriptViewer';
import { apiService } from './services/api';
import { MessageSquare, FileText, Play } from 'lucide-react';

export default function App() {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('yt_qa_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('yt_qa_chats');
    return saved ? JSON.parse(saved) : {};
  });

  const [activeVideo, setActiveVideo] = useState(null);
  const [activeTimestamp, setActiveTimestamp] = useState(0);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'transcript'

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [qaError, setQaError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync history to localStorage
  useEffect(() => {
    localStorage.setItem('yt_qa_history', JSON.stringify(history));
  }, [history]);

  // Sync chats to localStorage
  useEffect(() => {
    localStorage.setItem('yt_qa_chats', JSON.stringify(chats));
  }, [chats]);

  // Handle URL processing
  const handleProcessVideo = async (videoUrl) => {
    setIsProcessing(true);
    setProcessingError(null);
    try {
      const data = await apiService.processVideo(videoUrl);
      
      const newVideo = {
        video_id: data.video_id,
        title: data.title,
        author: data.author,
        thumbnail_url: data.thumbnail_url,
        duration: data.duration,
        transcript: data.transcript,
      };

      // Add to history if not exists
      setHistory((prev) => {
        const filtered = prev.filter((v) => v.video_id !== newVideo.video_id);
        return [newVideo, ...filtered];
      });

      // Initialize chat with welcome message if it doesn't exist
      if (!chats[data.video_id]) {
        setChats((prev) => ({
          ...prev,
          [data.video_id]: [
            {
              id: `${data.video_id}-welcome`,
              sender: 'ai',
              text: `Hello! I have finished analyzing the video "${data.title}" and indexed its transcript segments. \n\nFeel free to ask me any questions about the content of this video!`,
              sources: [],
              timestamp: Date.now(),
            },
          ],
        }));
      }

      setActiveVideo(newVideo);
      setActiveTimestamp(0);
    } catch (err) {
      setProcessingError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle sending a question
  const handleSendMessage = async (text) => {
    if (!activeVideo || isAnswering) return;

    const videoId = activeVideo.video_id;
    const userMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: text,
      timestamp: Date.now(),
    };

    // Update active video chat logs
    setChats((prev) => ({
      ...prev,
      [videoId]: [...(prev[videoId] || []), userMessage],
    }));

    setIsAnswering(true);
    setQaError(null);

    try {
      const data = await apiService.askQuestion(videoId, text);

      const aiMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        text: data.answer,
        sources: data.sources || [],
        timestamp: Date.now(),
      };

      setChats((prev) => ({
        ...prev,
        [videoId]: [...(prev[videoId] || []), aiMessage],
      }));
    } catch (err) {
      setQaError(err.message);
    } finally {
      setIsAnswering(false);
    }
  };

  const handleSelectVideo = (video) => {
    setActiveVideo(video);
    setActiveTimestamp(0);
    setProcessingError(null);
    setQaError(null);
  };

  const handleNewVideo = () => {
    setActiveVideo(null);
    setProcessingError(null);
    setQaError(null);
  };

  const handleTimestampClick = (timestamp) => {
    setActiveTimestamp(timestamp);
  };

  const activeChatMessages = activeVideo ? chats[activeVideo.video_id] || [] : [];

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 font-sans transition-colors duration-300">
      {/* Sidebar - Collapsible slide-out drawer */}
      <Sidebar
        history={history}
        activeVideoId={activeVideo?.video_id}
        onSelectVideo={(video) => {
          handleSelectVideo(video);
          setIsSidebarOpen(false);
        }}
        onNewVideo={() => {
          handleNewVideo();
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {activeVideo ? (
          <>
            {/* Top Navbar */}
            <Navbar activeVideo={activeVideo} onBack={handleNewVideo} onMenuClick={() => setIsSidebarOpen(true)} />

            {/* Split Screen Panel for Active Session */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-zinc-50 dark:bg-zinc-955 transition-colors duration-300">
              {isMobile ? (
                /* Mobile/Tablet Layout: Render player, tabs bar, and selected tab view */
                <div className="flex-1 flex flex-col min-w-0 h-full p-4 md:p-6 overflow-hidden max-w-3xl mx-auto w-full">
                  <div className="mb-4 shadow-md rounded-2xl overflow-hidden">
                    <VideoPlayer videoId={activeVideo.video_id} startTimestamp={activeTimestamp} />
                  </div>
                  
                  {/* Tabs bar */}
                  <div className="flex border border-zinc-200/60 dark:border-zinc-800/60 mb-4 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md rounded-2xl p-1 shadow-sm">
                    <button
                      onClick={() => setActiveTab('chat')}
                      className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-extrabold transition-all cursor-pointer ${
                        activeTab === 'chat'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat Assistant</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('transcript')}
                      className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-extrabold transition-all cursor-pointer ${
                        activeTab === 'transcript'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>Transcript</span>
                    </button>
                  </div>

                  {/* Tab Contents */}
                  <div className="flex-1 overflow-hidden relative">
                    {activeTab === 'chat' ? (
                      <ChatInterface
                        messages={activeChatMessages}
                        onSendMessage={handleSendMessage}
                        isLoading={isAnswering}
                        error={qaError}
                        onTimestampClick={handleTimestampClick}
                      />
                    ) : (
                      <TranscriptViewer
                        transcript={activeVideo.transcript}
                        onTimestampClick={handleTimestampClick}
                        videoTitle={activeVideo.title}
                        activeTimestamp={activeTimestamp}
                      />
                    )}
                  </div>
                </div>
              ) : (
                /* Desktop Layout: Split pane with chat on left and player/transcript on right */
                <>
                  {/* Left Column: Chat Area */}
                  <div className="flex-1 flex flex-col min-w-0 h-full p-6 pr-3 overflow-hidden">
                    <ChatInterface
                      messages={activeChatMessages}
                      onSendMessage={handleSendMessage}
                      isLoading={isAnswering}
                      error={qaError}
                      onTimestampClick={handleTimestampClick}
                    />
                  </div>

                  {/* Right Column: Video player & Transcript Viewer */}
                  <div className="flex w-[460px] lg:w-[480px] xl:w-[580px] flex-shrink-0 flex-col h-full p-6 pl-3 overflow-hidden gap-6">
                    <div className="shadow-lg rounded-2xl overflow-hidden">
                      <VideoPlayer videoId={activeVideo.video_id} startTimestamp={activeTimestamp} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <TranscriptViewer
                        transcript={activeVideo.transcript}
                        onTimestampClick={handleTimestampClick}
                        videoTitle={activeVideo.title}
                        activeTimestamp={activeTimestamp}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          /* Landing Screen */
          <LandingPage
            onProcess={handleProcessVideo}
            isLoading={isProcessing}
            error={processingError}
            onMenuClick={() => setIsSidebarOpen(true)}
          />
        )}
      </div>
    </div>
  );
}
