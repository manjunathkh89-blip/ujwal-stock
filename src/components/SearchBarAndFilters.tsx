import React from 'react';
import { CATEGORIES } from '../data/categories';
import { CommandLevel } from '../types';
import { Search, X, Terminal, Filter, Bookmark } from 'lucide-react';

interface SearchBarAndFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  selectedLevel: CommandLevel | 'all';
  onSelectLevel: (lvl: CommandLevel | 'all') => void;
  showBookmarksOnly: boolean;
  onToggleBookmarksOnly: () => void;
  bookmarksCount: number;
  totalFilteredCount: number;
  totalCommandsCount: number;
  onResetFilters: () => void;
  onToggleTerminal: () => void;
  isTerminalOpen: boolean;
  activeCategoryName?: string;
}

export const SearchBarAndFilters: React.FC<SearchBarAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedLevel,
  onSelectLevel,
  showBookmarksOnly,
  onToggleBookmarksOnly,
  bookmarksCount,
  totalFilteredCount,
  totalCommandsCount,
  onResetFilters,
  onToggleTerminal,
  isTerminalOpen,
  activeCategoryName = 'All Commands',
}) => {
  const isFiltered =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedLevel !== 'all' ||
    showBookmarksOnly;

  return (
    <div className="space-y-3">
      {/* Search & Level Filters Toolbar */}
      <div className="rounded-xl border border-[#00C8FF]/15 bg-[rgba(10,15,25,0.85)] backdrop-blur-[12px] p-3.5 space-y-3 shadow-md">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Main inline search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#00C8FF] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search commands, syntax, flags, or tools..."
              className="w-full h-9 bg-[#05080F] border border-slate-800 focus:border-[#00C8FF] rounded-lg pl-9 pr-8 text-xs text-white placeholder-[#7C8DA0] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7C8DA0] hover:text-white"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Level Filter Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-[#05080F] rounded-lg border border-slate-800 text-xs shrink-0">
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((lvl) => {
              const isSelected = selectedLevel === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => onSelectLevel(lvl)}
                  className={`h-7 px-2.5 rounded-md text-xs font-medium transition-all duration-200 capitalize ${
                    isSelected
                      ? 'bg-[#162035] text-white font-semibold border border-[#00C8FF]/30 shadow-[0_0_8px_rgba(0,200,255,0.15)]'
                      : 'text-[#7C8DA0] hover:text-[#C9D6E2]'
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>

          {/* Terminal Sandbox Toggle */}
          <button
            onClick={onToggleTerminal}
            className={`h-9 px-3 rounded-lg border text-xs font-mono transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
              isTerminalOpen
                ? 'bg-[#162035] text-[#00C8FF] border-[#00C8FF]/40 font-semibold'
                : 'bg-[#05080F] text-[#7C8DA0] border-slate-800 hover:text-white'
            }`}
            title="Toggle interactive terminal sandbox"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sandbox</span>
          </button>
        </div>

        {/* Mobile Category Select Dropdown */}
        <div className="md:hidden flex items-center gap-2 pt-1">
          <Filter className="w-3.5 h-3.5 text-[#00C8FF] shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            className="w-full h-8 bg-[#05080F] border border-slate-800 text-xs text-white rounded-lg px-2 focus:outline-none focus:border-[#00C8FF]"
          >
            <option value="all">All Categories ({totalCommandsCount})</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.shortName}
              </option>
            ))}
          </select>
        </div>

        {/* Counter and Reset Row */}
        <div className="flex items-center justify-between text-xs text-[#7C8DA0] pt-1 border-t border-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{activeCategoryName}</span>
            <span>·</span>
            <span>
              Showing <strong className="text-[#00C8FF] font-mono">{totalFilteredCount}</strong> of{' '}
              <span className="font-mono">{totalCommandsCount}</span> commands
            </span>
          </div>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="text-xs text-[#EF4444] hover:underline transition-colors"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
