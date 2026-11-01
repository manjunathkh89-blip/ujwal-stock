import React, { useState, useEffect, useRef } from 'react';
import { PracticeScenario, ScenarioTrack } from '../types';
import { PRACTICE_SCENARIOS } from '../data/scenarios';
import {
  Terminal as TerminalIcon,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  ChevronRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Target,
  Shield,
  Zap,
  Code2,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface CommandPracticeProps {
  initialScenarioId?: string;
  onAskAiHint?: (prompt: string) => void;
  onOpenCodexCommand?: (cmdName: string) => void;
}

interface UserProgress {
  completedIds: string[];
  totalXp: number;
  revealedHints: Record<string, number>; // scenarioId -> max hint index revealed
  revealedSolutions: string[];
}

const DEFAULT_PROGRESS: UserProgress = {
  completedIds: [],
  totalXp: 0,
  revealedHints: {},
  revealedSolutions: [],
};

export const CommandPractice: React.FC<CommandPracticeProps> = ({
  initialScenarioId,
  onAskAiHint,
  onOpenCodexCommand,
}) => {
  // Track selection & filter
  const [selectedTrack, setSelectedTrack] = useState<ScenarioTrack | 'all'>('all');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    initialScenarioId || PRACTICE_SCENARIOS[0].id
  );

  // Load progress from localStorage
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem('dracosec_practice_progress');
      return saved ? JSON.parse(saved) : DEFAULT_PROGRESS;
    } catch {
      return DEFAULT_PROGRESS;
    }
  });

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem('dracosec_practice_progress', JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  // Terminal state
  const currentScenario =
    PRACTICE_SCENARIOS.find((s) => s.id === selectedScenarioId) || PRACTICE_SCENARIOS[0];

  const [inputCommand, setInputCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [terminalLogs, setTerminalLogs] = useState<
    { type: 'input' | 'output' | 'success' | 'error' | 'tip'; text: string; path?: string }[]
  >([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize terminal when switching scenario
  useEffect(() => {
    setInputCommand('');
    setHistoryIndex(-1);
    setShowSolution(false);
    setIsSuccessModalOpen(false);

    const isAlreadyCompleted = progress.completedIds.includes(currentScenario.id);

    setTerminalLogs([
      {
        type: 'output',
        text: `--- DRACOSEC SIMULATED CLI: ${currentScenario.title.toUpperCase()} ---`,
      },
      {
        type: 'tip',
        text: `Target: ${currentScenario.targetEnv}\nObjective: ${currentScenario.objective}\nType your command below and press Enter. Type "help" or "hint" if you need guidance.`,
      },
      ...(isAlreadyCompleted
        ? [
            {
              type: 'success' as const,
              text: `[!] STATUS: Previously mastered (+${currentScenario.xp} XP awarded). Feel free to practice again!`,
            },
          ]
        : []),
    ]);

    // Auto-focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  }, [selectedScenarioId]);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  // Handle external initialScenarioId change
  useEffect(() => {
    if (initialScenarioId && PRACTICE_SCENARIOS.some((s) => s.id === initialScenarioId)) {
      setSelectedScenarioId(initialScenarioId);
    }
  }, [initialScenarioId]);

  // Rank determination
  const calculateRank = (xp: number) => {
    if (xp >= 800) return { title: 'Apex Draco Master', badge: 'Dragon', color: '#00C8FF', progress: 100 };
    if (xp >= 500) return { title: 'Red Team Operator', badge: 'Elite', color: '#2F6BFF', progress: (xp / 800) * 100 };
    if (xp >= 300) return { title: 'Cyber Specialist', badge: 'Specialist', color: '#22C55E', progress: (xp / 500) * 100 };
    if (xp >= 100) return { title: 'Recon Scout', badge: 'Scout', color: '#F59E0B', progress: (xp / 300) * 100 };
    return { title: 'Script Novice', badge: 'Recruit', color: '#7C8DA0', progress: (xp / 100) * 100 };
  };

  const userRank = calculateRank(progress.totalXp);

  // Check command logic
  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputCommand.trim();
    if (!cmd) return;

    // Add to history
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    // Append user input line
    const newLogs = [
      ...terminalLogs,
      { type: 'input' as const, text: cmd, path: currentScenario.simulatedPath },
    ];

    // Check special system commands
    if (cmd.toLowerCase() === 'clear') {
      setTerminalLogs([]);
      setInputCommand('');
      return;
    }

    if (cmd.toLowerCase() === 'help') {
      newLogs.push({
        type: 'output',
        text: `DracoSec CLI Help:
- Objective: ${currentScenario.objective}
- clear: Clear the terminal display
- hint: Reveal the next tactical hint
- solution: Reveal the validated solution command
- Any valid Kali Linux command fulfilling this lab objective`,
      });
      setTerminalLogs(newLogs);
      setInputCommand('');
      return;
    }

    if (cmd.toLowerCase() === 'hint') {
      handleRevealNextHint();
      setTerminalLogs(newLogs);
      setInputCommand('');
      return;
    }

    if (cmd.toLowerCase() === 'solution') {
      setShowSolution(true);
      newLogs.push({
        type: 'tip',
        text: `[SOLVED REVEAL] Tactical Solution Command:\n$ ${currentScenario.solutionCommand}\n\nExplanation: ${currentScenario.solutionExplanation}`,
      });
      setTerminalLogs(newLogs);
      setInputCommand('');
      return;
    }

    // Check against accepted commands
    let isAccepted = false;
    for (const rule of currentScenario.acceptedCommands) {
      if (rule.isRegex) {
        try {
          const reg = new RegExp(rule.pattern, 'i');
          if (reg.test(cmd)) {
            isAccepted = true;
            break;
          }
        } catch {
          // ignore invalid regex
        }
      } else if (cmd.toLowerCase() === rule.pattern.toLowerCase()) {
        isAccepted = true;
        break;
      }
    }

    if (isAccepted) {
      // SUCCESS!
      newLogs.push({
        type: 'output',
        text: currentScenario.simulatedOutput,
      });

      const alreadySolved = progress.completedIds.includes(currentScenario.id);
      if (!alreadySolved) {
        setProgress((prev) => ({
          ...prev,
          completedIds: [...prev.completedIds, currentScenario.id],
          totalXp: prev.totalXp + currentScenario.xp,
        }));
      }

      newLogs.push({
        type: 'success',
        text: `[✓] MISSION OBJECTIVE ACCOMPLISHED! +${currentScenario.xp} XP Earned. Excellent execution, Operator.`,
      });

      setIsSuccessModalOpen(true);
    } else {
      // Check if it matches a known common mistake
      let feedbackTip = '';
      if (currentScenario.commonMistakes) {
        for (const mistake of currentScenario.commonMistakes) {
          try {
            const reg = new RegExp(mistake.pattern, 'i');
            if (reg.test(cmd)) {
              feedbackTip = mistake.feedback;
              break;
            }
          } catch {
            // ignore
          }
        }
      }

      if (feedbackTip) {
        newLogs.push({
          type: 'error',
          text: `[-] Tactical Review: ${feedbackTip}`,
        });
      } else {
        // Generic simulated Linux response
        const baseCmd = cmd.split(' ')[0];
        const knownUtilities = ['ls', 'find', 'nmap', 'gobuster', 'hashcat', 'tcpdump', 'grep', 'cat', 'sudo'];
        if (knownUtilities.includes(baseCmd)) {
          newLogs.push({
            type: 'error',
            text: `[-] Command executed, but it does not achieve the specific mission objective: "${currentScenario.objective}".\nCheck your flags or type "hint" for guidance.`,
          });
        } else {
          newLogs.push({
            type: 'error',
            text: `bash: ${baseCmd}: command not recognized in this lab target. Use the appropriate Kali utility. Type "hint" for clues.`,
          });
        }
      }
    }

    setTerminalLogs(newLogs);
    setInputCommand('');
  };

  // Keyboard navigation for history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputCommand(commandHistory[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputCommand('');
      } else {
        setHistoryIndex(nextIndex);
        setInputCommand(commandHistory[nextIndex] || '');
      }
    }
  };

  const handleRevealNextHint = () => {
    const currentHintsRevealed = progress.revealedHints[currentScenario.id] || 0;
    if (currentHintsRevealed < currentScenario.hints.length) {
      const nextLevel = currentHintsRevealed + 1;
      setProgress((prev) => ({
        ...prev,
        revealedHints: {
          ...prev.revealedHints,
          [currentScenario.id]: nextLevel,
        },
      }));
      setTerminalLogs((prev) => [
        ...prev,
        {
          type: 'tip',
          text: `[HINT #${nextLevel} REVEALED] ${currentScenario.hints[nextLevel - 1]}`,
        },
      ]);
    }
  };

  const handleNextScenario = () => {
    const currentIndex = PRACTICE_SCENARIOS.findIndex((s) => s.id === currentScenario.id);
    const nextIndex = (currentIndex + 1) % PRACTICE_SCENARIOS.length;
    setSelectedScenarioId(PRACTICE_SCENARIOS[nextIndex].id);
  };

  const handleResetProgress = () => {
    if (window.confirm('Reset all completed practice missions and XP?')) {
      setProgress(DEFAULT_PROGRESS);
      localStorage.removeItem('dracosec_practice_progress');
      setTerminalLogs([
        {
          type: 'tip',
          text: 'Practice progress reset. All scenario locks and XP cleared.',
        },
      ]);
    }
  };

  const filteredScenarios =
    selectedTrack === 'all'
      ? PRACTICE_SCENARIOS
      : PRACTICE_SCENARIOS.filter((s) => s.track === selectedTrack);

  const isCompleted = progress.completedIds.includes(currentScenario.id);
  const hintsRevealedCount = progress.revealedHints[currentScenario.id] || 0;

  return (
    <div className="w-full max-w-[1320px] mx-auto px-4 py-6 space-y-6">
      {/* Top Bar: Mission Header & Operator Stats */}
      <div className="bg-[#0B1220]/85 backdrop-blur-md border border-[#00C8FF]/20 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-lg bg-[#05080F] border border-[#00C8FF]/40 flex items-center justify-center text-[#00C8FF] shadow-[0_0_15px_rgba(0,200,255,0.2)]">
            <Target className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Tactical Command Practice Lab
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#00C8FF]/10 text-[#00C8FF] border border-[#00C8FF]/30">
                CLI SANDBOX
              </span>
            </div>
            <p className="text-xs text-[#7C8DA0] mt-0.5">
              Solve offensive security scenarios by typing the exact Kali commands. Real-time feedback, hint trees, and exploit explanations.
            </p>
          </div>
        </div>

        {/* User Rank Card */}
        <div className="flex items-center gap-4 bg-[#05080F]/80 border border-[#00C8FF]/15 px-4 py-2.5 rounded-lg w-full md:w-auto justify-between md:justify-end">
          <div className="text-right">
            <div className="text-[11px] text-[#7C8DA0] font-mono uppercase tracking-wider">Operator Rank</div>
            <div className="text-sm font-bold text-white flex items-center justify-end gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#00C8FF]" />
              <span style={{ color: userRank.color }}>{userRank.title}</span>
            </div>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-right">
            <div className="text-[11px] text-[#7C8DA0] font-mono uppercase tracking-wider">Total XP</div>
            <div className="text-sm font-bold font-mono text-[#00C8FF]">
              {progress.totalXp} <span className="text-[10px] text-[#7C8DA0]">XP</span>
            </div>
          </div>
          <button
            onClick={handleResetProgress}
            title="Reset progress"
            className="p-1.5 text-[#7C8DA0] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Track Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs text-[#7C8DA0] font-mono uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5 text-[#00C8FF]" /> Tracks:
        </span>
        {[
          { id: 'all', label: 'All Missions' },
          { id: 'system', label: 'System & Artifacts' },
          { id: 'network', label: 'Network Recon' },
          { id: 'web', label: 'Web Discovery' },
          { id: 'privesc', label: 'Privilege Escalation' },
          { id: 'recon', label: 'Credentials & Crypto' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTrack(t.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 ${
              selectedTrack === t.id
                ? 'bg-[#00C8FF] text-[#05080F] font-bold shadow-[0_0_12px_rgba(0,200,255,0.4)]'
                : 'bg-[#0B1220] text-[#C9D6E2] border border-[#00C8FF]/15 hover:border-[#00C8FF]/40'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Left Briefing + Right Interactive Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 5 Cols: Scenario Selection & Briefing */}
        <div className="lg:col-span-5 space-y-4">
          {/* Mission Selector Dropdown / Scroll list */}
          <div className="bg-[#0B1220]/90 backdrop-blur-md border border-[#00C8FF]/15 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#7C8DA0] uppercase tracking-wider">
                Select Scenario ({filteredScenarios.length})
              </span>
              <span className="text-xs font-mono text-[#00C8FF]">
                {progress.completedIds.length} / {PRACTICE_SCENARIOS.length} Completed
              </span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {filteredScenarios.map((scenario) => {
                const solved = progress.completedIds.includes(scenario.id);
                const isCurrent = scenario.id === currentScenario.id;
                return (
                  <button
                    key={scenario.id}
                    onClick={() => setSelectedScenarioId(scenario.id)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-between gap-2 ${
                      isCurrent
                        ? 'bg-[#00C8FF]/15 border-[#00C8FF] text-white shadow-[0_0_10px_rgba(0,200,255,0.2)]'
                        : 'bg-[#05080F]/60 border-white/5 text-[#C9D6E2] hover:border-[#00C8FF]/30 hover:bg-[#0B1220]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {solved ? (
                        <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-[#00C8FF]/40 shrink-0" />
                      )}
                      <span className="truncate">{scenario.title}</span>
                    </div>
                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-black/40 text-[#7C8DA0] shrink-0">
                      +{scenario.xp} XP
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Mission Briefing Card */}
          <div className="bg-[#0B1220]/90 backdrop-blur-md border border-[#00C8FF]/15 rounded-xl p-5 space-y-4 shadow-xl">
            {/* Mission Header */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-[#2F6BFF]/15 text-[#00C8FF] border border-[#2F6BFF]/30">
                  {currentScenario.track.toUpperCase()} LAB
                </span>
                <span className="text-xs font-mono text-[#F59E0B]">
                  Level: {currentScenario.difficulty.toUpperCase()}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">{currentScenario.title}</h2>
              {currentScenario.mitreTechnique && (
                <div className="text-[11px] font-mono text-[#7C8DA0] mt-1 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[#00C8FF]" /> MITRE: {currentScenario.mitreTechnique}
                </div>
              )}
            </div>

            {/* Target Environment Box */}
            <div className="p-3 rounded-lg bg-[#05080F]/90 border border-white/5 font-mono text-xs space-y-1">
              <div className="text-[#7C8DA0] text-[10px] uppercase tracking-wider">Target Environment:</div>
              <div className="text-[#00C8FF] font-semibold">{currentScenario.targetEnv}</div>
              <div className="text-[11px] text-[#C9D6E2] mt-1">{currentScenario.briefing}</div>
            </div>

            {/* Tactical Objective Checklist */}
            <div className="p-3.5 rounded-lg bg-[#00C8FF]/5 border border-[#00C8FF]/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-white">
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#00C8FF]" /> Mission Objective
                </span>
                {isCompleted && (
                  <span className="text-[11px] text-[#22C55E] flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                  </span>
                )}
              </div>
              <p className="text-xs text-[#C9D6E2] font-mono leading-relaxed bg-[#05080F]/60 p-2.5 rounded border border-white/5">
                {currentScenario.objective}
              </p>
            </div>

            {/* Progressive Hint Drawer */}
            <div className="space-y-2 pt-1 border-t border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#7C8DA0] flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-[#F59E0B]" />
                  Tactical Hints ({hintsRevealedCount} of {currentScenario.hints.length})
                </span>
                {hintsRevealedCount < currentScenario.hints.length ? (
                  <button
                    onClick={handleRevealNextHint}
                    className="text-xs font-mono text-[#00C8FF] hover:underline flex items-center gap-1"
                  >
                    Unlock Next Hint (+0 XP penalty)
                  </button>
                ) : (
                  <span className="text-[11px] font-mono text-[#7C8DA0]">All hints unlocked</span>
                )}
              </div>

              {hintsRevealedCount > 0 && (
                <div className="space-y-1.5">
                  {currentScenario.hints.slice(0, hintsRevealedCount).map((hint, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-xs font-mono text-[#F59E0B] leading-relaxed"
                    >
                      <span className="font-bold">Hint {idx + 1}:</span> {hint}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Solution & AI Bridge Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
              <button
                onClick={() => setShowSolution((prev) => !prev)}
                className="px-3 py-1.5 rounded-lg bg-[#05080F] border border-white/10 hover:border-[#00C8FF]/30 text-xs font-mono text-[#C9D6E2] transition-colors flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5 text-[#00C8FF]" />
                {showSolution ? 'Hide Solution' : 'Reveal Solution'}
              </button>

              {onAskAiHint && (
                <button
                  onClick={() =>
                    onAskAiHint(
                      `I am stuck in the DracoSec Command Practice lab on the scenario "${currentScenario.title}". The objective is "${currentScenario.objective}". Can you give me an educational hint or breakdown without spoiling the exact solution directly?`
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-[#00C8FF]/10 hover:bg-[#00C8FF]/20 border border-[#00C8FF]/30 text-xs font-mono text-[#00C8FF] transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ask DracoAI for Hint
                </button>
              )}
            </div>

            {/* Revealed Solution Card */}
            {showSolution && (
              <div className="p-3.5 rounded-lg bg-[#05080F] border border-[#00C8FF]/30 space-y-2 font-mono text-xs animate-in fade-in duration-200">
                <div className="text-[10px] uppercase font-bold text-[#00C8FF] tracking-wider">
                  Validated Command Solution:
                </div>
                <div className="bg-[#0B1220] p-2 rounded border border-white/10 text-white font-bold select-all">
                  $ {currentScenario.solutionCommand}
                </div>
                <p className="text-[11px] text-[#7C8DA0] leading-relaxed">
                  {currentScenario.solutionExplanation}
                </p>
                <button
                  onClick={() => setInputCommand(currentScenario.solutionCommand)}
                  className="text-xs text-[#00C8FF] hover:underline flex items-center gap-1"
                >
                  Insert into terminal <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right 7 Cols: Authentic Interactive Kali Terminal Sandbox */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-[#05080F] border border-[#00C8FF]/25 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[620px]">
            {/* Terminal Window Header */}
            <div className="bg-[#0B1220] px-4 py-2.5 border-b border-[#00C8FF]/15 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]/80" />
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]/80" />
                <div className="w-3 h-3 rounded-full bg-[#22C55E]/80" />
                <span className="text-xs font-mono text-[#7C8DA0] ml-2 flex items-center gap-1.5">
                  <TerminalIcon className="w-3.5 h-3.5 text-[#00C8FF]" />
                  {currentScenario.simulatedPath.replace('$', '')} (bash)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTerminalLogs([])}
                  className="text-[11px] font-mono text-[#7C8DA0] hover:text-white px-2 py-0.5 rounded hover:bg-white/5 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handleNextScenario}
                  className="text-[11px] font-mono text-[#00C8FF] hover:text-white px-2.5 py-0.5 rounded bg-[#00C8FF]/10 hover:bg-[#00C8FF]/30 transition-colors flex items-center gap-1"
                >
                  Next Lab <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Terminal Scrollable Body */}
            <div
              className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2.5 text-[#C9D6E2] select-text"
              onClick={() => inputRef.current?.focus()}
            >
              {terminalLogs.map((log, i) => {
                if (log.type === 'input') {
                  return (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[#00C8FF] shrink-0 font-bold">
                        {log.path || currentScenario.simulatedPath}
                      </span>
                      <span className="text-white font-semibold">{log.text}</span>
                    </div>
                  );
                }
                if (log.type === 'success') {
                  return (
                    <div
                      key={i}
                      className="p-2.5 rounded bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] font-semibold whitespace-pre-wrap leading-relaxed shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                    >
                      {log.text}
                    </div>
                  );
                }
                if (log.type === 'error') {
                  return (
                    <div
                      key={i}
                      className="p-2 rounded bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] whitespace-pre-wrap leading-relaxed"
                    >
                      {log.text}
                    </div>
                  );
                }
                if (log.type === 'tip') {
                  return (
                    <div
                      key={i}
                      className="p-2.5 rounded bg-[#00C8FF]/10 border border-[#00C8FF]/20 text-[#00C8FF] whitespace-pre-wrap leading-relaxed"
                    >
                      {log.text}
                    </div>
                  );
                }
                return (
                  <div key={i} className="text-[#C9D6E2] whitespace-pre-wrap leading-relaxed">
                    {log.text}
                  </div>
                );
              })}
              <div ref={terminalEndRef} />
            </div>

            {/* Interactive Input Line */}
            <form
              onSubmit={handleExecute}
              className="bg-[#0B1220]/90 border-t border-[#00C8FF]/15 px-4 py-3 flex items-center gap-2"
            >
              <span className="text-[#00C8FF] font-mono text-xs font-bold shrink-0">
                {currentScenario.simulatedPath}
              </span>
              <input
                ref={inputRef}
                type="text"
                value={inputCommand}
                onChange={(e) => setInputCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="type command (e.g. ls -la) or 'hint' / 'help'..."
                autoComplete="off"
                spellCheck="false"
                className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder-[#7C8DA0]/60 caret-[#00C8FF]"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-[#00C8FF] hover:bg-[#00C8FF]/90 text-[#05080F] font-mono text-xs font-bold rounded transition-all shadow-[0_0_10px_rgba(0,200,255,0.3)] shrink-0"
              >
                Execute
              </button>
            </form>
          </div>

          {/* Quick Helper Shortcut Pills */}
          <div className="flex flex-wrap items-center justify-between text-xs text-[#7C8DA0] font-mono px-1">
            <div className="flex items-center gap-3">
              <span>↑/↓ history</span>
              <span>•</span>
              <span>type "hint" for clues</span>
              <span>•</span>
              <span>type "clear" to wipe</span>
            </div>
            {isCompleted && (
              <span className="text-[#22C55E] flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Lab Completed (+{currentScenario.xp} XP)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Completion Modal / Banner Overlay */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0B1220] border-2 border-[#00C8FF] rounded-2xl p-6 max-w-md w-full shadow-[0_0_30px_rgba(0,200,255,0.3)] space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E] flex items-center justify-center">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Mission Accomplished!</h3>
                <p className="text-xs text-[#00C8FF] font-mono">+{currentScenario.xp} XP Credited to Operator</p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#05080F] border border-white/10 font-mono text-xs space-y-1.5">
              <div className="text-[#7C8DA0] uppercase text-[10px]">Security Analysis:</div>
              <p className="text-[#C9D6E2] leading-relaxed">{currentScenario.solutionExplanation}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#05080F] border border-white/10 text-xs font-mono text-[#C9D6E2] hover:text-white"
              >
                Stay in Lab
              </button>
              <button
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  handleNextScenario();
                }}
                className="px-4 py-2 rounded-lg bg-[#00C8FF] text-[#05080F] text-xs font-mono font-bold hover:shadow-[0_0_15px_rgba(0,200,255,0.4)] flex items-center gap-1.5"
              >
                Next Mission <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Branding Signature */}
      <footer className="pt-8 pb-4 text-center border-t border-white/5">
        <p className="text-xs font-mono text-[#7C8DA0]">
          DracoSec: Kali Linux Command Codex • Tactical Training Labs • Delivered by{' '}
          <span className="text-white font-medium">Manjunath KH</span>
        </p>
      </footer>
    </div>
  );
};
