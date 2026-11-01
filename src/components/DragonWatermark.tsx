import React from 'react';

/**
 * Faint Kali Cyber-Dragon Watermark
 * Renders an original, intricate cyber-dragon silhouette and circuitry
 * in the background with subtle glowing cyan & electric blue gradients.
 */
export const DragonWatermark: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden flex items-center justify-center opacity-[0.045] mix-blend-screen select-none transition-opacity duration-1000"
    >
      <svg
        viewBox="0 0 1000 1000"
        className="w-[120vw] max-w-[1400px] h-auto text-cyan-400 fill-current filter drop-shadow-[0_0_80px_rgba(6,182,212,0.4)]"
      >
        <defs>
          <linearGradient id="dragonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <radialGradient id="dragonEyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Outer Circular Cyber Runes & Circuit Rings */}
        <circle cx="500" cy="500" r="460" fill="none" stroke="url(#dragonGrad)" strokeWidth="3" strokeDasharray="12 18 4 18" />
        <circle cx="500" cy="500" r="440" fill="none" stroke="#00f0ff" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="40 10 20 10" />
        <circle cx="500" cy="500" r="390" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.4" />

        {/* Original Articulated Cyber-Dragon Crest */}
        <g id="dragon-body" fill="url(#dragonGrad)">
          {/* Main Skull / Head */}
          <path d="M 500 180 L 530 220 L 580 230 L 610 210 L 575 255 L 630 280 L 560 300 L 535 285 L 510 320 L 490 320 L 465 285 L 440 300 L 370 280 L 425 255 L 390 210 L 420 230 L 470 220 Z" />

          {/* Glowing Eyes */}
          <circle cx="475" cy="245" r="7" fill="url(#dragonEyeGlow)" />
          <circle cx="525" cy="245" r="7" fill="url(#dragonEyeGlow)" />

          {/* Swept Horns */}
          <path d="M 430 225 Q 350 140 280 130 Q 340 180 410 240 Z" />
          <path d="M 570 225 Q 650 140 720 130 Q 660 180 590 240 Z" />
          <path d="M 450 200 Q 400 110 350 90 Q 400 150 440 210 Z" />
          <path d="M 550 200 Q 600 110 650 90 Q 600 150 560 210 Z" />

          {/* Serrated Spine & Ribs */}
          <path d="M 485 320 L 515 320 L 530 380 L 560 395 L 525 430 L 545 470 L 520 500 L 535 550 L 515 590 L 525 640 L 510 690 L 500 750 L 490 690 L 475 640 L 485 590 L 465 550 L 480 500 L 455 470 L 475 430 L 440 395 L 470 380 Z" />

          {/* Left Wing (Massive Cyber Blade Struts) */}
          <path d="M 460 350 Q 250 240 120 180 Q 160 280 240 360 Q 160 340 90 320 Q 140 410 260 480 Q 180 470 120 480 Q 210 570 360 600 Q 300 620 230 650 Q 360 680 460 620 Z" />
          {/* Right Wing */}
          <path d="M 540 350 Q 750 240 880 180 Q 840 280 760 360 Q 840 340 910 320 Q 860 410 740 480 Q 820 470 880 480 Q 790 570 640 600 Q 700 620 770 650 Q 640 680 540 620 Z" />

          {/* Serpentine Tail with Chevron Spikes */}
          <path d="M 495 740 Q 520 820 480 880 Q 430 930 370 910 Q 320 890 350 830 Q 380 780 440 790 Q 420 840 400 850 Q 440 860 470 820 Q 480 780 485 740 Z" />
          <path d="M 330 840 L 290 830 L 320 870 Z" />
          <path d="M 355 895 L 325 930 L 375 920 Z" />
        </g>

        {/* Cyber Grid Crosshairs */}
        <line x1="500" y1="40" x2="500" y2="120" stroke="#00f0ff" strokeWidth="2" strokeOpacity="0.5" />
        <line x1="500" y1="880" x2="500" y2="960" stroke="#00f0ff" strokeWidth="2" strokeOpacity="0.5" />
        <line x1="40" y1="500" x2="120" y2="500" stroke="#00f0ff" strokeWidth="2" strokeOpacity="0.5" />
        <line x1="880" y1="500" x2="960" y2="500" stroke="#00f0ff" strokeWidth="2" strokeOpacity="0.5" />
      </svg>
    </div>
  );
};
