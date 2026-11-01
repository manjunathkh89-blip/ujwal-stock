import React, { useState, useEffect, useRef } from 'react';
import { COMMANDS } from '../data/commands';
import { CATEGORIES } from '../data/categories';
import { CommandItem } from '../types';
import { Search, X, Terminal, CornerDownLeft, Sparkles } from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCommand: (command: CommandItem) => void;
  onOpenAiWithPrompt?: (commandName: string, promptText: string) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectCommand,
  onOpenAiWithPrompt,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const categoryMap = React.useMemo(() => {
    const map = new Map<string, string>();
    CATEGORIES.forEach((c) => map.set(c.id, c.name));
    return map;
  }, []);

  const results = React.useMemo(() => {
    if (!query.trim()) {
      return COMMANDS.slice(0, 10);
    }
    const q = query.toLowerCase().trim();
    return COMMANDS.filter((cmd) => {
      return (
        cmd.name.toLowerCase().includes(q) ||
        cmd.syntax.toLowerCase().includes(q) ||
        (cmd.summary && cmd.summary.toLowerCase().includes(q)) ||
        (cmd.purpose && cmd.purpose.toLowerCase().includes(q)) ||
        cmd.tags.some((t) => t.toLowerCase().includes(q)) ||
        cmd.flags.some((f) => f.flag.toLowerCase().includes(q) || f.description.toLowerCase().includes(q))
      );
    }).slice(0, 12);
  }, [query]);

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          onSelectCommand(results[selectedIndex]);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, onSelectCommand]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl rounded-xl border border-[#00C8FF]/20 bg-[#0B1220] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#00C8FF]/15 bg-[#0A0F19]">
          <Search className="w-5 h-5 text-[#00C8FF] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, tool, or flag (e.g. nmap, hydra, -sV, ssh)..."
            className="w-full bg-transparent text-sm text-white placeholder-[#7C8DA0] focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#7C8DA0] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-[#7C8DA0] bg-[#162035] px-2 py-0.5 rounded border border-[#00C8FF]/10">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-[#00C8FF]/10 p-1">
          {results.length > 0 ? (
            results.map((cmd, index) => {
              const isSelected = index === selectedIndex;
              const levelColor =
                cmd.level === 'beginner'
                  ? 'text-[#22C55E] border-[#22C55E]/30 bg-[#22C55E]/10'
                  : cmd.level === 'intermediate'
                  ? 'text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/10'
                  : 'text-[#EF4444] border-[#EF4444]/30 bg-[#EF4444]/10';

              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    onSelectCommand(cmd);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`px-3.5 py-3 rounded-lg cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                    isSelected ? 'bg-[#162035] text-white' : 'text-[#C9D6E2] hover:bg-[#0E1729]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center font-mono text-xs border ${
                        isSelected
                          ? 'border-[#00C8FF]/40 text-[#00C8FF] bg-[#00C8FF]/10'
                          : 'border-slate-800 text-slate-400 bg-slate-900'
                      }`}
                    >
                      <Terminal className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-white text-sm">
                          {cmd.name}
                        </span>
                        <span className={`text-[10px] uppercase font-mono px-1.5 py-0.2 rounded border ${levelColor}`}>
                          {cmd.level}
                        </span>
                        <span className="text-xs text-[#7C8DA0] truncate">
                          · {categoryMap.get(cmd.categoryId) || 'Linux'}
                        </span>
                      </div>
                      <p className="text-xs text-[#7C8DA0] truncate max-w-md font-mono mt-0.5">
                        {cmd.syntax}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {onOpenAiWithPrompt && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenAiWithPrompt(
                            cmd.name,
                            `Explain ${cmd.name} security flags and provide an automation script with robust error handling.`
                          );
                          onClose();
                        }}
                        className="p-1.5 rounded text-[11px] font-sans text-[#00C8FF] hover:bg-[#00C8FF]/15 flex items-center gap-1 transition-colors"
                        title="Ask DracoAI about this command"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span className="hidden sm:inline">Ask AI</span>
                      </button>
                    )}
                    <span className="text-[11px] font-mono text-[#7C8DA0] flex items-center gap-1">
                      <CornerDownLeft className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-[#7C8DA0]">
              <p className="text-sm">No commands matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs mt-1">Try searching for nmap, ssh, hashcat, grep, or hydra</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2 bg-[#0A0F19] border-t border-[#00C8FF]/15 text-xs text-[#7C8DA0] flex items-center justify-between font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-[11px] text-[#00C8FF]">DracoSec Quick Jump</span>
        </div>
      </div>
    </div>
  );
};
