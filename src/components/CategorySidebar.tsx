import React from 'react';
import { CATEGORIES } from '../data/categories';
import { COMMANDS } from '../data/commands';
import {
  Terminal,
  Network,
  Search,
  Globe,
  KeyRound,
  Wifi,
  Activity,
  Flame,
  FileSearch,
  Code,
  Wrench,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface CategorySidebarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  className?: string;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  className = '',
}) => {
  // Count commands per category
  const commandCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    COMMANDS.forEach((c) => {
      counts[c.categoryId] = (counts[c.categoryId] || 0) + 1;
    });
    return counts;
  }, []);

  const getCategoryIcon = (iconName: string) => {
    const props = { className: 'w-4 h-4 shrink-0' };
    switch (iconName) {
      case 'Terminal':
        return <Terminal {...props} />;
      case 'Network':
        return <Network {...props} />;
      case 'Search':
        return <Search {...props} />;
      case 'Globe':
        return <Globe {...props} />;
      case 'KeyRound':
        return <KeyRound {...props} />;
      case 'Wifi':
        return <Wifi {...props} />;
      case 'Activity':
        return <Activity {...props} />;
      case 'Flame':
        return <Flame {...props} />;
      case 'FileSearch':
        return <FileSearch {...props} />;
      case 'Code':
        return <Code {...props} />;
      case 'Wrench':
        return <Wrench {...props} />;
      default:
        return <Layers {...props} />;
    }
  };

  return (
    <aside className={`w-64 shrink-0 space-y-4 ${className}`}>
      <div className="flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-[#7C8DA0]">
        <span>Categories</span>
        <span className="font-mono text-[11px] text-[#00C8FF]">{COMMANDS.length} cmds</span>
      </div>

      <nav className="space-y-1">
        {/* All Commands option */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
            selectedCategory === 'all'
              ? 'bg-[#162035] text-white border border-[#00C8FF]/30 shadow-[0_0_12px_rgba(0,200,255,0.15)] font-semibold'
              : 'text-[#C9D6E2] hover:bg-[#0B1220] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5 truncate">
            <div className={`p-1 rounded-md ${selectedCategory === 'all' ? 'text-[#00C8FF]' : 'text-[#7C8DA0]'}`}>
              <Layers className="w-4 h-4" />
            </div>
            <span className="truncate">All Categories</span>
          </div>
          <span className="font-mono text-[11px] text-[#7C8DA0] tabular-nums">
            {COMMANDS.length}
          </span>
        </button>

        {/* Category list */}
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = commandCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 group ${
                isSelected
                  ? 'bg-[#162035] text-white border border-[#00C8FF]/30 shadow-[0_0_12px_rgba(0,200,255,0.15)] font-semibold'
                  : 'text-[#7C8DA0] hover:bg-[#0B1220] hover:text-[#C9D6E2]'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <div
                  className={`p-1 rounded-md transition-colors ${
                    isSelected ? 'text-[#00C8FF]' : 'text-[#7C8DA0] group-hover:text-[#C9D6E2]'
                  }`}
                >
                  {getCategoryIcon(cat.iconName)}
                </div>
                <span className="truncate">{cat.shortName}</span>
              </div>
              <span
                className={`font-mono text-[11px] tabular-nums ${
                  isSelected ? 'text-[#00C8FF] font-semibold' : 'text-[#7C8DA0]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
