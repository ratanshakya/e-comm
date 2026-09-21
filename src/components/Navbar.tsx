'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Heart, Search, User, Menu, X, Globe, ChevronDown, Check, Package, LogOut, Clock, Truck, CheckCircle2, LayoutDashboard, Settings, MapPin, ChevronRight, ImageIcon, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import DivineAudioPlayer from '@/components/DivineAudioPlayer';
import { SiteSettingsData } from '@/lib/settingsStore';

export default function Navbar({ onSearch }: { onSearch?: (q: string) => void }) {
  const { totalItems, setIsCartOpen, wishlist } = useCart();
  const { language, setLanguage, t, currentLanguageOption } = useLanguage();
  const { user, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close language dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [announcement, setAnnouncement] = useState('Radhe Radhe! ✨ Free Sacred Yamuna Braj Raj & Tulsi Prasad with all orders above ₹999');
  const [isAnnouncementActive, setIsAnnouncementActive] = useState(true);
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);

  // Fetch live site settings from admin configuration
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.data) {
            setSettings(data.data);
            if (data.data.announcementText !== undefined) setAnnouncement(data.data.announcementText);
            if (data.data.isAnnouncementActive !== undefined) setIsAnnouncementActive(data.data.isAnnouncementActive);
          }
        }
      } catch (err) {
        console.warn('Using default announcement:', err);
      }
    }
    loadSettings();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearch) onSearch(val);
  };

  return (
    <>
      {/* Dynamic Top Announcement Bar (Controllable via Admin Panel) */}
      {isAnnouncementActive && announcement && (
        <div className="w-full bg-black text-white text-[11px] sm:text-xs font-bold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2 border-b border-neutral-800">
          <span className="w-2 h-2 rounded-full bg-[#87D215] animate-pulse" />
          <span>{announcement}</span>
        </div>
      )}

      <header className="sticky top-0 z-50 w-full bg-white transition-all border-b border-black/[0.06] shadow-xs">
        {/* Main Header Bar */}
        <div className="w-full px-4 sm:px-8 lg:px-12 h-20 sm:h-[86px] flex items-center justify-between gap-4">
          
          {/* Left: Official BroCART Brand Logo */}
          <Link href="/" className="flex items-center group select-none shrink-0 py-1" aria-label="BroCART">
            <Image
              src={settings?.logoUrl || "/images/brocart_logo_cropped.png"}
              alt={settings?.storeName || "BroCART"}
              width={160}
              height={70}
              priority
              className="h-9 sm:h-11 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
            />
          </Link>

          {/* Center: Dynamic Nav Links from Admin */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-10 text-[13px] font-extrabold tracking-[0.14em] text-neutral-900 uppercase">
            {settings?.headerLinks?.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                className="hover:text-neutral-500 transition-colors py-1"
              >
                {link.label}
              </Link>
            )) || (
              <>
                <Link href="/" className="hover:text-neutral-500 transition-colors py-1">{t('nav.home')}</Link>
                <Link href="/about" className="hover:text-neutral-500 transition-colors py-1">{t('nav.about')}</Link>
                <Link href="/shop" className="hover:text-neutral-500 transition-colors py-1">{t('nav.shop')}</Link>
                <Link href="/contact" className="hover:text-neutral-500 transition-colors py-1">{t('nav.contact')}</Link>
              </>
            )}
          </nav>

          {/* Right: Language Selector + Icons (Search, Account, Wishlist, Cart) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            
            {/* Language Selector Dropdown (Right side of header) */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold transition-all border border-neutral-200 cursor-pointer shadow-xs active:scale-95"
                aria-label="Change Language"
                title={t('nav.selectLanguage')}
              >
                <Globe className="w-3.5 h-3.5 text-black" />
                <span className="hidden sm:inline">{currentLanguageOption.flag}</span>
                <span className="text-xs font-black">{currentLanguageOption.nativeLabel}</span>
                <ChevronDown className={`w-3 h-3 text-neutral-600 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-neutral-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 mb-1">
                    {t('nav.selectLanguage')}
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left font-bold transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-100 text-black font-extrabold'
                            : 'text-neutral-700 hover:bg-neutral-50 hover:text-black'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="text-base">{lang.flag}</span>
                          <span>
                            <span className="block">{lang.nativeLabel}</span>
                            <span className="block text-[10px] font-normal text-neutral-400">{lang.label}</span>
                          </span>
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 font-bold" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-1 text-black hover:opacity-70 transition-opacity cursor-pointer"
              aria-label="Search"
              title={t('nav.search')}
            >
              <Search className="w-5 h-5 sm:w-[22px] sm:h-[22px] stroke-[1.8]" />
            </button>

            {/* Account / User Icon with Hover Dropdown */}
            <div className="relative group">
              <button
                onClick={() => !user ? setLoginModalOpen(true) : (window.location.href = '/account')}
                className="p-1 text-black hover:opacity-70 transition-opacity cursor-pointer flex items-center"
                aria-label="User Account"
                title={t('nav.account')}
              >
                <User className="w-5 h-5 sm:w-[22px] sm:h-[22px] stroke-[1.8]" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 w-60">
                <div className="bg-white border border-neutral-200 shadow-2xl rounded-sm p-4 animate-in slide-in-from-top-2">
                  <div className="border-b border-neutral-100 pb-3 mb-3">
                    <p className="text-[13px] text-neutral-500 mb-2 font-medium uppercase tracking-widest">
                      {user ? `Welcome, ${user.firstName || 'Devotee'}` : 'Welcome'}
                    </p>
                    {!user && (
                      <div className="flex gap-2">
                        <button onClick={() => setLoginModalOpen(true)} className="flex-1 bg-black text-white text-[13px] py-1.5 font-bold hover:bg-neutral-800 transition-colors cursor-pointer">LOGIN</button>
                        <button onClick={() => setLoginModalOpen(true)} className="flex-1 bg-neutral-100 text-black text-[13px] py-1.5 font-bold hover:bg-neutral-200 transition-colors cursor-pointer">REGISTER</button>
                      </div>
                    )}
                  </div>
                  {user && (
                    <nav className="flex flex-col space-y-1">
                      <Link href="/account" className="text-[14px] text-neutral-700 hover:text-black hover:bg-neutral-50 px-3 py-2 rounded-sm transition-colors cursor-pointer">
                        My Account
                      </Link>
                      <Link href="/account" className="text-[14px] text-neutral-700 hover:text-black hover:bg-neutral-50 px-3 py-2 rounded-sm transition-colors cursor-pointer">
                        Orders
                      </Link>
                      <Link href="/account" className="text-[14px] text-neutral-700 hover:text-black hover:bg-neutral-50 px-3 py-2 rounded-sm transition-colors cursor-pointer">
                        Profile Settings
                      </Link>
                      <button onClick={() => setShowLogoutModal(true)} className="text-left text-[14px] text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-sm transition-colors cursor-pointer mt-2 border-t border-neutral-100 flex items-center gap-2">
                        <LogOut className="w-3.5 h-3.5" />
                        Log out
                      </button>
                    </nav>
                  )}
                </div>
              </div>
            </div>

            {/* Wishlist Heart Icon with Bright Neon Yellow Count Pill */}
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-1 text-black hover:opacity-70 transition-opacity cursor-pointer"
                aria-label="Wishlist"
                title={t('nav.wishlist')}
              >
                <Heart className="w-5 h-5 sm:w-[22px] sm:h-[22px] stroke-[1.8]" />
              </button>
              <span className="absolute -top-1 -right-2 min-w-[17px] h-[17px] px-0.5 rounded-full bg-[#87D215] text-black text-[10px] font-black flex items-center justify-center leading-none select-none shadow-xs pointer-events-none">
                {wishlist.length}
              </span>
            </div>

            {/* Shopping Bag Icon with BroCART Lime Green Count Pill */}
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-1 text-black hover:opacity-70 transition-opacity cursor-pointer"
                aria-label="Shopping Cart"
                title={t('nav.cart')}
              >
                <ShoppingBag className="w-5 h-5 sm:w-[22px] sm:h-[22px] stroke-[1.8]" />
              </button>
              <span className="absolute -top-1 -right-2 min-w-[17px] h-[17px] px-0.5 rounded-full bg-[#87D215] text-black text-[10px] font-black flex items-center justify-center leading-none select-none shadow-xs pointer-events-none">
                {totalItems}
              </span>
            </div>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 md:hidden text-black hover:opacity-70 cursor-pointer"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Drawer */}
        {isSearchOpen && (
          <div className="border-t border-neutral-200 bg-neutral-50 px-6 sm:px-12 py-4 transition-all animate-in fade-in slide-in-from-top-2">
            <div className="max-w-3xl mx-auto relative flex items-center">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={t('nav.searchPlaceholder')}
                className="w-full pl-11 pr-11 py-3 rounded-full bg-white border border-neutral-300 text-sm text-black placeholder-neutral-400 focus:border-black outline-none shadow-xs"
              />
              <Search className="w-5 h-5 text-neutral-400 absolute left-4" />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                  if (onSearch) onSearch('');
                }}
                className="absolute right-4 text-neutral-400 hover:text-black p-1"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-w-3xl mx-auto mt-2.5 flex items-center gap-2 text-xs text-neutral-500 overflow-x-auto py-1">
              <span className="font-semibold text-neutral-700">{t('nav.popular')}</span>
              {['Royal Zardozi Poshak', '24K Mukut', 'Peacock Bansuri', 'Carved Singhasan'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchQuery(tag);
                    if (onSearch) onSearch(tag);
                  }}
                  className="px-2.5 py-1 rounded-full bg-white border border-neutral-200 hover:border-black text-neutral-800 transition-colors shrink-0"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white px-6 py-6 space-y-4 text-sm font-extrabold uppercase tracking-wider">
            {/* Mobile Language Switcher Row */}
            <div className="pb-3 border-b border-neutral-100">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">
                {t('nav.selectLanguage')}
              </span>
              <div className="grid grid-cols-3 gap-2">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      language === lang.code
                        ? 'bg-[#87D215] text-black font-extrabold shadow-xs border border-[#79BE10]'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.nativeLabel}</span>
                  </button>
                ))}
              </div>
            </div>

            {settings?.headerLinks?.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 hover:text-neutral-500 border-b border-neutral-100"
              >
                {link.label}
              </Link>
            )) || (
              <>
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-neutral-500 border-b border-neutral-100"
                >
                  {t('nav.home')}
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-neutral-500 border-b border-neutral-100"
                >
                  {t('nav.about')}
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-neutral-500 border-b border-neutral-100"
                >
                  {t('nav.shop')}
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-neutral-500 border-b border-neutral-100"
                >
                  {t('nav.contact')}
                </Link>
              </>
            )}
            <div className="pt-2">
              <DivineAudioPlayer />
            </div>
          </div>
        )}
      </header>

      {/* Crocohill-style Login Popup */}
      {loginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} />}

      {/* ── Logout Confirm Modal ── */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4"
            style={{ animation: 'logoutModalUp 0.25s cubic-bezier(.22,.68,0,1.2)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-2 pb-2">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-1">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-base font-black text-black">Logout?</h3>
              <p className="text-sm text-neutral-500 text-center leading-snug">
                Are you sure you want to log out of your account?
              </p>
            </div>
            <button
              onClick={async () => { await logout(); setShowLogoutModal(false); }}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              Yes, Logout
            </button>
            <button
              onClick={() => setShowLogoutModal(false)}
              className="w-full py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-black font-bold text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Minimalist Auth Modal
function LoginModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      if (res.ok) {
        onClose();
        window.location.href = '/account';
      } else {
        const data = await res.json();
        alert(data.error || 'Authentication failed');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white max-w-[500px] w-full rounded shadow-xl relative animate-in fade-in zoom-in-95 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <h2 className="text-2xl font-sans font-normal text-black capitalize">
            {mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Reset Password'}
          </h2>
          <button onClick={onClose} className="p-1 text-neutral-600 hover:text-black transition-colors cursor-pointer">
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First name *"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-sm text-[15px] text-black placeholder-neutral-500 focus:outline-none focus:border-black"
                />
                <input
                  type="text"
                  placeholder="Last name *"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-sm text-[15px] text-black placeholder-neutral-500 focus:outline-none focus:border-black"
                />
              </div>
            )}

            <div>
              <input
                type="email"
                placeholder="Email address *"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-sm text-[15px] text-black placeholder-neutral-500 focus:outline-none focus:border-black"
              />
            </div>

            {mode !== 'forgot_password' && (
              <div className="relative">
                <input
                  type="password"
                  placeholder="Password *"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-sm text-[15px] text-black placeholder-neutral-500 focus:outline-none focus:border-black"
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                </button>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[15px] gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded-sm border-neutral-300 text-black focus:ring-black cursor-pointer" />
                  <span className="text-neutral-600">Remember me</span>
                </label>
                <button type="button" onClick={() => setMode('forgot_password')} className="text-black hover:text-neutral-600 underline underline-offset-2 decoration-1 transition-colors text-left sm:text-right">Lost your password?</button>
              </div>
            )}

            {mode === 'register' && (
              <p className="text-xs text-neutral-500 pt-1 leading-relaxed">
                Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our privacy policy.
              </p>
            )}

            {mode === 'forgot_password' && (
              <p className="text-[15px] text-neutral-600 pt-1 leading-relaxed">
                Lost your password? Please enter your username or email address. You will receive a link to create a new password via email.
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3">
              <button
                type="submit"
                className="bg-black text-white px-8 py-3 rounded-sm text-[15px] font-bold hover:bg-neutral-800 transition-colors w-full sm:w-auto cursor-pointer"
              >
                {mode === 'login' ? 'Log in' : mode === 'register' ? 'Register' : 'Reset password'}
              </button>
              
              {mode === 'login' && (
                <button type="button" onClick={() => setMode('register')} className="text-[15px] font-medium text-black flex items-center gap-1 hover:text-neutral-600 transition-colors">
                  New customer? Create your account <ChevronRight className="w-4 h-4" />
                </button>
              )}
              {mode === 'register' && (
                <button type="button" onClick={() => setMode('login')} className="text-[15px] font-medium text-black flex items-center gap-1 hover:text-neutral-600 transition-colors">
                  Already have an account? Log in <ChevronRight className="w-4 h-4" />
                </button>
              )}
              {mode === 'forgot_password' && (
                <button type="button" onClick={() => setMode('login')} className="text-[15px] font-medium text-black hover:text-neutral-600 transition-colors underline underline-offset-2 decoration-1">
                  Back to login
                </button>
              )}
            </div>
          </form>

          {/* Google Sign In */}
          {mode !== 'forgot_password' && (
            <div className="mt-8 text-center border-t border-neutral-100 pt-6">
              <span className="text-[13px] text-neutral-500 bg-white px-3 relative -top-9">
                {mode === 'login' ? 'Or Login Using' : 'Or Register Using'}
              </span>
              <button type="button" className="mx-auto flex items-center gap-2 px-6 py-2.5 border border-[#4285F4] rounded-full text-[#4285F4] hover:bg-[#4285F4]/5 transition-colors cursor-pointer text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18px" height="18px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
                Sign in with Google
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
