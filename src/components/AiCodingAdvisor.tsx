import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Copy,
  Check,
  Terminal,
  ShieldAlert,
  Loader2,
  Code2,
  RotateCcw,
  HelpCircle,
  Cpu,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Layers,
  Wrench,
  Bot,
  User,
  Trash2,
  Download,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode?: 'question' | 'code' | 'general';
  timestamp: string;
  source?: string;
}

interface AiCodingAdvisorProps {
  initialPrompt?: string;
  initialCommandName?: string;
  onRunInTerminal?: (cmd: string) => void;
  isCompactModal?: boolean;
}

export const AiCodingAdvisor: React.FC<AiCodingAdvisorProps> = ({
  initialPrompt = '',
  initialCommandName = '',
  onRunInTerminal,
  isCompactModal = false,
}) => {
  const [activeMode, setActiveMode] = useState<'question' | 'code'>('question');
  const [prompt, setPrompt] = useState(initialPrompt);
  const [commandName, setCommandName] = useState(initialCommandName);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-1',
      role: 'assistant',
      content: `### Welcome to DracoAI: Cyber Intelligence & Coding Engine
I am your dedicated **DracoSec AI** technical advisor, trained on offensive security workflows, Kali Linux command internals, and secure automation scripting.

**How can I assist your mission today?**
- ❓ **Ask Any Question**: Ask about networking protocols, attack vectors, Kali troubleshooting, or command flags.
- ⚡ **Request Custom Code**: Ask for production-grade Bash, Python 3, Go, or PowerShell security scripts with robust error handling.

Select a quick topic below or type your question or code request into the prompt bar.`,
      mode: 'general',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'dracosec-ai-core',
    },
  ]);

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
      if (initialCommandName) {
        setCommandName(initialCommandName);
      }
    }
  }, [initialPrompt, initialCommandName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const presetQuestions = [
    {
      title: 'SYN vs TCP Connect Scan',
      prompt: 'Explain the difference between Nmap SYN Stealth Scan (-sS) and Full TCP Connect Scan (-sT). How does the 3-way handshake behave in both?',
      category: 'Networking',
    },
    {
      title: 'How SQL Injection Works',
      prompt: 'Explain how SQL Injection works in authentication forms with a vulnerable code example and how prepared statements prevent it.',
      category: 'Web Security',
    },
    {
      title: 'Wi-Fi Adapter Monitor Mode Fix',
      prompt: 'My USB wireless adapter is not entering monitor mode or dropping packets in Kali Linux. Give me step-by-step commands to troubleshoot.',
      category: 'Wireless',
    },
    {
      title: 'Linux Privilege Escalation',
      prompt: 'What are the most common Linux local privilege escalation vectors (SUID, sudo misconfigurations, cron jobs, kernel exploits)?',
      category: 'Exploitation',
    },
  ];

  const presetCodeScripts = [
    {
      title: 'Python Multi-Thread Port Scanner',
      prompt: 'Write a robust, multi-threaded Python 3 TCP socket scanner with timeout handling, banner grabbing, and thread pool executor.',
      cmd: 'python3',
      category: 'Python',
    },
    {
      title: 'Bash Subnet Ping Sweep',
      prompt: 'Write an optimized Bash script to ping sweep a /24 subnet in parallel, throttle background forks, and write live hosts to a file.',
      cmd: 'bash',
      category: 'Bash',
    },
    {
      title: 'Automated Nmap Service Scanner',
      prompt: 'Write a Python script that reads targets from a file, executes Nmap service detection scans (-sV -sC), and parses results into JSON.',
      cmd: 'nmap',
      category: 'Python',
    },
    {
      title: 'Brute-Force Log Watchdog',
      prompt: 'Write a Bash automation script to monitor /var/log/auth.log for repeated failed SSH login attempts and automatically block abusive IPs.',
      cmd: 'iptables',
      category: 'SecOps',
    },
  ];

  const handleSendMessage = async (textToSend?: string, forcedMode?: 'question' | 'code') => {
    const text = (textToSend || prompt).trim();
    if (!text || isLoading) return;

    const currentMode = forcedMode || activeMode;
    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
      mode: currentMode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Send conversation history (last 5 messages) for contextual multi-turn dialogue
      const historyPayload = messages.slice(-5).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          commandName: commandName || undefined,
          mode: currentMode,
          history: historyPayload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to receive AI response.');
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.advice,
        mode: currentMode,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'dracosec-ai',
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with DracoAI intelligence service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCodeBlock = (codeText: string, blockKey: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(blockKey);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleDownloadCode = (codeText: string, lang: string) => {
    const ext =
      lang === 'python' || lang === 'py'
        ? 'py'
        : lang === 'bash' || lang === 'sh'
        ? 'sh'
        : lang === 'go' || lang === 'golang'
        ? 'go'
        : lang === 'c'
        ? 'c'
        : 'txt';
    const blob = new Blob([codeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dracosec_script.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'init-cleared',
        role: 'assistant',
        content: `### Session History Cleared
DracoAI memory reset. What cybersecurity question or coding task would you like to explore next?`,
        mode: 'general',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'dracosec-ai-core',
      },
    ]);
  };

  // Formatter for markdown responses
  const renderFormattedContent = (text: string, msgId: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const lang = lines[0].trim() || 'code';
        const code = lines.slice(1).join('\n');
        const blockKey = `${msgId}-block-${index}`;

        return (
          <div
            key={index}
            className="my-3 rounded-xl border border-cyan-500/30 bg-[#010410] overflow-hidden font-mono text-xs shadow-lg"
          >
            <div className="flex items-center justify-between px-3.5 py-2 bg-slate-950 border-b border-cyan-950/80 text-slate-300">
              <div className="flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px] font-semibold text-cyan-300 uppercase tracking-wider font-mono">
                  {lang}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {onRunInTerminal && (lang === 'bash' || lang === 'sh') && (
                  <button
                    onClick={() => onRunInTerminal(code.split('\n')[0]?.startsWith('#!') ? code.split('\n')[1] || code : code)}
                    className="px-2 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 hover:text-white flex items-center gap-1 text-[11px] transition-colors border border-cyan-800/60 font-sans"
                    title="Send snippet to terminal sandbox"
                  >
                    <Terminal className="w-3 h-3 text-cyan-400" />
                    <span>Run in Sandbox</span>
                  </button>
                )}
                <button
                  onClick={() => handleDownloadCode(code, lang)}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 flex items-center gap-1 text-[11px] transition-colors border border-slate-800 font-sans"
                  title="Download script"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => handleCopyCodeBlock(code, blockKey)}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-1 text-[11px] transition-colors border border-slate-800"
                >
                  {copiedCodeId === blockKey ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <pre className="p-4 text-cyan-100 overflow-x-auto whitespace-pre leading-relaxed font-mono text-xs selection:bg-cyan-500/40">
              {code}
            </pre>
          </div>
        );
      }

      // Plain text paragraphs & headers
      return (
        <div key={index} className="space-y-2 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {part.split('\n\n').map((paragraph, pIdx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h4
                  key={pIdx}
                  className="text-base sm:text-lg font-bold text-white pt-2 text-cyan-300 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                  {paragraph.replace('### ', '')}
                </h4>
              );
            }
            if (paragraph.startsWith('#### ')) {
              return (
                <h5 key={pIdx} className="text-sm font-semibold text-slate-100 pt-1 text-cyan-200">
                  {paragraph.replace('#### ', '')}
                </h5>
              );
            }
            if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
              return (
                <ul key={pIdx} className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                  {paragraph.split('\n').map((item, itemIdx) => (
                    <li key={itemIdx}>{item.replace(/^(\*|-)\s+/, '')}</li>
                  ))}
                </ul>
              );
            }
            if (/^\d+\.\s/.test(paragraph)) {
              return (
                <ol key={pIdx} className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
                  {paragraph.split('\n').map((item, itemIdx) => (
                    <li key={itemIdx}>{item.replace(/^\d+\.\s+/, '')}</li>
                  ))}
                </ol>
              );
            }
            return <p key={pIdx} className="text-slate-300">{paragraph}</p>;
          })}
        </div>
      );
    });
  };

  return (
    <div className={`space-y-6 ${isCompactModal ? 'max-w-full' : 'max-w-5xl mx-auto'}`}>
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-xl border border-[#00C8FF]/15 bg-[rgba(10,15,25,0.85)] backdrop-blur-[12px] shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-[#00C8FF] bg-[#00C8FF]/10 border border-[#00C8FF]/20 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-[#00C8FF]" />
                DracoAI Intelligence Engine
              </span>
              <span className="text-xs text-[#7C8DA0]">
                · Model: gemini-3.8-flash
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              DracoAI: <span className="text-[#00C8FF]">Cyber Advisor &amp; Coding Engine</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#C9D6E2] max-w-2xl">
              Ask any cybersecurity or Kali Linux question, or request production-ready automation scripts in Python, Bash, or Go.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={handleClearHistory}
              className="h-8 px-3 rounded-lg border border-slate-800 bg-[#05080F] hover:bg-[#162035] text-[#7C8DA0] hover:text-white text-xs flex items-center gap-1.5 transition-colors font-mono"
              title="Clear chat history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Session</span>
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 pt-4 border-t border-[#00C8FF]/10 mt-4">
          <button
            onClick={() => setActiveMode('question')}
            className={`h-9 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeMode === 'question'
                ? 'bg-[#00C8FF] text-[#05080F] shadow-[0_0_12px_rgba(0,200,255,0.3)]'
                : 'bg-[#05080F] text-[#7C8DA0] hover:text-white border border-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Ask Cyber Questions</span>
          </button>
          <button
            onClick={() => setActiveMode('code')}
            className={`h-9 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeMode === 'code'
                ? 'bg-[#00C8FF] text-[#05080F] shadow-[0_0_12px_rgba(0,200,255,0.3)]'
                : 'bg-[#05080F] text-[#7C8DA0] hover:text-white border border-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Generate Security Code &amp; Scripts</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Chips */}
      <div className="space-y-2">
        <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Recommended {activeMode === 'question' ? 'Questions' : 'Security Scripts'}:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {(activeMode === 'question' ? presetQuestions : presetCodeScripts).map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(preset.prompt, activeMode)}
              className="p-3 rounded-xl border border-cyan-500/20 bg-[#020719]/60 hover:bg-[#040e2b]/80 hover:border-cyan-400/60 transition-all text-left group flex items-start justify-between gap-2 shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800/60 text-cyan-300">
                    {preset.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {preset.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {preset.prompt}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Conversation Feed */}
      <div className="rounded-xl border border-[#00C8FF]/15 bg-[rgba(10,15,25,0.85)] backdrop-blur-[12px] shadow-lg p-4 sm:p-5 space-y-4 max-h-[550px] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 sm:gap-4 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-[#0B1220] border border-[#00C8FF]/30 text-[#00C8FF] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-[#00C8FF]" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-xl p-4 space-y-2 ${
                msg.role === 'user'
                  ? 'bg-[#162035] text-white border border-[#00C8FF]/30'
                  : 'bg-[#05080F] border border-[#00C8FF]/15 text-[#C9D6E2]'
              }`}
            >
              <div className="flex items-center justify-between gap-3 text-[10px] font-mono pb-1 border-b border-white/10">
                <span className={msg.role === 'user' ? 'text-[#00C8FF] font-semibold' : 'text-[#00C8FF] font-semibold'}>
                  {msg.role === 'user' ? 'YOU (Security Engineer)' : 'DracoAI (Cyber Intelligence)'}
                </span>
                <span className="text-[#7C8DA0]">
                  {msg.timestamp}
                </span>
              </div>

              {msg.role === 'user' ? (
                <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              ) : (
                <div className="space-y-3">{renderFormattedContent(msg.content, msg.id)}</div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-[#162035] border border-slate-700 text-[#00C8FF] flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-[#00C8FF]" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2.5 text-[#00C8FF] text-xs font-mono p-3 rounded-lg bg-[#05080F] border border-[#00C8FF]/20 max-w-sm">
            <Loader2 className="w-4 h-4 animate-spin text-[#00C8FF]" />
            <span>DracoAI is synthesizing security intelligence...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer */}
      <div className="p-4 sm:p-5 rounded-xl border border-[#00C8FF]/15 bg-[rgba(10,15,25,0.85)] backdrop-blur-[12px] shadow-lg space-y-3">
        {commandName && (
          <div className="flex items-center justify-between text-xs font-mono px-3 py-1.5 rounded-lg bg-[#05080F] border border-[#00C8FF]/20 text-[#00C8FF]">
            <span>
              Target Tool Context: <strong className="text-white">{commandName}</strong>
            </span>
            <button
              onClick={() => setCommandName('')}
              className="text-[#7C8DA0] hover:text-white text-[11px]"
            >
              Clear tool context
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              activeMode === 'question'
                ? "Ask anything (e.g. 'How does ARP spoofing work?', 'Explain Nmap -sS vs -sT')..."
                : "Describe the script (e.g. 'Write a Python port scanner with timeouts and threading')..."
            }
            className="flex-1 h-10 px-3.5 bg-[#05080F] border border-slate-800 focus:border-[#00C8FF] rounded-lg text-[#C9D6E2] placeholder-[#7C8DA0] text-xs sm:text-sm focus:outline-none transition-colors font-sans"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !prompt.trim()}
            className="h-10 px-5 bg-[#00C8FF] hover:bg-[#00C8FF]/90 disabled:opacity-40 text-[#05080F] font-semibold rounded-lg text-xs transition-all duration-200 flex items-center justify-center gap-2 shrink-0 font-sans shadow-[0_0_12px_rgba(0,200,255,0.25)]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{activeMode === 'question' ? 'Ask Question' : 'Generate Code'}</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/40 text-xs text-[#EF4444] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#EF4444] shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-[#7C8DA0] font-mono pt-1">
          <span>Ethical use notice: Generate scripts strictly for authorized security assessments.</span>
          <span className="hidden sm:inline">Delivered by Manjunath KH</span>
        </div>
      </div>
    </div>
  );
};
