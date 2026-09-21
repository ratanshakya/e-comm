'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, Link, X, ImageIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  /** Current image URL */
  value: string;
  /** Called when image URL changes (either uploaded or typed) */
  onChange: (url: string) => void;
  /** Label shown above the uploader */
  label?: string;
  /** Placeholder for URL input */
  placeholder?: string;
  /** Extra CSS class on the wrapper */
  className?: string;
  /** Preview size: 'sm' | 'md' | 'lg' */
  previewSize?: 'sm' | 'md' | 'lg';
}

type Tab = 'upload' | 'url';

export default function ImageUploader({
  value,
  onChange,
  label,
  placeholder = '/images/example.jpg  ya  https://...',
  className = '',
  previewSize = 'md',
}: ImageUploaderProps) {
  const [tab, setTab] = useState<Tab>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const [urlInput, setUrlInput] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewSizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    setUploadStatus('idle');

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();

      if (res.ok && data.url) {
        onChange(data.url);
        setUrlInput(data.url);
        setUploadStatus('success');
        setStatusMsg(`✓ Uploaded: ${file.name}`);
      } else {
        setUploadStatus('error');
        setStatusMsg(data.message || 'Upload failed');
      }
    } catch {
      setUploadStatus('error');
      setStatusMsg('Network error. Try again.');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadStatus('idle'), 4000);
    }
  }, [onChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    // Reset so same file can be re-selected
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleUrlApply = () => {
    onChange(urlInput.trim());
  };

  const handleClear = () => {
    onChange('');
    setUrlInput('');
    setUploadStatus('idle');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-neutral-700">{label}</label>
      )}

      <div className="flex rounded-xl overflow-hidden border border-neutral-300 bg-neutral-50">
        {/* Tab: Upload */}
        <button
          type="button"
          onClick={() => setTab('upload')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold transition-all cursor-pointer ${
            tab === 'upload'
              ? 'bg-black text-white'
              : 'text-neutral-500 hover:bg-neutral-100'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Local Upload
        </button>
        {/* Tab: URL */}
        <button
          type="button"
          onClick={() => setTab('url')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold transition-all cursor-pointer ${
            tab === 'url'
              ? 'bg-black text-white'
              : 'text-neutral-500 hover:bg-neutral-100'
          }`}
        >
          <Link className="w-3.5 h-3.5" />
          URL / Link
        </button>
      </div>

      {/* Upload Tab */}
      {tab === 'upload' && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-5 cursor-pointer transition-all ${
            isDragging
              ? 'border-[#87D215] bg-[#87D215]/5 scale-[1.01]'
              : uploading
              ? 'border-neutral-300 bg-neutral-50 cursor-wait'
              : 'border-neutral-300 bg-neutral-50 hover:border-black hover:bg-neutral-100'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/webm,video/quicktime"
            onChange={handleFileChange}
            className="hidden"
          />

          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
              <p className="text-xs font-bold text-neutral-500">Uploading...</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-neutral-200 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-neutral-500" />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-black">
                  Click karo ya drag-drop karo
                </p>
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  JPG, PNG, WEBP, MP4, MOV • Max 30MB
                </p>
              </div>
            </>
          )}

          {/* Status message */}
          {uploadStatus !== 'idle' && (
            <div
              className={`flex items-center gap-1.5 text-[11px] font-bold mt-1 ${
                uploadStatus === 'success' ? 'text-emerald-600' : 'text-red-500'
              }`}
            >
              {uploadStatus === 'success' ? (
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              )}
              <span className="truncate max-w-[200px]">{statusMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* URL Tab */}
      {tab === 'url' && (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUrlApply()}
            placeholder={placeholder}
            className="flex-1 bg-white border border-neutral-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-black outline-none focus:border-black"
          />
          <button
            type="button"
            onClick={handleUrlApply}
            className="bg-black hover:bg-neutral-800 text-white font-bold text-xs px-4 rounded-xl transition-all cursor-pointer shrink-0"
          >
            Apply
          </button>
        </div>
      )}

      {/* Preview + Remove */}
      {value && (
        <div className="flex items-center gap-3 mt-1 p-2 bg-neutral-100 rounded-xl border border-neutral-200">
          <div
            className={`${previewSizes[previewSize]} rounded-lg border border-neutral-300 bg-white overflow-hidden flex items-center justify-center shrink-0`}
          >
            {value?.includes('instagram.com') ? (
              <iframe
                src={`${value.replace(/\/$/, '')}/embed`}
                className="w-full h-full border-none pointer-events-none"
                scrolling="no"
                title="Instagram Preview"
              />
            ) : value?.match(/\.(mp4|webm|mov)$/i) ? (
              <video
                src={value}
                className="w-full h-full object-cover"
                muted
                autoPlay
                loop
                playsInline
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='m21 15-5-5L5 21'/%3E%3C/svg%3E";
                }}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-neutral-500 font-semibold truncate">{value}</p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            title="Remove image"
            className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center shrink-0 transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
