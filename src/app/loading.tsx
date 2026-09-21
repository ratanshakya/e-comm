import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/20 z-[9999] backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        {/* Custom Premium Spinner */}
        <div className="relative w-16 h-16">
          {/* Outer Track */}
          <div className="absolute inset-0 border-[3px] border-neutral-100 rounded-full"></div>
          
          {/* Inner Spinning Ring */}
          <div className="absolute inset-0 border-[3px] border-[#E41E31] border-t-transparent border-l-transparent rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
          
          {/* Slower Reverse Ring */}
          <div className="absolute inset-1.5 border-[3px] border-black border-b-transparent border-r-transparent rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
          
          {/* Center Dot pulsing */}
          <div className="absolute inset-0 m-auto w-2 h-2 bg-[#E41E31] rounded-full animate-pulse"></div>
        </div>
        
        {/* Loading Text */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-xs font-black text-black uppercase tracking-[0.3em] animate-pulse">BroCART</p>
          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Please Wait...</p>
        </div>
      </div>
    </div>
  );
}
