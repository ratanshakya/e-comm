'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ShoppingBag, Volume2, VolumeX } from 'lucide-react';

interface VideoItem {
  videoUrl: string;
  linkedProductName: string;
  linkedProductPrice: number;
  linkedProductUrl: string;
  linkedProductImage?: string;
}

interface InstagramReelsProps {
  title?: string;
  subtitle?: string;
  videos: VideoItem[];
}

function VideoCard({ video }: { video: VideoItem }) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  if (!video.videoUrl) return null;

  return (
    <div 
      className="relative w-[220px] sm:w-[260px] shrink-0 h-[380px] sm:h-[460px] rounded-2xl overflow-hidden snap-center group bg-neutral-100 shadow-sm border border-neutral-200"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {video.videoUrl.includes('instagram.com') ? (
        <iframe
          src={`${video.videoUrl.replace(/\/$/, '')}/embed`}
          className="w-full h-full border-none pointer-events-none"
          scrolling="no"
          allowTransparency={true}
          allow="encrypted-media"
        />
      ) : (
        <div className="relative w-full h-full cursor-pointer" onClick={toggleMute}>
          <video
            ref={videoRef}
            src={video.videoUrl}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
          />
          <button 
            onClick={toggleMute}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 p-3 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md transition-all shadow-sm"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      )}
      
      {/* Dark Gradient Overlay at bottom for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 pointer-events-none" />

      {/* Linked Product Card (Visible if product details exist) */}
      {video.linkedProductName && (
        <div className="absolute bottom-3 inset-x-3 z-30">
          <Link 
            href={video.linkedProductUrl || '#'}
            className="flex items-center gap-3 bg-white/95 backdrop-blur-md p-2 rounded-xl shadow-lg border border-black/5 hover:scale-[1.02] transition-transform cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            {video.linkedProductImage ? (
              <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={video.linkedProductImage} alt={video.linkedProductName} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0 border border-neutral-200">
                <ShoppingBag className="w-5 h-5 text-neutral-400" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h4 className="text-[10px] font-bold text-black truncate leading-tight mb-0.5">
                {video.linkedProductName}
              </h4>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black text-[#E41E31]">
                  ₹{video.linkedProductPrice?.toLocaleString('en-IN')}
                </span>
                <span className="text-[9px] font-semibold text-neutral-400 line-through">
                  ₹{(video.linkedProductPrice * 1.5).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function InstagramReels({ title = 'TRUSTED BY EXPERTS', subtitle = 'Quality • Ayurvedic • Products', videos = [] }: InstagramReelsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (!videos || videos.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden" id="instagram-reels">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            {subtitle && (
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-neutral-500 uppercase mb-2 block">
                {subtitle}
              </span>
            )}
            {title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black uppercase tracking-tight">
                {title}
              </h2>
            )}
          </div>
          
          {/* Navigation Arrows */}
          <div className="hidden md:flex items-center gap-2">
            <button 
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 hover:border-black transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-black" />
            </button>
            <button 
              onClick={scrollRight}
              className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 hover:border-black transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div 
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {videos.map((video, index) => (
            <VideoCard key={index} video={video} />
          ))}
        </div>
        
      </div>
    </section>
  );
}
