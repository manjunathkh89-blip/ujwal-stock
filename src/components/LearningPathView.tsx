import React, { useState, useEffect } from 'react';
import { LEARNING_STAGES } from '../data/learningPath';
import { CheckCircle2, Clock, ShieldCheck, ChevronRight, CheckSquare, Square } from 'lucide-react';

interface LearningPathViewProps {
  onSelectCommand: (cmdName: string) => void;
}

export const LearningPathView: React.FC<LearningPathViewProps> = ({ onSelectCommand }) => {
  // Store completed milestones in localStorage
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('kali_completed_milestones');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kali_completed_milestones', JSON.stringify(completedMilestones));
    } catch {
      // ignore
    }
  }, [completedMilestones]);

  const toggleMilestone = (milestoneKey: string) => {
    setCompletedMilestones((prev) => ({
      ...prev,
      [milestoneKey]: !prev[milestoneKey],
    }));
  };

  const totalMilestones = LEARNING_STAGES.reduce((acc, s) => acc + s.actionMilestones.length, 0);
  const completedCount = Object.values(completedMilestones).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalMilestones) * 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Roadmap Intro & Overall Progress Tracker */}
      <div className="p-6 rounded-xl border border-[#00C8FF]/15 bg-[rgba(10,15,25,0.85)] backdrop-blur-[12px] shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#00C8FF]" />
              Kali Linux Learning Roadmap: Beginner to Pro
            </h2>
            <p className="text-xs sm:text-sm text-[#7C8DA0] mt-1">
              A curated step-by-step master plan designed to take you from total terminal beginner to skilled penetration tester.
            </p>
          </div>
          <div className="p-3.5 bg-[#05080F] rounded-lg border border-slate-800 text-right shrink-0">
            <div className="text-2xl font-mono font-bold text-[#00C8FF]">
              {progressPercent}%
            </div>
            <div className="text-[11px] text-[#7C8DA0] uppercase tracking-wider">
              {completedCount} of {totalMilestones} Milestones
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-2 bg-[#05080F] rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-[#00C8FF] to-[#2F6BFF] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Stage Cards */}
      <div className="space-y-4">
        {LEARNING_STAGES.map((stage) => {
          const stageCompletedMilestones = stage.actionMilestones.filter(
            (m, idx) => completedMilestones[`${stage.stage}-${idx}`]
          ).length;

          return (
            <div
              key={stage.stage}
              className="rounded-xl border border-[#00C8FF]/15 bg-[rgba(10,15,25,0.85)] backdrop-blur-[12px] p-5 sm:p-6 space-y-4 shadow-md relative overflow-hidden"
            >
              {/* Stage Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#00C8FF]/10 border border-[#00C8FF]/30 text-[#00C8FF] font-mono font-bold flex items-center justify-center text-sm">
                    0{stage.stage}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Stage {stage.stage}: {stage.title}
                    </h3>
                    <p className="text-xs text-[#00C8FF] font-mono">
                      {stage.tagline}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#7C8DA0] font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {stage.estimatedDuration}
                  </span>
                  <span className="font-mono text-[#00C8FF]">
                    {stageCompletedMilestones}/{stage.actionMilestones.length} done
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#C9D6E2] leading-relaxed">
                {stage.description}
              </p>

              {/* Core Commands Chips */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Core Commands to Master:
                </span>
                <div className="flex flex-wrap gap-2">
                  {stage.coreCommands.map((cmd) => (
                    <button
                      key={cmd}
                      onClick={() => onSelectCommand(cmd)}
                      className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700/80 hover:border-emerald-500 text-emerald-300 font-mono text-xs flex items-center gap-1 transition-colors"
                      title={`View ${cmd} command details`}
                    >
                      {cmd}
                      <ChevronRight className="w-3 h-3 text-slate-500" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Milestones Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Action Checklist:
                </span>
                <div className="space-y-1.5">
                  {stage.actionMilestones.map((milestone, idx) => {
                    const key = `${stage.stage}-${idx}`;
                    const isDone = !!completedMilestones[key];

                    return (
                      <button
                        key={idx}
                        onClick={() => toggleMilestone(key)}
                        className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm flex items-start gap-3 transition-colors ${
                          isDone
                            ? 'bg-emerald-950/20 border-emerald-900/60 text-slate-300 line-through opacity-80'
                            : 'bg-slate-900/50 border-slate-800 text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        {isDone ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                        )}
                        <span className="leading-relaxed">{milestone}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Security Guideline */}
              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200">Practice Safety: </strong>
                  {stage.securityNote}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
