import React, { useState, useMemo } from 'react';
import { GLOSSARY } from '../data/glossary';
import { BookOpen, Search, X } from 'lucide-react';

export const GlossaryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const set = new Set<string>();
    GLOSSARY.forEach((item) => set.add(item.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredGlossary = useMemo(() => {
    return GLOSSARY.filter((item) => {
      const matchCat = activeCategory === 'All' || item.category === activeCategory;
      const matchSearch =
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.practicalExample.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [searchTerm, activeCategory]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header & Search */}
      <div className="p-6 rounded-xl border border-[#00C8FF]/15 bg-[rgba(10,15,25,0.85)] backdrop-blur-[12px] shadow-md space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#00C8FF]" />
            Cybersecurity &amp; Kali Glossary
          </h2>
          <p className="text-xs sm:text-sm text-[#7C8DA0] mt-1">
            Core terminology explained simply with concrete pentesting context (IP, SUID, Reverse Shell, Handshake, CVE, and more).
          </p>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#00C8FF] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search terms, definitions, or examples (e.g. SUID, Hash, Reverse Shell)..."
            className="w-full bg-[#05080F] border border-slate-800 focus:border-[#00C8FF] rounded-lg pl-10 pr-10 py-2.5 text-xs sm:text-sm text-[#C9D6E2] placeholder-[#7C8DA0] focus:outline-none transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7C8DA0] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGlossary.map((item) => (
          <div
            key={item.term}
            className="p-5 rounded-xl border border-slate-800/80 bg-slate-950/70 hover:border-emerald-600/40 transition-colors space-y-3 flex flex-col justify-between shadow-md"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {item.term}
                </h3>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2 py-0.5 rounded">
                  {item.category}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {item.definition}
              </p>
            </div>

            <div className="p-2.5 rounded bg-black/60 border border-slate-800/80 text-xs space-y-0.5 font-mono">
              <span className="text-slate-500 text-[10px] uppercase tracking-wider block font-sans">
                Real-World Pentest Context:
              </span>
              <p className="text-emerald-300/90 text-[11px] leading-relaxed">
                {item.practicalExample}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredGlossary.length === 0 && (
        <div className="p-8 text-center text-slate-500 border border-slate-800 rounded-xl bg-slate-950/50">
          No glossary terms found matching "{searchTerm}". Try clearing your search.
        </div>
      )}
    </div>
  );
};
