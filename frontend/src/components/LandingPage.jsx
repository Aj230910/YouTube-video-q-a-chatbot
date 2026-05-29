import React, { useState } from 'react';
import { Video, Search, Brain, FileText, Compass, Sparkles, AlertCircle, Menu } from 'lucide-react';

export default function LandingPage({ onProcess, isLoading, error, onMenuClick }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    onProcess(url.trim());
  };

  const isYouTubeUrl = (testUrl) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    return regExp.test(testUrl);
  };

  const isValid = url.trim() && isYouTubeUrl(url);

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 relative flex flex-col items-center justify-center p-6 md:p-12 min-h-screen">
      
      {/* Mobile top bar */}
      <div className="w-full md:hidden absolute top-0 inset-x-0 h-16 flex items-center justify-between px-6 border-b border-zinc-200/40 dark:border-zinc-800/20 backdrop-blur-md bg-white/40 dark:bg-zinc-950/20 z-30">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl bg-white/70 hover:bg-white dark:bg-zinc-900/70 dark:hover:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/40 text-zinc-600 dark:text-zinc-400 transition-all cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>
        <span className="font-extrabold text-xs tracking-wider uppercase text-zinc-800 dark:text-zinc-200">
          YT Assistant
        </span>
        <div className="w-8" />
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center relative z-10 text-center py-8">
        
        {/* Premium Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/85 text-zinc-650 dark:text-zinc-350 text-[11px] font-bold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
          <span>AI-Powered Video Transcription Q&A</span>
        </div>

        {/* Premium Title */}
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          Talk to any{' '}
          <span className="text-blue-600 dark:text-blue-500">
            YouTube Video
          </span>
        </h2>
        
        <p className="text-zinc-500 dark:text-zinc-400 mt-3 text-sm md:text-base max-w-md font-semibold leading-relaxed">
          Index your video transcript instantly. Ask questions and get real-time answers with interactive timeline citations.
        </p>

        {/* Apple Form Card */}
        <div className="w-full mt-8 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 md:p-8 shadow-sm relative">
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Input Wrapper with Neon Glow Focus */}
            <div className="relative flex items-center rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-950 focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all">
              <div className="absolute left-4 text-zinc-400 dark:text-zinc-600 z-10">
                <Video className={`w-5 h-5 ${isLoading ? 'animate-pulse text-blue-500' : ''}`} />
              </div>
              <input
                type="url"
                placeholder="Paste YouTube video link here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-transparent text-zinc-900 dark:text-white placeholder-zinc-450 focus:outline-none font-semibold text-sm md:text-base relative z-10"
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/40 dark:border-red-900/30 text-red-650 dark:text-red-400 text-xs text-left font-bold flex items-start gap-2.5">
                <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5 text-red-500" />
                <div>
                  <span className="font-extrabold uppercase tracking-wider block text-[9px] mb-0.5">Indexing Failure</span>
                  {error}
                </div>
              </div>
            )}

            {/* Apple Button with hover effects */}
            <button
              type="submit"
              disabled={isLoading || !isValid}
              className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm relative overflow-hidden group cursor-pointer ${
                isLoading
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed border border-zinc-200/20'
                  : isValid
                  ? 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-sm hover:shadow active:scale-[0.99] transition-all'
                  : 'bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/20 dark:border-zinc-800/40 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                  <span className="tracking-wide">Analyzing Video & Loading Vector Store...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 group-hover:scale-105 transition-transform" />
                  <span className="tracking-wide font-extrabold">Ingest and Start Conversation</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Features List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-10 max-w-3xl">
          
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-xl text-left hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <Brain className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-extrabold text-zinc-850 dark:text-zinc-150 text-xs md:text-sm">
              Semantic Search
            </h3>
            <p className="text-zinc-500 dark:text-zinc-450 text-[11px] mt-1.5 leading-relaxed font-semibold">
              Split into overlapping chunks and vectorized via Sentence Transformers. Matching models pull accurate contexts directly.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-xl text-left hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-3">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-extrabold text-zinc-850 dark:text-zinc-150 text-xs md:text-sm">
              Zero Hallucinations
            </h3>
            <p className="text-zinc-500 dark:text-zinc-455 text-[11px] mt-1.5 leading-relaxed font-semibold">
              Gemini answers queries based exclusively on context. The model will refuse to synthesize external assumptions.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-xl text-left hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
              <Compass className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-extrabold text-zinc-850 dark:text-zinc-150 text-xs md:text-sm">
              Citations & Player
            </h3>
            <p className="text-zinc-500 dark:text-zinc-450 text-[11px] mt-1.5 leading-relaxed font-semibold">
              Each response provides precise timeline source links. Clicking on sources immediately controls the video player location.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

