import React from 'react';

interface AnimatedBackgroundProps {
  backgroundImageUrl?: string;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ backgroundImageUrl }) => {
  const bgImage = backgroundImageUrl || '/assets/website-background.jpg';

  // Bubbles array for animated rising light blue & gold shimmer particles
  const bubbles = [
    { left: '6%', delay: '0s', duration: '14s', size: 'w-14 h-14' },
    { left: '20%', delay: '2.5s', duration: '18s', size: 'w-20 h-20' },
    { left: '36%', delay: '1s', duration: '16s', size: 'w-10 h-10' },
    { left: '52%', delay: '4s', duration: '20s', size: 'w-24 h-24' },
    { left: '68%', delay: '1.8s', duration: '15s', size: 'w-12 h-12' },
    { left: '80%', delay: '3.2s', duration: '19s', size: 'w-16 h-16' },
    { left: '92%', delay: '0.5s', duration: '17s', size: 'w-10 h-10' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* 1. Full Authentic School Award & Leadership Background Photo */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="Al-Asar School Background"
          className="w-full h-full object-cover object-center transition-all duration-700 filter brightness-[0.98] contrast-105"
        />
      </div>

      {/* 2. Soft Elegant Translucent Tint Overlay (Maintains high photo visibility across all devices) */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100/60 via-white/50 to-sky-100/70 backdrop-blur-[1px]" />

      {/* 3. Subtle Ambient Light Blue & Gold Glow Orbs */}
      <div className="absolute -top-20 -left-20 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full bg-gradient-to-br from-sky-400/25 via-cyan-300/20 to-blue-500/15 blur-3xl animate-orb-1" />
      <div className="absolute top-1/3 -right-24 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] rounded-full bg-gradient-to-bl from-amber-300/20 via-sky-300/25 to-indigo-300/15 blur-3xl animate-orb-2" />
      <div className="absolute -bottom-20 right-1/10 w-[450px] sm:w-[620px] h-[450px] sm:h-[620px] rounded-full bg-gradient-to-t from-sky-400/25 via-cyan-300/20 to-blue-300/20 blur-3xl animate-orb-4" />

      {/* 4. Subtle Rising Light Blue Particles / Bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        {bubbles.map((b, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-gradient-to-t from-sky-300/30 to-white/50 backdrop-blur-xs border border-white/40 shadow-xs ${b.size}`}
            style={{
              left: b.left,
              bottom: '-80px',
              animation: `floatBubble ${b.duration} infinite ease-in-out`,
              animationDelay: b.delay,
            }}
          />
        ))}
      </div>

      {/* 5. Crisp Modern Dot Grid Matrix for Layered Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />

      {/* 6. Soft Ambient Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-sky-950/15" />
    </div>
  );
};

