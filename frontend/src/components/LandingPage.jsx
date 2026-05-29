import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Search, Brain, FileText, Compass, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LandingPage({ onProcess, isLoading, error }) {
  const [url, setUrl] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);

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

  // Stepper logic for simulating indexing progress
  useEffect(() => {
    if (!isLoading) {
      setLoadingStep(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < 3) return prev + 1;
        return prev;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-main)] relative flex flex-col items-center justify-center p-6 md:p-12 min-h-[calc(100vh-4rem)]">
      
      {/* Background cinematic glows */}
      <div className="glow-primary top-10 left-10 animate-pulse-ambient" />
      <div className="glow-accent bottom-10 right-10 animate-pulse-ambient" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-2xl flex flex-col items-center relative z-10 text-center py-8">
        
        {/* Premium Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-panel)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-[11px] font-bold mb-6 shadow-md animate-float"
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--primary)] fill-[var(--accent-glow)]" />
          <span>AI-Powered Video Transcription Q&A</span>
        </motion.div>

        {/* Title & Subtitle */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] leading-tight font-sans"
        >
          Chat With Any{' '}
          <span className="text-gradient-accent">
            YouTube Video
          </span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[var(--text-secondary)] mt-4 text-sm md:text-base max-w-md font-medium leading-relaxed"
        >
          Extract insights, ask questions, and understand videos instantly with AI.
        </motion.p>

        {/* Input Card or Loading Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full mt-10 glass-card rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden transition-all duration-350"
        >
          {/* Subtle top primary gradient line inside card */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--primary)]/60 to-transparent" />

          <AnimatePresence mode="wait">
            {!isLoading ? (
              <motion.form 
                key="input-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit} 
                className="flex flex-col gap-6"
              >
                {/* Input with Neon Border focus */}
                <div className="relative flex items-center rounded-2xl neon-border">
                  <div className="absolute left-4 text-[var(--text-secondary)]">
                    <Video className="w-5 h-5" />
                  </div>
                  <input
                    type="url"
                    placeholder="Paste YouTube video link here..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none font-semibold text-sm md:text-base"
                  />
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-950/10 border border-red-900/30 text-red-400 text-xs text-left font-semibold flex items-start gap-2.5">
                    <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5 text-red-500" />
                    <div>
                      <span className="font-extrabold uppercase tracking-wider block text-[9px] mb-0.5 text-red-500">Indexing Failure</span>
                      {error}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-200 text-sm relative overflow-hidden group cursor-pointer btn-premium ${
                    isValid
                      ? 'bg-[var(--primary)] hover:bg-[var(--accent-hover)] text-white shadow-lg shadow-[var(--accent-glow)]'
                      : 'bg-[var(--bg-hover)] border border-[var(--border-subtle)] text-[var(--text-muted)] cursor-not-allowed'
                  }`}
                >
                  <Search className="w-4 h-4 group-hover:scale-105 transition-transform" />
                  <span className="tracking-wide font-extrabold">Ingest and Start Conversation</span>
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="loading-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center py-4"
              >
                {/* Apple-style spinning loader ring */}
                <div className="relative w-16 h-16 mb-8 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-[var(--border-subtle)] rounded-full" />
                  <div className="absolute inset-0 border-4 border-t-[var(--primary)] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                  <Sparkles className="w-6 h-6 text-[var(--primary)] animate-pulse" />
                </div>

                <h3 className="font-bold text-[var(--text-primary)] text-base mb-2">
                  Processing YouTube Video
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mb-6 max-w-sm">
                  We are indexing the video transcript segments to build a semantic database.
                </p>

                {/* Stepper Status Indicators */}
                <div className="w-full max-w-md flex flex-col gap-3.5 text-left border-t border-[var(--border-subtle)] pt-6">
                  {[
                    "Extracting video metadata and thumbnail...",
                    "Downloading transcript from Supadata API...",
                    "Chunking and creating FAISS vector index...",
                    "Preparing interactive chat assistant..."
                  ].map((step, index) => {
                    const isCompleted = loadingStep > index;
                    const isActive = loadingStep === index;

                    return (
                      <div 
                        key={index} 
                        className={`flex items-center gap-3 text-xs transition-colors duration-300 ${
                          isCompleted ? 'text-[var(--text-primary)]' : isActive ? 'text-[var(--primary)] font-bold' : 'text-[var(--text-muted)]'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        ) : isActive ? (
                          <div className="w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-[var(--border-color)] flex-shrink-0" />
                        )}
                        <span>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Features List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full mt-12 max-w-3xl"
        >
          <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] p-6 rounded-3xl text-left hover:border-[var(--primary)]/30 hover:shadow-lg transition-all duration-300">
            <div className="w-10 h-10 rounded-2xl bg-[var(--accent-glow)] text-[var(--primary)] flex items-center justify-center mb-4 border border-[var(--primary)]/10">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-[var(--text-primary)] text-xs md:text-sm font-sans">
              Semantic Search
            </h3>
            <p className="text-[var(--text-secondary)] text-[11px] mt-2 leading-relaxed font-medium">
              Split into overlapping chunks and vectorized via Sentence Transformers. Matching models pull accurate contexts directly.
            </p>
          </div>

          <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] p-6 rounded-3xl text-left hover:border-[var(--primary)]/30 hover:shadow-lg transition-all duration-300">
            <div className="w-10 h-10 rounded-2xl bg-[var(--accent-glow)] text-[var(--primary)] flex items-center justify-center mb-4 border border-[var(--primary)]/10">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-[var(--text-primary)] text-xs md:text-sm font-sans">
              Zero Hallucinations
            </h3>
            <p className="text-[var(--text-secondary)] text-[11px] mt-2 leading-relaxed font-medium">
              Gemini answers queries based exclusively on context. The model will refuse to synthesize external assumptions.
            </p>
          </div>

          <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] p-6 rounded-3xl text-left hover:border-[var(--primary)]/30 hover:shadow-lg transition-all duration-300">
            <div className="w-10 h-10 rounded-2xl bg-[var(--accent-glow)] text-[var(--primary)] flex items-center justify-center mb-4 border border-[var(--primary)]/10">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-[var(--text-primary)] text-xs md:text-sm font-sans">
              Citations & Player
            </h3>
            <p className="text-[var(--text-secondary)] text-[11px] mt-2 leading-relaxed font-medium">
              Each response provides precise timeline source links. Clicking on sources immediately controls the video player location.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
