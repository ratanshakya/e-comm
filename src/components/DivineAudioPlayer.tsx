'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

export default function DivineAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startDivineMelody = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const notes = [440, 495, 556.88, 660, 742.5, 880, 990, 1113.75];
      let noteIndex = 0;

      const playFluteTone = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        const freq = notes[noteIndex % notes.length];
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.2);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 2.3);

        const step = [1, 2, -1, 3, -2, 1][Math.floor(Math.random() * 6)];
        noteIndex = Math.abs(noteIndex + step) % notes.length;

        timerRef.current = setTimeout(playFluteTone, 1800);
      };

      playFluteTone();
      setIsPlaying(true);
    } catch (err) {
      console.warn('Audio context initialization error:', err);
    }
  };

  const stopDivineMelody = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopDivineMelody();
    } else {
      startDivineMelody();
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
    };
  }, []);

  return (
    <button
      onClick={toggleSound}
      title={isPlaying ? 'Pause Vrindavan Flute Ambiance' : 'Play Devotional Bamboo Flute'}
      className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-black transition-all duration-200 text-neutral-800"
    >
      {isPlaying ? (
        <>
          <div className="flex items-end gap-0.5 h-3 px-0.5">
            <span className="w-0.5 bg-[#87D215] animate-wave-1 rounded-full"></span>
            <span className="w-0.5 bg-[#87D215] animate-wave-2 rounded-full"></span>
            <span className="w-0.5 bg-[#87D215] animate-wave-3 rounded-full"></span>
            <span className="w-0.5 bg-[#87D215] animate-wave-4 rounded-full"></span>
          </div>
          <Volume2 className="w-3.5 h-3.5 text-black" />
          <span className="hidden sm:inline font-bold text-black">Flute: Playing</span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
          <Sparkles className="w-3 h-3 text-neutral-400" />
          <span className="hidden sm:inline font-medium">Play Flute</span>
        </>
      )}
    </button>
  );
}
