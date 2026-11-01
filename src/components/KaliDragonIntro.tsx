import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, FastForward, Sparkles, Terminal, Shield } from 'lucide-react';
import { dragonAudio } from '../utils/audio';

interface KaliDragonIntroProps {
  onComplete: () => void;
  isReplay?: boolean;
}

export const KaliDragonIntro: React.FC<KaliDragonIntroProps> = ({ onComplete }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [flashOpacity, setFlashOpacity] = useState(0);
  const [shockwaveScale, setShockwaveScale] = useState(0);
  const [shockwaveOpacity, setShockwaveOpacity] = useState(0);
  const [typedTitle, setTypedTitle] = useState('');
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [dragonPulse, setDragonPulse] = useState(false);
  const [is3DTilting, setIs3DTilting] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Toggle Mute
  const handleToggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    dragonAudio.setMuted(nextMuted);
  }, [isMuted]);

  // Skip Intro
  const handleSkip = useCallback(() => {
    try {
      sessionStorage.setItem('kali_intro_played', 'true');
    } catch {
      // ignore
    }
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  }, [onComplete]);

  // Main Cinematic Intro Director Timeline
  useEffect(() => {
    let hasRoared = false;

    // 1. Slow Zoom-In begins immediately on mount (handled via CSS transition)
    // 2. At 1.2s: Dragon pulses, lights up intensely, and performs 3D tilt/rotate with ROAR!
    const roarTimer = setTimeout(() => {
      if (!hasRoared) {
        hasRoared = true;
        setDragonPulse(true);
        setIs3DTilting(true);
        dragonAudio.playRoar();
        setIsShaking(true);
        setFlashOpacity(0.85);
        setShockwaveScale(0.1);
        setShockwaveOpacity(1.0);
      }
    }, 1200);

    // Decay shake after 1.4s of roaring
    const shakeTimer = setTimeout(() => {
      setIsShaking(false);
      setIs3DTilting(false);
    }, 2600);

    // Glitch Typing title starts at 2.4s
    const fullTitle = 'DracoSec: Kali Linux Command Codex';
    let currentIndex = 0;
    let typingTimer: NodeJS.Timeout;

    const startTypingTimer = setTimeout(() => {
      typingTimer = setInterval(() => {
        if (currentIndex <= fullTitle.length) {
          setTypedTitle(fullTitle.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingTimer);
          setShowSubtitle(true);
        }
      }, 55);
    }, 2300);

    // Fade out and transition to main app at 4.8s
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 4700);

    const finishTimer = setTimeout(() => {
      try {
        sessionStorage.setItem('kali_intro_played', 'true');
      } catch {
        // ignore
      }
      onComplete();
    }, 5200);

    return () => {
      clearTimeout(roarTimer);
      clearTimeout(shakeTimer);
      clearTimeout(startTypingTimer);
      clearInterval(typingTimer);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  // Shockwave expansion animation tick
  useEffect(() => {
    let animId: number;
    const animateShockwave = () => {
      setShockwaveScale((prev) => (prev > 0 ? prev + 0.08 : 0));
      setShockwaveOpacity((prev) => Math.max(0, prev - 0.025));
      setFlashOpacity((prev) => Math.max(0, prev - 0.04));
      animId = requestAnimationFrame(animateShockwave);
    };
    animId = requestAnimationFrame(animateShockwave);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-black select-none transition-opacity duration-700 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } ${isShaking ? 'animate-[shake_0.15s_infinite]' : ''}`}
    >
      {/* 1. KALI DRAGON WALLPAPER BACKGROUND WITH SLOW CINEMATIC ZOOM */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[5000ms] ease-out"
        style={{
          backgroundImage: "url('/assets/aistudio/0dc847b7195625d2c6dbb3e0cec2351e_1e04ac6e.jpg')",
          transform: is3DTilting
            ? 'scale(1.22) perspective(1000px) rotateX(7deg) rotateY(-8deg) rotateZ(1.2deg)'
            : 'scale(1.08)',
          filter: dragonPulse
            ? 'brightness(1.5) contrast(1.15) drop-shadow(0 0 45px rgba(0,240,255,0.9))'
            : 'brightness(1.0)',
          transitionProperty: 'transform, filter',
        }}
      />

      {/* 2. Center Dragon Radiant Aura on Roar */}
      {dragonPulse && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none mix-blend-screen animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(0,240,255,0.7) 0%, rgba(59,130,246,0.4) 40%, transparent 70%)',
            boxShadow: '0 0 100px rgba(0,240,255,0.8)',
          }}
        />
      )}

      {/* 3. Animated Thin Vertical Light Lines & Traveling Particle Dots Aligning with Wallpaper Center Axis */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-85">
        {/* Center vertical glowing energy axis matching wallpaper line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-90 shadow-[0_0_15px_#00f0ff]" />
        
        {/* Traveling diamond pulse along the center axis */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-cyan-200 border border-white shadow-[0_0_20px_#00f0ff] animate-[ping_2s_infinite]"
          style={{ top: '32%' }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-cyan-300 border border-white shadow-[0_0_15px_#00f0ff] animate-[ping_2.4s_infinite]"
          style={{ top: '68%' }}
        />

        {/* Side ambient cyber light guides */}
        <div className="absolute left-[15%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
        <div className="absolute left-[30%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute left-[70%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute left-[85%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />

        {/* Traveling glowing particle nodes */}
        <div className="absolute left-[30%] w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#00f0ff] animate-[bounce_3s_infinite]" style={{ top: '40%' }} />
        <div className="absolute left-[70%] w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#00f0ff] animate-[bounce_3.5s_infinite]" style={{ top: '55%' }} />
      </div>

      {/* 4. Dark Gradient Atmospheric Vignette (55-65% Black Overlay) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-[#010410]/50 to-black/65 pointer-events-none" />

      {/* 4. Flashing Strobe Light Effect on Roar */}
      <div
        className="absolute inset-0 bg-cyan-200 pointer-events-none transition-opacity duration-75 mix-blend-overlay z-10"
        style={{ opacity: flashOpacity }}
      />

      {/* 5. Glowing Blue Shockwave Ring Spreading Outward from Dragon Center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-400 pointer-events-none z-10 shadow-[0_0_100px_#00f0ff]"
        style={{
          width: '500px',
          height: '500px',
          transform: `translate(-50%, -50%) scale(${shockwaveScale})`,
          opacity: shockwaveOpacity,
        }}
      />

      {/* 6. Top Controls: Mute Toggle & Skip Intro Button */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-3">
        <button
          onClick={handleToggleMute}
          className="px-3.5 py-2 bg-slate-950/80 hover:bg-slate-900 text-cyan-400 hover:text-white rounded-xl border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)] text-xs flex items-center gap-2 backdrop-blur-md transition-all font-mono"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Sound ON'}</span>
        </button>

        <button
          onClick={handleSkip}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] text-xs flex items-center gap-2 transition-all hover:scale-105 font-mono"
        >
          <span>Skip Intro</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 7. Centered App Title & "Delivered by Manjunath KH" with Glitch/Typing Effect */}
      <div className="absolute bottom-12 sm:bottom-16 inset-x-0 z-30 flex flex-col items-center text-center px-4 max-w-2xl mx-auto space-y-3 pointer-events-none">
        {/* Title Typing with Glitch Cursor */}
        <div className="min-h-[50px] flex items-center justify-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_0_30px_rgba(0,240,255,0.8)] font-sans">
            <span className="text-white">
              {typedTitle}
            </span>
            <span className="inline-block w-3 h-8 sm:h-10 bg-cyan-400 animate-pulse ml-1 align-middle" />
          </h1>
        </div>

        {/* Subtitle Badge: "Delivered by Manjunath KH" */}
        <div
          className={`transition-all duration-700 transform ${
            showSubtitle ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#020719]/90 border border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.35)] backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-300 font-mono">
              Delivered by <span className="text-cyan-300 font-bold drop-shadow-[0_0_8px_rgba(6,182,212,0.7)]">Manjunath KH</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">· Cyber Defense Arsenal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
