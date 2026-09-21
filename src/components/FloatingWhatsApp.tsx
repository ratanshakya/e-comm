'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Sparkles, Send, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FloatingWhatsApp() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-show a gentle tooltip on initial visit
  const [showTooltip, setShowTooltip] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        setShowTooltip(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [hasInteracted]);

  const quickPrompts = [
    t('whatsapp.prompt1'),
    t('whatsapp.prompt2'),
    t('whatsapp.prompt3'),
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || message || (language === 'hi'
      ? 'राधे राधे! मुझे ठाकुर जी की पोशाक और सेवा के बारे में पूछना है।'
      : 'Radhe Radhe! I would like to inquire about Thakur Ji poshak and seva.');
    const encoded = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/919876543210?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Gentle Greeting Tooltip when closed */}
      {!isOpen && showTooltip && (
        <div className="absolute bottom-16 right-0 mb-2 w-64 p-3 bg-white text-black rounded-2xl border border-neutral-200 shadow-xl animate-in fade-in slide-in-from-bottom-2 text-xs">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 font-bold text-black">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('whatsapp.tooltipTitle')}</span>
            </div>
            <button
              onClick={() => {
                setShowTooltip(false);
                setHasInteracted(true);
              }}
              className="text-neutral-400 hover:text-black p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-neutral-600 mt-1">
            {t('whatsapp.tooltipDesc')}
          </p>
          <button
            onClick={() => {
              setShowTooltip(false);
              setIsOpen(true);
              setHasInteracted(true);
            }}
            className="mt-2 w-full py-1.5 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span>{t('whatsapp.chatBtn')}</span>
          </button>
        </div>
      )}

      {/* Expanded WhatsApp Chat Widget */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold border border-white/30">
                  <MessageCircle className="w-5 h-5 fill-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25D366] border border-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">BroCART Seva Center</h4>
                <p className="text-[10px] text-emerald-100 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  {language === 'hi' ? 'ऑनलाइन • 9 AM - 9 PM IST' : 'Online • 9 AM - 9 PM IST'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-[#ECE5DD] bg-opacity-40 min-h-[190px] max-h-[260px] overflow-y-auto space-y-3">
            {/* System incoming bubble */}
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-xs border border-neutral-200/60 max-w-[85%] text-xs space-y-1">
              <div className="font-bold text-black flex items-center gap-1">
                <span>{t('whatsapp.welcomeTitle')}</span>
              </div>
              <p className="text-neutral-700 text-[11px] leading-relaxed">
                {t('whatsapp.welcomeDesc')}
              </p>
              <span className="text-[9px] text-neutral-400 block text-right">
                {language === 'hi' ? 'अभी' : 'Just now'}
              </span>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                {t('whatsapp.quickTitle')}
              </span>
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left p-2 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200/80 text-[11px] text-neutral-800 font-medium transition-colors shadow-2xs hover:border-[#25D366] flex items-center justify-between"
                >
                  <span className="truncate pr-1">{prompt}</span>
                  <Send className="w-3 h-3 text-[#25D366] shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('whatsapp.placeholder')}
              className="flex-1 px-3.5 py-2 text-xs rounded-full border border-neutral-300 focus:border-[#25D366] outline-none text-black placeholder-neutral-400"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center shrink-0 transition-colors shadow-sm"
              aria-label="Send WhatsApp"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
          setHasInteracted(true);
        }}
        className="group relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Open WhatsApp Chat"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />
        
        {isOpen ? (
          <X className="w-6 h-6 text-white transition-transform group-hover:rotate-90" />
        ) : (
          <MessageCircle className="w-7 h-7 fill-white text-white" />
        )}

        {/* Online Indicator Dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-300 border-2 border-white" />
      </button>
    </div>
  );
}
