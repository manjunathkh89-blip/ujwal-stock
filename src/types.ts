export type CommandLevel = 'beginner' | 'intermediate' | 'advanced';

export interface CommandFlag {
  flag: string;
  syntax?: string;
  description: string;
}

export interface AdvancedExample {
  command: string;
  explanation: string;
  output?: string;
}

export interface CommandItem {
  id: string;
  name: string;
  syntax: string;
  categoryId: string;
  level: CommandLevel;
  // 1. How it works (simple explanation, like teaching a beginner / ELI10)
  howItWorks: string;
  // 2. Purpose / where it is used
  purpose: string;
  // 3. Real example with sample output
  example: string;
  sampleOutput: string;
  // 4. Important options/flags (table)
  flags: CommandFlag[];
  // 5. Advantages
  advantages: string[];
  // 6. Disadvantages / limits
  disadvantages: string[];
  // 7. What NOT to do (warnings and mistakes)
  whatNotToDo: string[];
  // 8. An advanced usage example
  advancedExample: AdvancedExample;
  // 9. Security Pro Tip
  proTip?: string;
  warning?: string;
  tags: string[];
  // Backwards compatibility aliases
  eli10?: string;
  summary?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  shortName: string;
  description: string;
  iconName: string;
  accentColor: string;
}

export interface QuizQuestion {
  id: string;
  categoryId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GlossaryTerm {
  term: string;
  category: string;
  definition: string;
  practicalExample: string;
}

export interface LearningStage {
  stage: number;
  title: string;
  tagline: string;
  level: CommandLevel;
  estimatedDuration: string;
  description: string;
  coreCommands: string[];
  actionMilestones: string[];
  securityNote: string;
}

export interface LabTarget {
  name: string;
  type: 'local-vm' | 'web-lab' | 'online-platform';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  url?: string;
  description: string;
  setupInstructions: string[];
  keyLearning: string;
}

export type ScenarioTrack = 'recon' | 'system' | 'web' | 'privesc' | 'network';

export interface PracticeScenario {
  id: string;
  title: string;
  track: ScenarioTrack;
  difficulty: CommandLevel;
  badge: string;
  briefing: string;
  targetEnv: string;
  objective: string;
  simulatedPath: string;
  // Commands that fulfill the scenario objective
  acceptedCommands: {
    pattern: string; // Regex string or prefix
    isRegex?: boolean;
    flagsRequired?: string[];
  }[];
  // Common missteps to give helpful instant feedback
  commonMistakes?: {
    pattern: string;
    feedback: string;
  }[];
  simulatedOutput: string;
  hints: string[]; // 3 progressive hints
  solutionCommand: string;
  solutionExplanation: string;
  mitreTechnique?: string;
  xp: number;
}
