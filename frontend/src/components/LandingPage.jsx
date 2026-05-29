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
    <div className="flex-1 overflow-y-auto bg-[#0F0F0F] relative flex flex-col items-center justify-center p-6 md:p-12 min-h-screen">
      
      {/* Background cinematic red glows */}
      <div className="glow-primary top-10 left-10 animate-pulse-ambient" />
      <div className="glow-accent bottom-10 right-10 animate-pulse-ambient" style={{ animationDelay: '2s' }} />

      {/* Mobile top bar */}
      <div className="w-full md:hidden absolute top-0 inset-x-0 h-16 flex items-center justify-between px-6 border-b border-[#303030]/50 backdrop-blur-md bg-[#0F0F0F]/60 z-30">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl bg-[#212121]/70 hover:bg-[#212121] border border-[#303030]/50 text-[#AAAAAA] transition-all cursor-pointer btn-premium"
        >
          <Menu className="w-4 h-4" />
        </button>
        <span className="font-extrabold text-xs tracking-wider uppercase text-white font-sans">
          YT Assistant
        </span>
        <div className="w-8" />
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center relative z-10 text-center py-8">
        
        {/* Premium Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A1A1A] border border-[#303030] text-[#AAAAAA] text-[11px] font-bold mb-6 shadow-lg animate-float">
          <Sparkles className="w-3.5 h-3.5 text-[#FF0000] fill-[#FF0000]/10" />
          <span>AI-Powered Video Transcription Q&A</span>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
          Talk to any{' '}
          <span className="text-gradient-red">
            YouTube Video
          </span>
        </h2>
        
        <p className="text-[#AAAAAA] mt-4 text-sm md:text-base max-w-md font-medium leading-relaxed">
          Index your video transcript instantly. Ask questions and get real-time answers with interactive timeline citations.
        </p>

        {/* Input Card */}
        <div className="w-full mt-10 glass-card rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden transition-all duration-350 hover:border-[#FF0000]/30">
          
          {/* Subtle top red glow line inside card */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FF0000]/60 to-transparent" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Input with Neon Border focus */}
            <div className="relative flex items-center rounded-2xl border border-[#303030] bg-[#1A1A1A] focus-within:ring-4 focus-within:ring-red-500/10 focus-within:border-[#FF0000] transition-all duration-300">
              <div className="absolute left-4 text-[#AAAAAA]">
                <Video className={`w-5 h-5 ${isLoading ? 'animate-pulse text-[#FF0000]' : ''}`} />
              </div>
              <input
                type="url"
                placeholder="Paste YouTube video link here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-transparent text-white placeholder-zinc-500 focus:outline-none font-semibold text-sm md:text-base"
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/30 text-red-400 text-xs text-left font-semibold flex items-start gap-2.5">
                <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5 text-[#FF0000]" />
                <div>
                  <span className="font-extrabold uppercase tracking-wider block text-[9px] mb-0.5 text-red-500">Indexing Failure</span>
                  {error}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isValid}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-200 text-sm relative overflow-hidden group cursor-pointer btn-premium ${
                isLoading
                  ? 'bg-[#1A1A1A] text-zinc-600 border border-[#303030] cursor-not-allowed'
                  : isValid
                  ? 'bg-[#FF0000] hover:bg-[#CC0000] text-white shadow-lg shadow-red-500/15 hover:shadow-red-500/30 active:scale-[0.98]'
                  : 'bg-[#1A1A1A] border border-[#303030] text-zinc-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  <span className="tracking-wide text-[#AAAAAA]">Analyzing Video & Loading Vector Store...</span>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full mt-12 max-w-3xl">
          
          <div className="bg-[#1A1A1A] border border-[#303030] p-6 rounded-2xl text-left hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-red-950/20 text-[#FF0000] flex items-center justify-center mb-4 border border-red-900/30">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-white text-xs md:text-sm font-sans">
              Semantic Search
            </h3>
            <p className="text-[#AAAAAA] text-[11px] mt-2 leading-relaxed font-medium">
              Split into overlapping chunks and vectorized via Sentence Transformers. Matching models pull accurate contexts directly.
            </p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#303030] p-6 rounded-2xl text-left hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-blue-950/20 text-[#3B82F6] flex items-center justify-center mb-4 border border-blue-900/30">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-white text-xs md:text-sm font-sans">
              Zero Hallucinations
            </h3>
            <p className="text-[#AAAAAA] text-[11px] mt-2 leading-relaxed font-medium">
              Gemini answers queries based exclusively on context. The model will refuse to synthesize external assumptions.
            </p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#303030] p-6 rounded-2xl text-left hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-purple-950/20 text-purple-400 flex items-center justify-center mb-4 border border-purple-900/30">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-white text-xs md:text-sm font-sans">
              Citations & Player
            </h3>
            <p className="text-[#AAAAAA] text-[11px] mt-2 leading-relaxed font-medium">
              Each response provides precise timeline source links. Clicking on sources immediately controls the video player location.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
