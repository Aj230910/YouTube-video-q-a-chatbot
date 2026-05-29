import React, { useState, useRef, useEffect } from 'react';
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
        return <strong key={index} className="font-extrabold text-slate-950 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700/60 text-brand-650 dark:text-brand-400 rounded text-xs font-mono font-bold border border-slate-300/40 dark:border-slate-800/40">
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
    
    // Split by code blocks first
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const language = lines[0] && !lines[0].includes(' ') ? lines[0] : '';
        const code = language ? lines.slice(1).join('\n') : lines.join('\n');
        
        return (
          <pre key={index} className="my-2.5 p-3.5 bg-slate-950 dark:bg-slate-950 text-slate-100 rounded-xl overflow-x-auto text-[11px] font-mono leading-relaxed border border-slate-800/80 shadow-inner">
            {language && (
              <div className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold mb-1.5 border-b border-slate-900 pb-1">
                {language}
              </div>
            )}
            <code>{code}</code>
          </pre>
        );
      }
      
      const lines = part.split('\n');
      return (
        <div key={index} className="flex flex-col gap-1">
          {lines.map((line, lineIdx) => {
            const trimmed = line.trim();
            // Headers
            if (trimmed.startsWith('### ')) {
              return (
                <h4 key={lineIdx} className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white mt-3 mb-1">
                  {parseInlineStyles(trimmed.substring(4))}
                </h4>
              );
            }
            if (trimmed.startsWith('## ')) {
              return (
                <h3 key={lineIdx} className="font-extrabold text-base md:text-lg text-slate-900 dark:text-white mt-4 mb-1">
                  {parseInlineStyles(trimmed.substring(3))}
                </h3>
              );
            }
            if (trimmed.startsWith('# ')) {
              return (
                <h2 key={lineIdx} className="font-extrabold text-lg md:text-xl text-slate-900 dark:text-white mt-5 mb-1">
                  {parseInlineStyles(trimmed.substring(2))}
                </h2>
              );
            }
            
            // Bullet lists
            if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
              return (
                <li key={lineIdx} className="ml-4 list-disc text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed my-0.5 pl-1">
                  {parseInlineStyles(trimmed.substring(2))}
                </li>
              );
            }

            // Numbered lists
            const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
            if (numMatch) {
              return (
                <div key={lineIdx} className="ml-2 flex items-start gap-1.5 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed my-0.5">
                  <span className="font-bold text-brand-600 dark:text-brand-400">{numMatch[1]}.</span>
                  <span>{parseInlineStyles(numMatch[2])}</span>
                </div>
              );
            }
            
            // Regular paragraphs
            return trimmed === '' ? (
              <div key={lineIdx} className="h-1.5" />
            ) : (
              <p key={lineIdx} className="text-xs md:text-sm leading-relaxed my-0.5">
                {parseInlineStyles(line)}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-md transition-all duration-300">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 relative">
        <div className="flex items-center gap-3">
          <div className="bg-brand-100 dark:bg-brand-950/40 border border-brand-200/40 dark:border-brand-900/40 text-brand-650 dark:text-brand-400 p-2 rounded-xl">
            <Brain className="w-4.5 h-4.5 animate-pulse-slow" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-850 dark:text-slate-150 text-xs md:text-sm">
              AI Assistant Q&A
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">
              Grounded strictly in video content to prevent hallucination
            </p>
          </div>
        </div>
        
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100/50 dark:border-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span>RAG Pipeline</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-brand-500/10 rounded-full blur-xl pulse-ring-slow" />
              <div className="relative bg-gradient-to-tr from-brand-100 to-indigo-50 dark:from-brand-950 dark:to-slate-900 p-5 rounded-full border border-brand-200/40 dark:border-brand-900/40 text-brand-600 dark:text-brand-400 shadow-inner">
                <Sparkles className="w-10 h-10" />
              </div>
            </div>
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm md:text-base">
              Ask Anything About the Video
            </h4>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-2 leading-relaxed font-semibold">
              Pose your question and Gemini will search the segmented transcript index to synthesize a precise cited response.
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isUser = message.sender === 'user';
            return (
              <div
                key={message.id}
                className={`flex gap-3 max-w-[88%] ${isUser ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border text-xs shadow-sm ${
                    isUser
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                      : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-800 dark:border-zinc-200 shadow'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4 stroke-[2]" /> : <Brain className="w-4 h-4" />}
                </div>

                {/* Message Body */}
                <div className="flex flex-col gap-2 max-w-full">
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-none font-bold text-xs md:text-sm'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-850 dark:text-zinc-200 rounded-tl-none border border-zinc-200/40 dark:border-zinc-750 font-semibold'
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
                    <div className="mt-1 flex flex-col gap-2">
                      <span className="text-[9px] text-slate-450 dark:text-slate-500 font-extrabold uppercase tracking-widest pl-1">
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
                              className="flex flex-col rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 overflow-hidden max-w-full hover:border-brand-500/50 hover:bg-white dark:hover:bg-slate-900 transition-all duration-200 shadow-sm"
                            >
                              <div className="flex items-center gap-2 px-2.5 py-1.5 select-none">
                                {/* Time trigger pill */}
                                <button
                                  onClick={() => onTimestampClick(src.start)}
                                  className="flex items-center gap-1 text-[10px] font-extrabold text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 transition-colors cursor-pointer group"
                                  title="Jump to timeline"
                                >
                                  <Play className="w-2.5 h-2.5 fill-current stroke-none group-hover:scale-110 transition-transform" />
                                  <span>{formatTime(src.start)}</span>
                                </button>
                                
                                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 border-l border-slate-200 dark:border-slate-800 pl-2">
                                  {percentMatch}% Match
                                </span>

                                <button
                                  onClick={() => toggleSourceExpand(message.id, index)}
                                  className="text-slate-400 dark:text-slate-500 hover:text-slate-750 dark:hover:text-slate-350 ml-1 cursor-pointer transition-colors"
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
                                <div className="px-3 pb-3 pt-1.5 border-t border-slate-200/50 dark:border-slate-850/60 max-w-sm border-l-2 border-l-brand-500">
                                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed italic font-semibold">
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
              </div>
            );
          })
        )}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex gap-3 max-w-[85%] self-start">
            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border bg-gradient-to-tr from-brand-600 to-indigo-600 text-white border-brand-500 animate-pulse">
              <Brain className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-850 dark:text-slate-200 rounded-tl-none flex items-center gap-1.5 shadow-sm border border-slate-200/10">
              <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {/* Error inside chat */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-800/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2 max-w-[85%] self-center shadow-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form with Neon Glow Focus */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-200/60 dark:border-slate-800/60 flex gap-2 bg-slate-50/30 dark:bg-slate-900/30">
        <div className="flex-1 relative flex items-center rounded-xl neon-border">
          <input
            type="text"
            placeholder="Ask a question about this video..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 text-xs md:text-sm rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all font-semibold relative z-10"
          />
        </div>
        
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`p-3 rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer ${
            !input.trim() || isLoading
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-350 dark:text-zinc-600 cursor-not-allowed border border-zinc-200/20'
              : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-750 text-white shadow-sm active:scale-[0.93]'
          }`}
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </form>
    </div>
  );
}

