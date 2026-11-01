import React, { useState } from 'react';
import { CommandItem } from '../types';
import {
  Copy,
  Check,
  Bookmark,
  AlertTriangle,
  Terminal,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Zap,
  Sparkles,
  Target,
} from 'lucide-react';

interface CommandCardProps {
  command: CommandItem;
  categoryName: string;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onRunInTerminal?: (cmd: string) => void;
  onAskAiAboutCommand?: (cmdName: string, promptText: string) => void;
  onPracticeScenario?: (scenarioId?: string) => void;
}

export const CommandCard: React.FC<CommandCardProps> = ({
  command,
  categoryName,
  isBookmarked,
  onToggleBookmark,
  onRunInTerminal,
  onAskAiAboutCommand,
  onPracticeScenario,
}) => {
  const scenarioMap: Record<string, string> = {
    ls: 'recon-hidden-dirs',
    nmap: 'recon-nmap-service-detect',
    find: 'privesc-find-suid',
    gobuster: 'web-fuzz-endpoints',
    hashcat: 'crypto-hash-crack',
    tcpdump: 'network-tcpdump-sniff',
  };
  const matchingScenarioId =
    scenarioMap[command.id] || (command.name ? scenarioMap[command.name.toLowerCase()] : undefined);

  const [copiedSyntax, setCopiedSyntax] = useState(false);
  const [copiedExample, setCopiedExample] = useState(false);
  const [copiedAdvanced, setCopiedAdvanced] = useState(false);
  const [showFullOutput, setShowFullOutput] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'flags' | 'proscons' | 'warning' | 'advanced' | 'protip'>('flags');

  const handleCopySyntax = () => {
    navigator.clipboard.writeText(command.syntax);
    setCopiedSyntax(true);
    setTimeout(() => setCopiedSyntax(false), 2000);
  };

  const handleCopyExample = () => {
    navigator.clipboard.writeText(command.example);
    setCopiedExample(true);
    setTimeout(() => setCopiedExample(false), 2000);
  };

  const handleCopyAdvanced = () => {
    if (command.advancedExample?.command) {
      navigator.clipboard.writeText(command.advancedExample.command);
      setCopiedAdvanced(true);
      setTimeout(() => setCopiedAdvanced(false), 2000);
    }
  };

  const levelBadge = {
    beginner: 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30',
    intermediate: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30',
    advanced: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30',
  }[command.level];

  return (
    <article className="rounded-xl border border-[#00C8FF]/15 bg-[rgba(10,15,25,0.85)] backdrop-blur-[12px] hover:border-[#00C8FF]/35 transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-lg">
      {/* 1. Header: Command Name & Level Badge & Actions */}
      <div className="p-4 sm:p-5 border-b border-[#00C8FF]/10 bg-[#0B1220]/70">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-lg sm:text-xl font-bold font-mono text-white tracking-tight">
              {command.name}
            </h3>
            <span className={`text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md border ${levelBadge}`}>
              {command.level}
            </span>
            <span className="text-xs text-[#7C8DA0]">
              · {categoryName}
            </span>
          </div>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onAskAiAboutCommand && (
              <button
                onClick={() =>
                  onAskAiAboutCommand(
                    command.name,
                    `Give me a production-ready automation script and advanced coding advice using '${command.name}'. Explain how to handle error cases and edge cases.`
                  )
                }
                className="h-8 px-2.5 rounded-lg border border-[#00C8FF]/20 bg-[#00C8FF]/10 text-[#00C8FF] hover:bg-[#00C8FF]/20 transition-all duration-200 text-xs flex items-center gap-1"
                title="Ask DracoAI for coding advice and scripts"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-xs font-medium">Ask AI</span>
              </button>
            )}

            <button
              onClick={() => onToggleBookmark(command.id)}
              className={`h-8 w-8 rounded-lg border transition-all duration-200 flex items-center justify-center ${
                isBookmarked
                  ? 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/40'
                  : 'text-[#7C8DA0] border-slate-800 hover:text-white hover:bg-[#162035]'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark command'}
              aria-label="Bookmark command"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* 1. Syntax Code Block (JetBrains Mono, dark background, cyan text, copy button) */}
        <div className="relative group bg-[#05080F] rounded-lg border border-[#00C8FF]/15 p-2.5 font-mono text-xs sm:text-sm text-[#00C8FF] flex items-center justify-between gap-2 overflow-x-auto">
          <code className="truncate font-semibold">{command.syntax}</code>
          <button
            onClick={handleCopySyntax}
            className="h-7 px-2 rounded-md bg-[#0B1220] border border-[#00C8FF]/20 text-[#7C8DA0] hover:text-[#00C8FF] hover:border-[#00C8FF]/40 text-xs font-sans shrink-0 flex items-center gap-1 transition-all duration-200"
            title="Copy syntax"
          >
            {copiedSyntax ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                <span className="text-[#22C55E] text-[11px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="p-4 sm:p-5 space-y-4 flex-1">
        {/* 2. How it works (Simple explanation for beginners) */}
        <div className="space-y-1">
          <div className="text-xs font-semibold text-[#00C8FF] uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>How it works:</span>
          </div>
          <p className="text-xs sm:text-sm text-[#C9D6E2] leading-relaxed">
            {command.howItWorks || command.eli10}
          </p>
        </div>

        {/* 3. Purpose / Where it is used */}
        <div className="space-y-1 pt-1">
          <div className="text-xs font-semibold text-[#7C8DA0] uppercase tracking-wider">
            Purpose &amp; Use Case:
          </div>
          <p className="text-xs text-[#C9D6E2] leading-relaxed">
            {command.purpose || command.summary}
          </p>
        </div>

        {/* 4. Real Example with Sample Output */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-[#7C8DA0]">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Real Example:</span>
            <div className="flex items-center gap-2.5">
              {matchingScenarioId && onPracticeScenario && (
                <button
                  onClick={() => onPracticeScenario(matchingScenarioId)}
                  className="text-xs text-[#22C55E] hover:text-white flex items-center gap-1 font-mono transition-colors"
                  title="Practice this command in an interactive mission scenario"
                >
                  <Target className="w-3 h-3 text-[#22C55E]" />
                  <span>Practice in Lab</span>
                </button>
              )}
              {onRunInTerminal && (
                <button
                  onClick={() => onRunInTerminal(command.example)}
                  className="text-xs text-[#00C8FF] hover:text-white flex items-center gap-1 font-mono transition-colors"
                >
                  <Terminal className="w-3 h-3" />
                  <span>Run in sandbox</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 p-2 bg-[#05080F] rounded-lg border border-slate-800 font-mono text-xs text-[#22C55E]">
            <code className="truncate">{command.example}</code>
            <button
              onClick={handleCopyExample}
              className="text-[#7C8DA0] hover:text-white p-1 shrink-0 transition-colors"
              title="Copy example command"
            >
              {copiedExample ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Sample Output (Collapsible) */}
          <div className="bg-[#05080F] rounded-lg border border-slate-900 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#0B1220]/60 border-b border-slate-900 text-[11px] text-[#7C8DA0] font-mono">
              <span>Terminal Output Sample</span>
              <button
                onClick={() => setShowFullOutput(!showFullOutput)}
                className="text-[#7C8DA0] hover:text-white flex items-center gap-1 transition-colors"
              >
                {showFullOutput ? (
                  <>Collapse <ChevronUp className="w-3 h-3" /></>
                ) : (
                  <>Expand <ChevronDown className="w-3 h-3" /></>
                )}
              </button>
            </div>
            <pre
              className={`p-3 text-xs font-mono text-[#C9D6E2] overflow-x-auto whitespace-pre-wrap leading-relaxed ${
                showFullOutput ? 'max-h-96' : 'max-h-24'
              }`}
            >
              {command.sampleOutput}
            </pre>
          </div>
        </div>

        {/* Collapsible Deep-Dive Sections (Accordion / Segmented View to keep cards short) */}
        <div className="pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full h-9 px-3 rounded-lg border border-[#00C8FF]/15 bg-[#0B1220] hover:bg-[#162035] text-xs font-medium text-[#C9D6E2] flex items-center justify-between transition-all duration-200"
          >
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C8FF]" />
              <span>{isExpanded ? 'Hide Detailed Sections' : 'View Options, Warnings, Pros/Cons & Advanced'}</span>
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-[#00C8FF]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#7C8DA0]" />
            )}
          </button>

          {isExpanded && (
            <div className="mt-3 space-y-3 pt-1">
              {/* Sub-tab navigation inside collapsible */}
              <div className="flex items-center gap-1 overflow-x-auto p-1 bg-[#05080F] rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveSubTab('flags')}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                    activeSubTab === 'flags'
                      ? 'bg-[#162035] text-[#00C8FF] font-semibold'
                      : 'text-[#7C8DA0] hover:text-white'
                  }`}
                >
                  Flags ({command.flags?.length || 0})
                </button>
                <button
                  onClick={() => setActiveSubTab('warning')}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                    activeSubTab === 'warning'
                      ? 'bg-[#EF4444]/20 text-[#EF4444] font-semibold'
                      : 'text-[#7C8DA0] hover:text-white'
                  }`}
                >
                  What NOT To Do
                </button>
                <button
                  onClick={() => setActiveSubTab('proscons')}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                    activeSubTab === 'proscons'
                      ? 'bg-[#162035] text-[#C9D6E2] font-semibold'
                      : 'text-[#7C8DA0] hover:text-white'
                  }`}
                >
                  Pros &amp; Cons
                </button>
                {command.proTip && (
                  <button
                    onClick={() => setActiveSubTab('protip')}
                    className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                      activeSubTab === 'protip'
                        ? 'bg-[#00C8FF]/20 text-[#00C8FF] font-semibold'
                        : 'text-[#7C8DA0] hover:text-white'
                    }`}
                  >
                    Pro Tip
                  </button>
                )}
                {command.advancedExample && (
                  <button
                    onClick={() => setActiveSubTab('advanced')}
                    className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                      activeSubTab === 'advanced'
                        ? 'bg-[#162035] text-[#00C8FF] font-semibold'
                        : 'text-[#7C8DA0] hover:text-white'
                    }`}
                  >
                    Advanced
                  </button>
                )}
              </div>

              {/* Sub-tab 1: Flags Table */}
              {activeSubTab === 'flags' && (
                <div className="rounded-lg border border-slate-800 overflow-hidden bg-[#05080F]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#0B1220] border-b border-slate-800 text-[#7C8DA0]">
                        <th className="py-2 px-3 font-mono font-medium text-[#00C8FF] w-28 sm:w-36">Option</th>
                        <th className="py-2 px-3 font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {command.flags && command.flags.length > 0 ? (
                        command.flags.map((f, i) => (
                          <tr key={i} className="hover:bg-[#0B1220]/50 transition-colors">
                            <td className="py-2 px-3 font-mono text-[#00C8FF] font-medium align-top">
                              {f.flag}
                            </td>
                            <td className="py-2 px-3 text-[#C9D6E2] leading-normal align-top">
                              {f.description}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2} className="py-3 px-3 text-[#7C8DA0] text-center">
                            No special flags required for standard execution.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Sub-tab 2: What NOT to do (Red-bordered callout box) */}
              {activeSubTab === 'warning' && (
                <div className="p-3.5 rounded-lg border border-[#EF4444]/40 bg-[#EF4444]/10 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-[#EF4444] uppercase tracking-wider text-[11px]">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-[#EF4444]" />
                    <span>What NOT To Do (Warnings &amp; Critical Mistakes):</span>
                  </div>
                  <ul className="space-y-1.5 list-none text-[#EF4444]/90">
                    {command.whatNotToDo && command.whatNotToDo.length > 0 ? (
                      command.whatNotToDo.map((warn, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <span className="font-bold text-[#EF4444]">✕</span>
                          <span>{warn}</span>
                        </li>
                      ))
                    ) : (
                      <li>Never run without explicit authorization on target networks.</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Sub-tab 3: Pros & Cons */}
              {activeSubTab === 'proscons' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Advantages */}
                  <div className="p-3 rounded-lg bg-[#05080F] border border-[#22C55E]/30 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-[#22C55E] uppercase tracking-wider text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                      <span>Advantages:</span>
                    </div>
                    <ul className="space-y-1 list-none text-[#C9D6E2]">
                      {command.advantages?.map((adv, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                          <span className="text-[#22C55E] shrink-0">✓</span>
                          <span>{adv}</span>
                        </li>
                      )) || <li>High speed and standard Linux utility.</li>}
                    </ul>
                  </div>

                  {/* Disadvantages / Limits */}
                  <div className="p-3 rounded-lg bg-[#05080F] border border-[#F59E0B]/30 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-[#F59E0B] uppercase tracking-wider text-[11px]">
                      <XCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>Disadvantages / Limits:</span>
                    </div>
                    <ul className="space-y-1 list-none text-[#C9D6E2]">
                      {command.disadvantages?.map((dis, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                          <span className="text-[#F59E0B] shrink-0">⚠</span>
                          <span>{dis}</span>
                        </li>
                      )) || <li>Requires active network connection or root rights.</li>}
                    </ul>
                  </div>
                </div>
              )}

              {/* Sub-tab 4: Security Pro Tip */}
              {activeSubTab === 'protip' && command.proTip && (
                <div className="p-3.5 rounded-lg border border-[#00C8FF]/30 bg-[#00C8FF]/10 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#00C8FF] uppercase tracking-wider text-[11px]">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Security Pro Tip:</span>
                  </div>
                  <p className="text-[#C9D6E2] leading-relaxed">
                    {command.proTip}
                  </p>
                </div>
              )}

              {/* Sub-tab 5: Advanced Usage Example */}
              {activeSubTab === 'advanced' && command.advancedExample && (
                <div className="p-3.5 rounded-lg bg-[#05080F] border border-[#00C8FF]/20 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#00C8FF] uppercase tracking-wider text-[11px]">
                      Advanced Usage Command:
                    </span>
                    <button
                      onClick={handleCopyAdvanced}
                      className="text-[#7C8DA0] hover:text-[#00C8FF] flex items-center gap-1 text-[11px] transition-colors"
                    >
                      {copiedAdvanced ? <Check className="w-3 h-3 text-[#22C55E]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedAdvanced ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-2 bg-[#0B1220] rounded border border-slate-800 font-mono text-xs text-[#00C8FF] overflow-x-auto">
                    <code>{command.advancedExample.command}</code>
                  </div>
                  <p className="text-[#C9D6E2] leading-relaxed">
                    {command.advancedExample.explanation}
                  </p>
                  {command.advancedExample.output && (
                    <pre className="p-2.5 bg-black/80 text-[#7C8DA0] text-[11px] font-mono rounded border border-slate-800 overflow-x-auto whitespace-pre-wrap">
                      {command.advancedExample.output}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Tags and Action Bar */}
      <div className="px-4 py-3 bg-[#0B1220]/80 border-t border-[#00C8FF]/10 flex items-center justify-between text-xs text-[#7C8DA0]">
        <div className="flex items-center gap-2 truncate">
          {command.tags.slice(0, 3).map((t) => (
            <span key={t} className="text-[#7C8DA0] font-mono text-[11px]">
              #{t}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-[#7C8DA0] hover:text-white transition-colors"
          >
            {isExpanded ? 'Less' : 'Details'}
          </button>
          <span>·</span>
          <button
            onClick={handleCopySyntax}
            className="text-xs text-[#00C8FF] hover:underline font-medium transition-colors"
          >
            {copiedSyntax ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </article>
  );
};
