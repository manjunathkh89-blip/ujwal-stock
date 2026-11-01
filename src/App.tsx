import { useState, useMemo, useEffect } from 'react';
import { COMMANDS } from './data/commands';
import { CATEGORIES } from './data/categories';
import { CommandLevel, CommandItem } from './types';
import { Header, ActiveTab } from './components/Header';
import { EthicalDisclaimerModal, EthicalBanner } from './components/EthicalDisclaimer';
import { SearchBarAndFilters } from './components/SearchBarAndFilters';
import { CommandCard } from './components/CommandCard';
import { CategorySidebar } from './components/CategorySidebar';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { TerminalSimulator } from './components/TerminalSimulator';
import { LearningPathView } from './components/LearningPathView';
import { QuizView } from './components/QuizView';
import { GlossaryView } from './components/GlossaryView';
import { LabSetupView } from './components/LabSetupView';
import { AiCodingAdvisor } from './components/AiCodingAdvisor';
import { KaliDragonIntro } from './components/KaliDragonIntro';
import { QuickAiAssistant } from './components/QuickAiAssistant';
import { CommandPractice } from './components/CommandPractice';
import { Terminal, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('commands');
  const [practiceScenarioId, setPracticeScenarioId] = useState<string | undefined>(undefined);
  const [isEthicalModalOpen, setIsEthicalModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [activeTerminalCommand, setActiveTerminalCommand] = useState<string>('');

  // 3D Dragon Intro state (runs once per session by default, replayable on demand)
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('kali_intro_played') !== 'true';
    } catch {
      return true;
    }
  });

  // AI Advisor state
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string>('');
  const [aiInitialCommandName, setAiInitialCommandName] = useState<string>('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<CommandLevel | 'all'>('all');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Bookmarks stored in localStorage
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kali_command_bookmarks');
      return saved ? JSON.parse(saved) : ['nmap', 'hashcat', 'linpeas'];
    } catch {
      return ['nmap', 'hashcat', 'linpeas'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kali_command_bookmarks', JSON.stringify(bookmarks));
    } catch {
      // ignore
    }
  }, [bookmarks]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setShowBookmarksOnly(false);
  };

  const handleRunInTerminal = (cmd: string) => {
    setIsTerminalOpen(true);
    setActiveTerminalCommand(cmd);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskAiAboutCommand = (cmdName: string, promptText: string) => {
    setAiInitialCommandName(cmdName);
    setAiInitialPrompt(promptText);
    setActiveTab('ai-advisor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenFullAi = (initialPrompt?: string) => {
    if (initialPrompt) {
      setAiInitialPrompt(initialPrompt);
    }
    setActiveTab('ai-advisor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCommandFromRoadmap = (cmdName: string) => {
    setActiveTab('commands');
    setSearchQuery(cmdName);
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleLaunchPractice = (scenarioId?: string) => {
    if (scenarioId) {
      setPracticeScenarioId(scenarioId);
    }
    setActiveTab('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCommandFromPalette = (command: CommandItem) => {
    setActiveTab('commands');
    setSelectedCategory(command.categoryId);
    setSearchQuery(command.name);
  };

  // Filtered Commands calculation
  const filteredCommands = useMemo(() => {
    return COMMANDS.filter((cmd) => {
      // Category filter
      if (selectedCategory !== 'all' && cmd.categoryId !== selectedCategory) {
        return false;
      }

      // Level filter
      if (selectedLevel !== 'all' && cmd.level !== selectedLevel) {
        return false;
      }

      // Bookmarks filter
      if (showBookmarksOnly && !bookmarks.includes(cmd.id)) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const inName = cmd.name.toLowerCase().includes(q);
        const inSyntax = cmd.syntax.toLowerCase().includes(q);
        const inEli10 = cmd.eli10 ? cmd.eli10.toLowerCase().includes(q) : false;
        const inSummary = cmd.summary ? cmd.summary.toLowerCase().includes(q) : false;
        const inHowItWorks = cmd.howItWorks ? cmd.howItWorks.toLowerCase().includes(q) : false;
        const inPurpose = cmd.purpose ? cmd.purpose.toLowerCase().includes(q) : false;
        const inWhatNotToDo = cmd.whatNotToDo ? cmd.whatNotToDo.some((w) => w.toLowerCase().includes(q)) : false;
        const inAdvantages = cmd.advantages ? cmd.advantages.some((a) => a.toLowerCase().includes(q)) : false;
        const inDisadvantages = cmd.disadvantages ? cmd.disadvantages.some((d) => d.toLowerCase().includes(q)) : false;
        const inAdvCommand = cmd.advancedExample?.command ? cmd.advancedExample.command.toLowerCase().includes(q) : false;
        const inAdvExpl = cmd.advancedExample?.explanation ? cmd.advancedExample.explanation.toLowerCase().includes(q) : false;
        const inTags = cmd.tags.some((t) => t.toLowerCase().includes(q));
        const inFlags = cmd.flags.some(
          (f) =>
            f.flag.toLowerCase().includes(q) ||
            f.description.toLowerCase().includes(q)
        );
        const inProTip = cmd.proTip ? cmd.proTip.toLowerCase().includes(q) : false;

        if (
          !inName &&
          !inSyntax &&
          !inEli10 &&
          !inSummary &&
          !inHowItWorks &&
          !inPurpose &&
          !inWhatNotToDo &&
          !inAdvantages &&
          !inDisadvantages &&
          !inAdvCommand &&
          !inAdvExpl &&
          !inTags &&
          !inFlags &&
          !inProTip
        ) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, selectedLevel, showBookmarksOnly, searchQuery, bookmarks]);

  // Helper map for Category ID to Category object
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    CATEGORIES.forEach((c) => map.set(c.id, c.name));
    return map;
  }, []);

  const activeCategoryTitle = useMemo(() => {
    if (selectedCategory === 'all') return 'All Commands';
    const cat = CATEGORIES.find((c) => c.id === selectedCategory);
    return cat ? cat.name : 'All Commands';
  }, [selectedCategory]);

  return (
    <div className="min-h-screen text-[#C9D6E2] flex flex-col font-sans selection:bg-[#00C8FF]/20 selection:text-[#00C8FF] relative overflow-x-hidden bg-[#05080F]">
      {/* Full-Screen Kali Dragon Wallpaper Background (fixed attachment, center-top positioned) */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: "url('/assets/aistudio/0dc847b7195625d2c6dbb3e0cec2351e_1e04ac6e.jpg')",
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center 15%',
          backgroundSize: 'cover',
        }}
      />

      {/* Dark overlay: 80% opacity with subtle gradient and blur so dragon whispers behind content */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#05080F]/90 via-[#05080F]/80 to-[#05080F]/95 backdrop-blur-[2px] pointer-events-none" />

      {/* Full-Screen Kali Cyber-Dragon Intro Animation */}
      {showIntro && (
        <KaliDragonIntro
          onComplete={() => setShowIntro(false)}
        />
      )}

      {/* Top Ethical Disclaimer Banner */}
      <EthicalBanner onOpenModal={() => setIsEthicalModalOpen(true)} />

      {/* Slim Sticky Top Bar */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenEthicalModal={() => setIsEthicalModalOpen(true)}
        favoritesCount={bookmarks.length}
        onShowFavorites={() => {
          setActiveTab('commands');
          setShowBookmarksOnly(true);
        }}
        showBookmarksOnly={showBookmarksOnly}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onReplayIntro={() => setShowIntro(true)}
      />

      {/* Global Command Palette Modal (Ctrl+K) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectCommand={handleSelectCommandFromPalette}
        onOpenAiWithPrompt={handleAskAiAboutCommand}
      />

      {/* Main Content Area: Centered, max 1320px for professional SaaS density */}
      <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6 relative z-10">
        {/* Commands Tab: Left Sidebar + Right Grid Layout */}
        {activeTab === 'commands' && (
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Left Sidebar for Categories (Desktop) */}
            <CategorySidebar
              selectedCategory={selectedCategory}
              onSelectCategory={(id) => {
                setSelectedCategory(id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hidden md:block sticky top-20"
            />

            {/* Right Main Content Column */}
            <div className="flex-1 min-w-0 space-y-4 w-full">
              {/* Interactive DracoAI Assistant for asking questions and generating code */}
              <QuickAiAssistant
                onRunInTerminal={handleRunInTerminal}
                onOpenFullAi={handleOpenFullAi}
              />

              {/* Interactive Terminal Sandbox (Collapsible) */}
              {isTerminalOpen && (
                <div className="space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between text-xs text-[#7C8DA0] px-1 font-mono">
                    <span className="flex items-center gap-1.5 text-[#22C55E] font-semibold">
                      <Terminal className="w-4 h-4" />
                      Kali Web Terminal Sandbox
                    </span>
                    <button
                      onClick={() => setIsTerminalOpen(false)}
                      className="text-[#7C8DA0] hover:text-white transition-colors"
                    >
                      Hide Sandbox
                    </button>
                  </div>
                  <TerminalSimulator initialCommand={activeTerminalCommand} />
                </div>
              )}

              {/* Toolbar & Filters */}
              <SearchBarAndFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedLevel={selectedLevel}
                onSelectLevel={setSelectedLevel}
                showBookmarksOnly={showBookmarksOnly}
                onToggleBookmarksOnly={() => setShowBookmarksOnly(!showBookmarksOnly)}
                bookmarksCount={bookmarks.length}
                totalFilteredCount={filteredCommands.length}
                totalCommandsCount={COMMANDS.length}
                onResetFilters={handleResetFilters}
                onToggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)}
                isTerminalOpen={isTerminalOpen}
                activeCategoryName={activeCategoryTitle}
              />

              {/* Commands Grid */}
              {filteredCommands.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 pt-1">
                  {filteredCommands.map((command) => (
                    <CommandCard
                      key={command.id}
                      command={command}
                      categoryName={categoryMap.get(command.categoryId) || 'General'}
                      isBookmarked={bookmarks.includes(command.id)}
                      onToggleBookmark={toggleBookmark}
                      onRunInTerminal={handleRunInTerminal}
                      onAskAiAboutCommand={handleAskAiAboutCommand}
                      onPracticeScenario={handleLaunchPractice}
                    />
                  ))}
                </div>
              ) : (
                /* Empty state */
                <div className="p-12 text-center rounded-xl border border-slate-800 bg-[rgba(10,15,25,0.85)] backdrop-blur-[12px] space-y-4 shadow-lg">
                  <AlertCircle className="w-10 h-10 text-[#7C8DA0] mx-auto" />
                  <div>
                    <h3 className="text-base font-semibold text-white">No matching commands found</h3>
                    <p className="text-xs text-[#7C8DA0] mt-1 max-w-md mx-auto">
                      Try adjusting your search keywords, switching categories, or clearing level filters.
                    </p>
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className="h-9 px-4 bg-[#00C8FF] hover:bg-[#00C8FF]/90 text-[#05080F] font-semibold rounded-lg text-xs transition-all duration-200"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tactical Command Practice Lab View */}
        {activeTab === 'practice' && (
          <CommandPractice
            initialScenarioId={practiceScenarioId}
            onAskAiHint={(prompt) => {
              setAiInitialPrompt(prompt);
              setActiveTab('ai-advisor');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCodexCommand={(cmdName) => {
              setActiveTab('commands');
              setSearchQuery(cmdName);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Learning Path Roadmap View */}
        {activeTab === 'learning-path' && (
          <LearningPathView onSelectCommand={handleSelectCommandFromRoadmap} />
        )}

        {/* Quiz Mode View */}
        {activeTab === 'quiz' && (
          <QuizView
            onSelectCategoryForCommands={(catId) => {
              setActiveTab('commands');
              setSelectedCategory(catId);
            }}
          />
        )}

        {/* Glossary View */}
        {activeTab === 'glossary' && <GlossaryView />}

        {/* Lab Setup View */}
        {activeTab === 'lab-setup' && <LabSetupView />}

        {/* AI Coding Advisor View */}
        {activeTab === 'ai-advisor' && (
          <AiCodingAdvisor
            initialPrompt={aiInitialPrompt}
            initialCommandName={aiInitialCommandName}
            onRunInTerminal={handleRunInTerminal}
          />
        )}
      </main>

      {/* Small, clean, centered Footer */}
      <footer className="border-t border-[#00C8FF]/15 bg-[#05080F]/95 py-6 px-4 sm:px-6 mt-16 text-xs text-[#7C8DA0] font-sans relative z-10">
        <div className="max-w-[1320px] mx-auto text-center space-y-2">
          <p className="text-sm font-semibold text-white">
            Delivered by <span className="text-[#00C8FF]">Manjunath KH</span>
          </p>
          <p className="text-[11px] text-[#7C8DA0]">
            © {new Date().getFullYear()} DracoSec: Kali Linux Command Codex · For authorized ethical security education and defense research only.
          </p>
        </div>
      </footer>

      {/* Ethical Disclaimer Modal */}
      <EthicalDisclaimerModal
        isOpen={isEthicalModalOpen}
        onClose={() => setIsEthicalModalOpen(false)}
      />
    </div>
  );
}
