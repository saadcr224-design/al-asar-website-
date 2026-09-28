import React, { useState } from 'react';
import {
  Image as ImageIcon,
  X,
  Maximize2,
  Sparkles
} from 'lucide-react';
import { GalleryItem } from '../types';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'School', 'Classroom', 'Activities', 'Events', 'Sports'];

  const filteredItems = selectedCategory === 'All'
    ? gallery
    : gallery.filter(item => item.category === selectedCategory);

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 reveal-on-scroll">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Campus Moments</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
            School Photo Gallery
          </h2>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full mb-4" />
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
            Moments of learning, annual events, classroom participation, and activities at Al-Asar International Model School.
          </p>
        </div>

        {/* Category Filter Tabs - Pure Fluid Pills without Rectangle Boxes */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12 reveal-on-scroll">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`gordonstoun-pill px-5 py-2 text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer shadow-xs ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-[#D4AF37] shadow-md scale-105'
                  : 'bg-white/80 hover:bg-white text-slate-700 hover:text-slate-950'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image Grid - Gordonstoun Smooth Cards without Harsh Box Borders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setActiveLightboxItem(item)}
              className={`gordonstoun-card group relative rounded-3xl overflow-hidden bg-slate-900 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 reveal-on-scroll reveal-delay-${(idx % 3) * 100}`}
            >
              <div className="aspect-4/3 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={`${item.title} - Al-Asar International Model School, Lahor Swabi`}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Overlay - visible on hover with elegant gradient info */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 p-5 sm:p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37]">
                  {item.category}
                </span>
                <h4 className="font-bold text-base leading-snug text-white mt-0.5">
                  {item.title}
                </h4>
                {item.caption && (
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                    {item.caption}
                  </p>
                )}
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-200 font-semibold">
                  <Maximize2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Click to expand full photo</span>
                </div>
              </div>

              {/* Static Badge - Fluid Pill */}
              <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md text-[#D4AF37] px-3.5 py-1 rounded-full text-[11px] font-bold sm:block hidden shadow-sm">
                {item.category}
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">
            No gallery images found in this category.
          </div>
        )}

      </div>

      {/* Responsive Lightbox Modal */}
      {activeLightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setActiveLightboxItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col ring-1 ring-[#D4AF37]/40"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveLightboxItem(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 text-[#D4AF37] hover:text-white hover:bg-black/90 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Close image lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[68vh] sm:max-h-[75vh] overflow-hidden flex items-center justify-center bg-black">
              <img
                src={activeLightboxItem.imageUrl}
                alt={activeLightboxItem.title}
                className="max-h-[68vh] sm:max-h-[75vh] w-auto max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800 shrink-0">
              <div className="min-w-0">
                <span className="text-[11px] uppercase font-bold text-[#D4AF37]">
                  {activeLightboxItem.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white leading-tight truncate mt-0.5">
                  {activeLightboxItem.title}
                </h3>
                {activeLightboxItem.caption && (
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                    {activeLightboxItem.caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
