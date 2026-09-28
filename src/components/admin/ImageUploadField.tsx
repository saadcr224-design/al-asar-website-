import React, { useRef, useState } from 'react';
import {
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  X,
  Sparkles,
  Check,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { api } from '../../lib/api';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'banner';
  presets?: { label: string; url: string }[];
  idPrefix?: string;
}

const DEFAULT_PRESETS = [
  {
    label: 'Al-Asar Award Ceremony (Default Background)',
    url: '/assets/website-background.jpg'
  },
  {
    label: 'Primary Students Learning',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80'
  },
  {
    label: 'Modern Classroom',
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80'
  },
  {
    label: 'Early Childhood Learning',
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80'
  },
  {
    label: 'Art & Creative Session',
    url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1000&q=80'
  },
  {
    label: 'Sports & Play Activities',
    url: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1000&q=80'
  },
  {
    label: 'Dedicated Teacher Female',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Dedicated Teacher Male',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'School Books & Reading',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80'
  }
];

export const compressImageFile = (
  file: File,
  maxWidth = 1200,
  maxHeight = 900,
  quality = 0.82
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  helperText,
  aspectRatio = 'video',
  presets = DEFAULT_PRESETS,
  idPrefix = 'img-field'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    await processAndUploadFile(file);
  };

  const processAndUploadFile = async (file: File) => {
    try {
      setIsProcessing(true);
      const dataUrl = await compressImageFile(file);
      // Upload to server for permanent static file storage
      const uploaded = await api.uploadImage(dataUrl, file.name);
      if (uploaded && uploaded.url) {
        onChange(uploaded.url);
      } else {
        onChange(dataUrl);
      }
    } catch (err) {
      console.error('Failed to load image file:', err);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUrlInputChange = async (val: string) => {
    onChange(val);
    if (val.startsWith('data:image/')) {
      try {
        setIsProcessing(true);
        const uploaded = await api.uploadImage(val);
        if (uploaded && uploaded.url) {
          onChange(uploaded.url);
        }
      } catch (err) {
        console.warn('Failed to upload pasted base64:', err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        await processAndUploadFile(file);
      }
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'portrait':
        return 'aspect-3/4';
      case 'banner':
        return 'aspect-21/9';
      case 'video':
      default:
        return 'aspect-16/9';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="text-[11px] font-semibold text-[#003366] hover:text-[#002244] flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>{showPresets ? 'Hide Sample Images' : 'Choose Sample Image'}</span>
          </button>
        </div>
      </div>

      {helperText && (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      )}

      {/* Preset Pickers */}
      {showPresets && (
        <div className="bg-[#E6F0FF]/60 p-3 rounded-xl border border-[#C8DCF0] space-y-2 animate-in fade-in duration-150">
          <span className="text-[11px] font-bold text-[#002244] block">
            Click any high-resolution photo to apply instantly:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setShowPresets(false);
                }}
                className={`relative rounded-lg overflow-hidden border text-left group cursor-pointer transition-all ${
                  value === preset.url
                    ? 'border-[#003366] ring-2 ring-[#003366]'
                    : 'border-slate-200 hover:border-[#003366]/60'
                }`}
              >
                <div className="aspect-16/9 overflow-hidden bg-slate-100">
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
                <div className="p-1.5 bg-white text-[10px] font-semibold text-slate-700 truncate">
                  {preset.label}
                </div>
                {value === preset.url && (
                  <div className="absolute top-1 right-1 bg-[#003366] text-white p-0.5 rounded-full">
                    <Check className="w-3 h-3 text-[#D4AF37]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview & Upload Controls */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start bg-slate-50 p-3 rounded-xl border border-slate-200"
      >
        {/* Preview Frame */}
        <div className="sm:col-span-5 relative">
          <div
            className={`w-full ${getAspectClass()} rounded-lg overflow-hidden bg-slate-200 border-2 border-dashed border-slate-300 relative flex items-center justify-center`}
          >
            {value ? (
              <>
                <img
                  src={value}
                  alt={label}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors shadow-xs cursor-pointer"
                  title="Remove Picture"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center text-slate-400">
                <ImageIcon className="w-8 h-8 mb-1 text-slate-300" />
                <span className="text-[11px] font-medium">No Image Selected</span>
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white text-xs gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                <span>Processing & storing file...</span>
              </div>
            )}
          </div>
        </div>

        {/* Input Controls */}
        <div className="sm:col-span-7 space-y-2.5">
          {/* Action Tabs: Upload File vs Direct URL */}
          <div className="flex items-center gap-1.5 pb-1 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                mode === 'upload'
                  ? 'bg-[#003366] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Upload className="w-3 h-3 text-[#D4AF37]" />
              <span>Upload Photo</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                mode === 'url'
                  ? 'bg-[#003366] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LinkIcon className="w-3 h-3 text-[#D4AF37]" />
              <span>Image URL</span>
            </button>
          </div>

          {mode === 'upload' ? (
            <div className="space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id={`${idPrefix}-file-input`}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="w-full py-2.5 px-3 rounded-lg bg-white border-2 border-dashed border-[#003366]/40 hover:border-[#003366] text-[#003366] hover:bg-[#E6F0FF]/40 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <Upload className="w-4 h-4 text-[#D4AF37]" />
                <span>Click or Drag Photo to Upload</span>
              </button>
              <span className="text-[10px] text-slate-400 block">
                Supports JPG, PNG, WEBP, and GIF photos. Stored permanently on school server.
              </span>
            </div>
          ) : (
            <div className="space-y-1">
              <input
                type="url"
                value={value}
                onChange={(e) => handleUrlInputChange(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#003366]"
              />
              <span className="text-[10px] text-slate-400 block">
                Paste any valid image link from the web or image server.
              </span>
            </div>
          )}

          {value && (
            <div className="pt-1 flex items-center justify-between text-[11px]">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" />
                {value.startsWith('/uploads/') ? 'Stored permanently on server' : 'Image Loaded'}
              </span>
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-rose-600 hover:underline font-semibold cursor-pointer"
              >
                Clear Photo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
