import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Brain, AlertCircle, Clock, ChevronDown, ChevronUp, Play } from 'lucide-react';

export default function ChatInterface({ messages, onSendMessage, isLoading, error, onTimestampClick }) {
  const [input, setInput] = useState('');
  const [expandedSourceIndex, setExpandedSourceIndex] = useState(null);
  const messagesEndRef = useRef(null);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleSourceExpand = (msgId, srcIdx) => {
    if (expandedSourceIndex && expandedSourceIndex.msgId === msgId && expandedSourceIndex.srcIdx === srcIdx) {
      setExpandedSourceIndex(null);
    } else {
      setExpandedSourceIndex({ msgId, srcIdx });
    }
  };

  // Custom inline styles parser for **bold** and `inline code`
  const parseInlineStyles = (text) => {
    if (!text) return '';
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-extrabold text-[var(--text-primary)]">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="px-1.5 py-0.5 bg-[var(--bg-main)] text-[var(--primary)] rounded text-xs font-mono font-bold border border-[var(--border-subtle)]">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  // Custom rich message text formatter (handles code blocks, lists, headers)
  const formatMessageText = (text) => {
    if (!text) return null;
    
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const language = lines[0] && !lines[0].includes(' ') ? lines[0] : '';
        const code = language ? lines.slice(1).join('\n') : lines.join('\n');
        
        return (
          <pre key={index} className="my-2.5 p-3.5 bg-[var(--bg-main)] text-[var(--text-primary)] rounded-xl overflow-x-auto text-[11px] font-mono leading-relaxed border border-[var(--border-subtle)] shadow-inner">
            {language && (
              <div className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)] font-extrabold mb-1.5 border-b border-[var(--border-subtle)] pb-1">
                {language}
              </div>
            )}
            <code>{code}</code>
          </pre>
        );
      }
      
      const lines = part.split('\n');
      return (
        <div key={index} className="flex flex-col gap-1.5">
          {lines.map((line, lineIdx) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('### ')) {
              return (
                <h4 key={lineIdx} className="font-extrabold text-sm md:text-base text-[var(--text-primary)] mt-3 mb-1">
                  {parseInlineStyles(trimmed.substring(4))}
                </h4>
              );
            }
            if (trimmed.startsWith('## ')) {
              return (
                <h3 key={lineIdx} className="font-extrabold text-base md:text-lg text-[var(--text-primary)] mt-4 mb-1">
                  {parseInlineStyles(trimmed.substring(3))}
                </h3>
              );
            }
            if (trimmed.startsWith('# ')) {
              return (
                <h2 key={lineIdx} className="font-extrabold text-lg md:text-xl text-[var(--text-primary)] mt-5 mb-1">
                  {parseInlineStyles(trimmed.substring(2))}
                </h2>
              );
            }
            
            if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
              return (
                <li key={lineIdx} className="ml-4 list-disc text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed my-0.5 pl-1 font-medium">
                  {parseInlineStyles(trimmed.substring(2))}
                </li>
              );
            }

            const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
            if (numMatch) {
              return (
                <div key={lineIdx} className="ml-2 flex items-start gap-1.5 text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed my-0.5 font-medium">
                  <span className="font-bold text-[var(--primary)]">{numMatch[1]}.</span>
                  <span>{parseInlineStyles(numMatch[2])}</span>
                </div>
              );
            }
            
            return trimmed === '' ? (
              <div key={lineIdx} className="h-1.5" />
            ) : (
              <p key={lineIdx} className="text-xs md:text-sm leading-relaxed my-0.5 text-[var(--text-primary)] font-medium">
                {parseInlineStyles(line)}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden shadow-2xl relative transition-all duration-300">
      
      {/* Cinematic ambient glow inside chat panel */}
      <div className="glow-primary -top-20 -left-20 opacity-30 animate-pulse-ambient" />

      {/* Header */}
      <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-panel-80)] backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-[var(--accent-glow)] border border-[var(--primary)]/10 text-[var(--primary)] p-2.5 rounded-xl">
            <Brain className="w-4.5 h-4.5 animate-pulse-slow" />
          </div>
          <div>
            <h3 className="font-extrabold text-[var(--text-primary)] text-xs md:text-sm font-sans">
              AI Assistant Q&A
            </h3>
            <p className="text-[10px] text-[var(--text-secondary)] font-semibold mt-0.5">
              Grounded strictly in video content to prevent hallucination
            </p>
          </div>
        </div>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-[10px] font-bold">
          <Sparkles className="w-3 h-3 text-[var(--primary)]" />
          <span>RAG Pipeline</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6 relative z-10 scrollbar-thin">
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <motion.div 
              key="empty-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto"
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-[var(--primary)]/5 rounded-full blur-xl animate-pulse-ambient" />
                <div className="relative bg-gradient-to-tr from-[var(--bg-hover)] to-[var(--bg-panel)] p-6 rounded-full border border-[var(--border-subtle)] text-[var(--primary)] shadow-2xl animate-float">
                  <Sparkles className="w-10 h-10" />
                </div>
              </div>
              <h4 className="font-extrabold text-[var(--text-primary)] text-sm md:text-base font-sans">
                Ask Anything About the Video
              </h4>
              <p className="text-[var(--text-secondary)] text-xs mt-2.5 leading-relaxed font-semibold">
                Pose your question and Gemini will search the segmented transcript index to synthesize a precise cited response.
              </p>
            </motion.div>
          ) : (
            messages.map((message) => {
              const isUser = message.sender === 'user';
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3.5 max-w-[88%] ${isUser ? 'self-end flex-row-reverse' : 'self-start'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border text-xs shadow-md transition-transform duration-200 hover:scale-105 ${
                      isUser
                        ? 'bg-[var(--bg-hover)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
                        : 'bg-[var(--primary)] text-white border-transparent'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4 stroke-[2]" /> : <Brain className="w-4 h-4" />}
                  </div>

                  {/* Message Body */}
                  <div className="flex flex-col gap-2 max-w-full">
                    <div
                      className={`p-4 rounded-2xl leading-relaxed shadow-lg ${
                        isUser
                          ? 'bg-[var(--accent)] text-white rounded-tr-none font-bold text-xs md:text-sm shadow-[var(--accent-glow)]'
                          : 'bg-[var(--bg-hover)] text-[var(--text-primary)] rounded-tl-none border border-[var(--border-subtle)] font-medium text-xs md:text-sm'
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{message.text}</p>
                      ) : (
                        formatMessageText(message.text)
                      )}
                    </div>

                    {/* Sources / Citations for AI answers */}
                    {!isUser && message.sources && message.sources.length > 0 && (
                      <div className="mt-2 flex flex-col gap-2">
                        <span className="text-[9px] text-[var(--text-secondary)] font-extrabold uppercase tracking-widest pl-1">
                          Timeline Citations:
                        </span>
                        
                        <div className="flex flex-wrap gap-2">
                          {message.sources.map((src, index) => {
                            const isExpanded =
                              expandedSourceIndex &&
                              expandedSourceIndex.msgId === message.id &&
                              expandedSourceIndex.srcIdx === index;
                              
                            const percentMatch = Math.round(src.score * 100);

                            return (
                              <div
                                key={index}
                                className="flex flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-panel-80)] overflow-hidden max-w-full hover:border-[var(--primary)]/40 hover:bg-[var(--bg-hover)] transition-all duration-200 shadow-md"
                              >
                                <div className="flex items-center gap-2.5 px-3 py-2 select-none">
                                  {/* Time trigger pill */}
                                  <button
                                    onClick={() => onTimestampClick(src.start)}
                                    className="flex items-center gap-1.5 text-[10px] font-extrabold text-[var(--primary)] hover:text-[var(--accent-hover)] transition-colors cursor-pointer group"
                                    title="Jump to timeline"
                                  >
                                    <Play className="w-2.5 h-2.5 fill-current stroke-none group-hover:scale-110 transition-transform" />
                                    <span>{formatTime(src.start)}</span>
                                  </button>
                                  
                                  <span className="text-[9px] font-bold text-[var(--text-secondary)] border-l border-[var(--border-subtle)] pl-2.5">
                                    {percentMatch}% Match
                                  </span>

                                  <button
                                    onClick={() => toggleSourceExpand(message.id, index)}
                                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] ml-1.5 cursor-pointer transition-colors"
                                    title="Toggle transcript text"
                                  >
                                    {isExpanded ? (
                                      <ChevronUp className="w-3.5 h-3.5" />
                                    ) : (
                                      <ChevronDown className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>

                                {isExpanded && (
                                  <div className="px-3 pb-3 pt-2 border-t border-[var(--border-subtle)] max-w-sm border-l-2 border-l-[var(--primary)]">
                                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed italic font-semibold">
                                      "{src.text}"
                                    </p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}

          {/* Loading Bubble */}
          {isLoading && (
            <motion.div 
              key="loading-bubble"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3 max-w-[85%] self-start"
            >
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-[var(--primary)] text-white animate-pulse">
                <Brain className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-tl-none flex items-center gap-1.5 shadow-lg">
                <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}

          {/* Error inside chat */}
          {error && (
            <motion.div 
              key="chat-error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-xl bg-red-950/10 border border-red-900/30 text-red-400 text-xs font-semibold flex items-center gap-2 max-w-[85%] self-center shadow-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form with Neon Glow Focus */}
      <form onSubmit={handleSend} className="p-4 border-t border-[var(--border-subtle)] flex gap-2 bg-[var(--bg-panel)] relative z-10">
        <div className="flex-1 relative flex items-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-main)] focus-within:ring-4 focus-within:ring-[var(--primary)]/10 focus-within:border-[var(--primary)] transition-all duration-300">
          <input
            type="text"
            placeholder="Ask a question about this video..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3.5 text-xs md:text-sm bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none font-semibold relative z-10"
          />
        </div>
        
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`p-3.5 rounded-2xl transition-all duration-250 flex items-center justify-center cursor-pointer btn-premium ${
            !input.trim() || isLoading
              ? 'bg-[var(--bg-hover)] text-[var(--text-muted)] border border-[var(--border-subtle)] cursor-not-allowed'
              : 'bg-[var(--primary)] hover:bg-[var(--accent-hover)] text-white shadow-lg shadow-[var(--accent-glow)] active:scale-[0.94]'
          }`}
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </form>
    </div>
  );
}
