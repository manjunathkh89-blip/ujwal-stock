import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  Code2,
  Send,
  Loader2,
  Copy,
  Check,
  Terminal,
  ChevronDown,
  ChevronUp,
  X,
  ExternalLink,
  Download,
  Bot,
  Zap,
} from 'lucide-react';

interface QuickAiAssistantProps {
  onRunInTerminal?: (cmd: string) => void;
  onOpenFullAi: (initialPrompt?: string, mode?: 'question' | 'code') => void;
}

export const QuickAiAssistant: React.FC<QuickAiAssistantProps> = ({
  onRunInTerminal,
  onOpenFullAi,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [mode, setMode] = useState<'code' | 'question'>('code');
  const [language, setLanguage] = useState<string>('python');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const directCodeTemplates = [
    {
      title: 'Port Scanner',
      lang: 'python',
      prompt: 'Write a Python multi-threaded port scanner with timeout and banner grabbing.',
    },
    {
      title: 'Subnet Ping Sweep',
      lang: 'bash',
      prompt: 'Write a Bash parallel ping sweep script to discover active hosts in a /24 subnet.',
    },
    {
      title: 'Directory Fuzzer',
      lang: 'python',
      prompt: 'Write a Python HTTP directory fuzzer with threading and status code checking.',
    },
    {
      title: 'Packet Sniffer',
      lang: 'python',
      prompt: 'Write a raw socket packet sniffer in Python to capture and parse IPv4 packets.',
    },
    {
      title: 'Hash Cracker',
      lang: 'python',
      prompt: 'Write a Python dictionary attack script to crack MD5 and SHA256 hashes.',
    },
    {
      title: 'SSH Log Blocker',
      lang: 'bash',
      prompt: 'Write a Bash script to parse /var/log/auth.log for failed SSH logins and ban malicious IPs with iptables.',
    },
  ];

  const questionTemplates = [
    'How does a TCP SYN scan bypass standard logging?',
    'Explain how ARP poisoning works on a local switch.',
    'What is the difference between hydra and john the ripper?',
    'What are SUID binaries and how do they lead to root privilege escalation?',
  ];

  const handleSend = async (userPrompt?: string, targetLang?: string) => {
    const textToSend = userPrompt || prompt;
    if (!textToSend.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);
    setResponse(null);

    const activeLanguage = targetLang || language;
    const finalPrompt =
      mode === 'code'
        ? `[Language: ${activeLanguage}] Direct code requested: ${textToSend}`
        : textToSend;

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          mode: mode === 'code' ? 'direct-code' : 'question',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch AI response.');
      }

      setResponse(data.advice || 'No response generated.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with DracoAI intelligence service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDownloadCode = (code: string, lang: string) => {
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
    const filename = `dracosec_script.${ext}`;
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderContent = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const lang = lines[0].trim() || 'code';
        const code = lines.slice(1).join('\n');
        const blockId = `direct-code-${index}`;

        return (
          <div
            key={index}
            className="my-3 rounded-lg border border-[#00C8FF]/20 bg-[#05080F] overflow-hidden font-mono text-xs shadow-md"
          >
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#0B1220] border-b border-[#00C8FF]/10 text-[#7C8DA0]">
              <span className="text-[11px] font-mono text-[#00C8FF] font-semibold uppercase flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[#00C8FF]" />
                <span>{lang}</span>
              </span>
              <div className="flex items-center gap-2">
                {onRunInTerminal && (lang === 'bash' || lang === 'sh') && (
                  <button
                    onClick={() =>
                      onRunInTerminal(
                        code.split('\n')[0]?.startsWith('#!')
                          ? code.split('\n')[1] || code
                          : code
                      )
                    }
                    className="text-[11px] text-[#00C8FF] hover:underline flex items-center gap-1 font-sans transition-colors"
                  >
                    <Terminal className="w-3 h-3" />
                    <span>Run in Sandbox</span>
                  </button>
                )}
                <button
                  onClick={() => handleDownloadCode(code, lang)}
                  className="text-[11px] text-[#7C8DA0] hover:text-[#00C8FF] flex items-center gap-1 font-sans transition-colors"
                  title="Download script file"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => handleCopyCode(code, blockId)}
                  className="text-[11px] text-[#7C8DA0] hover:text-white flex items-center gap-1 font-sans transition-colors"
                >
                  {copiedCode === blockId ? (
                    <span className="text-[#22C55E] flex items-center gap-1">
                      <Check className="w-3 h-3" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="w-3 h-3" /> Copy Code
                    </span>
                  )}
                </button>
              </div>
            </div>
            <pre className="p-3 text-[#C9D6E2] overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {code}
            </pre>
          </div>
        );
      }

      return (
        <div key={index} className="text-xs sm:text-sm text-[#C9D6E2] whitespace-pre-wrap leading-relaxed my-1">
          {part}
        </div>
      );
    });
  };

  return (
    <div className="rounded-xl border border-[#00C8FF]/20 bg-[rgba(10,15,25,0.85)] backdrop-blur-[12px] shadow-lg overflow-hidden transition-all duration-200">
      {/* Header bar */}
      <div className="px-4 py-3 border-b border-[#00C8FF]/15 bg-[#0B1220]/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#00C8FF]/15 border border-[#00C8FF]/30 text-[#00C8FF] flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#00C8FF]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white tracking-tight">
                DracoAI: <span className="text-[#00C8FF]">Direct Coding Engine &amp; Q&amp;A</span>
              </h3>
              <span className="text-[10px] font-mono text-[#00C8FF] bg-[#00C8FF]/10 border border-[#00C8FF]/20 px-1.5 py-0.2 rounded">
                Instant Code
              </span>
            </div>
            <p className="text-[11px] text-[#7C8DA0]">
              Ask for any script (Python, Bash, Go, C) and receive immediate, complete, runnable code with zero fluff.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onOpenFullAi(prompt || undefined, mode)}
            className="text-xs text-[#00C8FF] hover:underline flex items-center gap-1 px-2 py-1 rounded-md hover:bg-[#00C8FF]/10 transition-colors"
            title="Open full interactive AI workspace"
          >
            <span className="hidden sm:inline">Full Workspace</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-[#7C8DA0] hover:text-white rounded-lg hover:bg-[#162035] transition-colors"
            title={isOpen ? 'Minimize assistant' : 'Expand assistant'}
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 space-y-3.5">
          {/* Mode Switcher & Language Selector */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1 p-1 bg-[#05080F] rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setMode('code')}
                className={`h-7 px-3 rounded-md font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  mode === 'code'
                    ? 'bg-[#162035] text-[#00C8FF] font-semibold border border-[#00C8FF]/30 shadow-sm'
                    : 'text-[#7C8DA0] hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Direct Code Generator</span>
              </button>
              <button
                onClick={() => setMode('question')}
                className={`h-7 px-3 rounded-md font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  mode === 'question'
                    ? 'bg-[#162035] text-[#00C8FF] font-semibold border border-[#00C8FF]/30 shadow-sm'
                    : 'text-[#7C8DA0] hover:text-white'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Ask Cyber Question</span>
              </button>
            </div>

            {/* Language Selector when in Code mode */}
            {mode === 'code' && (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-[11px] text-[#7C8DA0] font-mono mr-1">Language:</span>
                {(['python', 'bash', 'go', 'c'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`h-7 px-2.5 rounded-md font-mono text-[11px] uppercase transition-colors ${
                      language === lang
                        ? 'bg-[#00C8FF]/20 text-[#00C8FF] border border-[#00C8FF]/40 font-semibold'
                        : 'bg-[#05080F] text-[#7C8DA0] border border-slate-800 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Script / Question Templates */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs text-[#7C8DA0]">
            <span className="text-[11px] font-semibold text-[#00C8FF] shrink-0">Direct 1-Click:</span>
            {mode === 'code'
              ? directCodeTemplates.map((tmpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setLanguage(tmpl.lang);
                      setPrompt(tmpl.prompt);
                      handleSend(tmpl.prompt, tmpl.lang);
                    }}
                    className="whitespace-nowrap px-2.5 py-1 rounded-md bg-[#05080F] border border-slate-800 hover:border-[#00C8FF]/40 text-[#C9D6E2] hover:text-white text-[11px] transition-colors shrink-0 flex items-center gap-1.5"
                  >
                    <span className="text-[#00C8FF] font-mono text-[10px] uppercase font-bold">
                      {tmpl.lang}
                    </span>
                    <span>{tmpl.title}</span>
                  </button>
                ))
              : questionTemplates.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPrompt(q);
                      handleSend(q);
                    }}
                    className="whitespace-nowrap px-2.5 py-1 rounded-md bg-[#05080F] border border-slate-800 hover:border-[#00C8FF]/40 text-[#C9D6E2] hover:text-white text-[11px] transition-colors shrink-0"
                  >
                    {q}
                  </button>
                ))}
          </div>

          {/* Prompt Input Form */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={
                  mode === 'code'
                    ? `Describe any script (e.g., 'Write a ${language} script to check HTTP security headers and cookies')...`
                    : 'Ask any cybersecurity question (e.g., How does an ARP poisoning attack work?)...'
                }
                className="w-full h-10 px-3.5 bg-[#05080F] border border-slate-800 focus:border-[#00C8FF] rounded-lg text-xs sm:text-sm text-white placeholder-[#7C8DA0] focus:outline-none transition-colors font-sans"
              />
              {prompt && (
                <button
                  onClick={() => setPrompt('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7C8DA0] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => handleSend()}
              disabled={isLoading || !prompt.trim()}
              className="h-10 px-4 bg-[#00C8FF] hover:bg-[#00C8FF]/90 disabled:opacity-40 text-[#05080F] font-semibold rounded-lg text-xs transition-all duration-200 flex items-center gap-1.5 shrink-0 shadow-[0_0_12px_rgba(0,200,255,0.25)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">Generating...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{mode === 'code' ? 'Get Direct Code' : 'Ask AI'}</span>
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/40 text-xs text-[#EF4444]">
              {errorMsg}
            </div>
          )}

          {/* Response Container */}
          {response && (
            <div className="p-4 rounded-lg bg-[#05080F] border border-[#00C8FF]/20 space-y-2 animate-fade-in max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-semibold text-[#00C8FF] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>DracoAI Direct Solution:</span>
                </span>
                <button
                  onClick={() => onOpenFullAi(prompt, mode)}
                  className="text-[11px] text-[#7C8DA0] hover:text-white flex items-center gap-1"
                >
                  <span>Continue in full chat</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-2 pt-1">{renderContent(response)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
