import React from 'react';
import { Video } from 'lucide-react';

export default function VideoPlayer({ videoId, startTimestamp }) {
  if (!videoId) {
    return (
      <div className="w-full aspect-video rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400">
        <Video className="w-12 h-12 stroke-[1.5]" />
      </div>
    );
  }

  // Generate embed URL with start parameter to seek to timestamp.
  // Add key using startTimestamp to force iframe reload on timestamp click.
  const embedUrl = `https://www.youtube.com/embed/${videoId}?start=${Math.floor(startTimestamp)}&autoplay=1&enablejsapi=1`;

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-slate-200/60 dark:border-slate-800/60 bg-black relative group">
      <iframe
        key={`${videoId}-${Math.floor(startTimestamp)}`}
        src={embedUrl}
        title="YouTube video player"
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
