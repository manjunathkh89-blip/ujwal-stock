import React, { useState } from 'react';
import { ShieldAlert, Sparkles, RotateCcw, Search, Bookmark, Menu, X, Terminal, Target } from 'lucide-react';

export type ActiveTab = 'commands' | 'practice' | 'ai-advisor' | 'learning-path' | 'quiz' | 'glossary' | 'lab-setup';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenEthicalModal: () => void;
  favoritesCount: number;
  onShowFavorites: () => void;
  showBookmarksOnly?: boolean;
  onOpenCommandPalette: () => void;
  onReplayIntro?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenEthicalModal,
  favoritesCount,
  onShowFavorites,
  showBookmarksOnly = false,
  onOpenCommandPalette,
  onReplayIntro,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#05080F]/90 backdrop-blur-md border-b border-[#00C8FF]/15">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Logo & Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              onSelectTab('commands');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            {/* Minimalist Cyber Dragon Mark */}
            <div className="w-8 h-8 rounded-lg bg-[#0B1220] border border-[#00C8FF]/30 text-[#00C8FF] flex items-center justify-center font-mono group-hover:border-[#00C8FF] group-hover:shadow-[0_0_12px_rgba(0,200,255,0.4)] transition-all duration-200">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#00C8FF]">
                <path d="M12 2L14.5 7L20 8L16 12L17.5 18L12 15L6.5 18L8 12L4 8L9.5 7L12 2Z" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="10" cy="10" r="1.2" fill="#00C8FF" />
                <circle cx="14" cy="10" r="1.2" fill="#00C8FF" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold tracking-tight text-white whitespace-nowrap group-hover:text-[#00C8FF] transition-colors">
                DracoSec <span className="text-[#00C8FF] font-semibold">Codex</span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Ctrl+K Instant Search Bar Trigger */}
        <div className="flex-1 max-w-sm hidden sm:block">
          <button
            onClick={onOpenCommandPalette}
            className="w-full h-8 px-3 rounded-lg bg-[#0B1220] border border-[#00C8FF]/15 hover:border-[#00C8FF]/40 text-[#7C8DA0] hover:text-[#C9D6E2] text-xs flex items-center justify-between transition-all duration-200 group"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-[#00C8FF]" />
              <span className="truncate">Search commands &amp; tools...</span>
            </div>
            <kbd className="font-mono text-[10px] bg-[#162035] text-[#7C8DA0] px-1.5 py-0.5 rounded border border-[#00C8FF]/10 shrink-0 group-hover:text-white">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Zone 3: Desktop Navigation Links & Action Icons */}
        <div className="hidden lg:flex items-center gap-5 text-xs font-medium text-[#7C8DA0]">
          <button
            onClick={() => onSelectTab('commands')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'commands'
                ? 'text-[#00C8FF] font-semibold border-b-2 border-[#00C8FF]'
                : 'hover:text-white'
            }`}
          >
            Commands
          </button>
          <button
            onClick={() => onSelectTab('practice')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'practice'
                ? 'text-[#00C8FF] font-semibold border-b-2 border-[#00C8FF]'
                : 'hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-[#00C8FF]" />
            <span>Practice Lab</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#00C8FF]/15 text-[#00C8FF] border border-[#00C8FF]/30 font-mono">
              CLI
            </span>
          </button>
          <button
            onClick={() => onSelectTab('ai-advisor')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'ai-advisor'
                ? 'text-[#00C8FF] font-semibold border-b-2 border-[#00C8FF]'
                : 'text-[#00C8FF]/90 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00C8FF]" />
            <span>DracoAI</span>
          </button>
          <button
            onClick={() => onSelectTab('learning-path')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'learning-path'
                ? 'text-[#00C8FF] font-semibold border-b-2 border-[#00C8FF]'
                : 'hover:text-white'
            }`}
          >
            Roadmap
          </button>
          <button
            onClick={() => onSelectTab('quiz')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'quiz'
                ? 'text-[#00C8FF] font-semibold border-b-2 border-[#00C8FF]'
                : 'hover:text-white'
            }`}
          >
            Quiz
          </button>
          <button
            onClick={() => onSelectTab('glossary')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'glossary'
                ? 'text-[#00C8FF] font-semibold border-b-2 border-[#00C8FF]'
                : 'hover:text-white'
            }`}
          >
            Glossary
          </button>
          <button
            onClick={() => onSelectTab('lab-setup')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'lab-setup'
                ? 'text-[#00C8FF] font-semibold border-b-2 border-[#00C8FF]'
                : 'hover:text-white'
            }`}
          >
            Lab Setup
          </button>
        </div>

        {/* Zone 4: Action Buttons (Favorites, Ethics, Intro Replay) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile search trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="sm:hidden p-2 rounded-lg bg-[#0B1220] border border-[#00C8FF]/20 text-[#00C8FF]"
            title="Search commands"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Favorites toggle */}
          <button
            onClick={onShowFavorites}
            className={`h-8 px-2.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all duration-200 ${
              showBookmarksOnly
                ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                : 'bg-[#0B1220] text-[#7C8DA0] border-slate-800 hover:text-white hover:border-[#00C8FF]/30'
            }`}
            title="View saved favorites"
          >
            <Bookmark className={`w-3.5 h-3.5 ${showBookmarksOnly ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">Saved</span>
            <span className="font-mono text-[11px] tabular-nums text-white">
              {favoritesCount}
            </span>
          </button>

          {/* Ethical policy button */}
          <button
            onClick={onOpenEthicalModal}
            className="h-8 px-2.5 rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Ethical use & compliance guidelines"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#EF4444]" />
            <span className="hidden sm:inline">Ethics</span>
          </button>

          {/* Replay intro */}
          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              className="hidden md:flex h-8 w-8 rounded-lg border border-slate-800 bg-[#0B1220] text-[#7C8DA0] hover:text-[#00C8FF] hover:border-[#00C8FF]/30 items-center justify-center transition-colors"
              title="Replay 3D Dragon Intro"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden h-8 w-8 rounded-lg bg-[#0B1220] border border-slate-800 text-[#C9D6E2] flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#00C8FF]/15 bg-[#05080F]/95 px-4 py-3 space-y-2 animate-fade-in">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                onSelectTab('commands');
                setMobileMenuOpen(false);
              }}
              className={`p-2 rounded-lg text-left font-medium ${
                activeTab === 'commands' ? 'bg-[#162035] text-[#00C8FF]' : 'text-[#C9D6E2] hover:bg-[#0B1220]'
              }`}
            >
              Commands Codex
            </button>
            <button
              onClick={() => {
                onSelectTab('practice');
                setMobileMenuOpen(false);
              }}
              className={`p-2 rounded-lg text-left font-medium flex items-center gap-1.5 ${
                activeTab === 'practice' ? 'bg-[#162035] text-[#00C8FF]' : 'text-[#C9D6E2] hover:bg-[#0B1220]'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-[#00C8FF]" />
              <span>Practice Lab</span>
            </button>
            <button
              onClick={() => {
                onSelectTab('ai-advisor');
                setMobileMenuOpen(false);
              }}
              className={`p-2 rounded-lg text-left font-medium flex items-center gap-1.5 ${
                activeTab === 'ai-advisor' ? 'bg-[#162035] text-[#00C8FF]' : 'text-[#00C8FF] hover:bg-[#0B1220]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>DracoAI</span>
            </button>
            <button
              onClick={() => {
                onSelectTab('learning-path');
                setMobileMenuOpen(false);
              }}
              className={`p-2 rounded-lg text-left font-medium ${
                activeTab === 'learning-path' ? 'bg-[#162035] text-[#00C8FF]' : 'text-[#C9D6E2] hover:bg-[#0B1220]'
              }`}
            >
              Roadmap
            </button>
            <button
              onClick={() => {
                onSelectTab('quiz');
                setMobileMenuOpen(false);
              }}
              className={`p-2 rounded-lg text-left font-medium ${
                activeTab === 'quiz' ? 'bg-[#162035] text-[#00C8FF]' : 'text-[#C9D6E2] hover:bg-[#0B1220]'
              }`}
            >
              Quiz Challenge
            </button>
            <button
              onClick={() => {
                onSelectTab('glossary');
                setMobileMenuOpen(false);
              }}
              className={`p-2 rounded-lg text-left font-medium ${
                activeTab === 'glossary' ? 'bg-[#162035] text-[#00C8FF]' : 'text-[#C9D6E2] hover:bg-[#0B1220]'
              }`}
            >
              Glossary
            </button>
            <button
              onClick={() => {
                onSelectTab('lab-setup');
                setMobileMenuOpen(false);
              }}
              className={`p-2 rounded-lg text-left font-medium ${
                activeTab === 'lab-setup' ? 'bg-[#162035] text-[#00C8FF]' : 'text-[#C9D6E2] hover:bg-[#0B1220]'
              }`}
            >
              Lab Setup
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
