import React, { useState } from 'react';
import { LAB_TARGETS, VIRTUALBOX_GUIDE } from '../data/labSetup';
import { Laptop, ShieldAlert, Check, Copy, ExternalLink, Terminal, AlertTriangle } from 'lucide-react';

export const LabSetupView: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-xl border border-[#00C8FF]/15 bg-[rgba(10,15,25,0.85)] backdrop-blur-[12px] shadow-md space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Laptop className="w-6 h-6 text-[#00C8FF]" />
          Penetration Testing Lab Setup Guide
        </h2>
        <p className="text-xs sm:text-sm text-[#C9D6E2] leading-relaxed">
          How to safely build a local, isolated ethical hacking sandbox on VirtualBox and access premier practice targets (Metasploitable, DVWA, TryHackMe, and Hack The Box) without risking your home or school network.
        </p>

        <div className="p-3.5 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg text-xs text-[#C9D6E2] flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#EF4444]">Isolation Golden Rule: </strong>
            Never configure intentionally vulnerable machines (like Metasploitable or DVWA) in &ldquo;Bridged Mode&rdquo; on shared Wi-Fi networks (hotels, airports, dorms). Any attacker on the same Wi-Fi could exploit and compromise your machine! Always use <strong className="text-white">Host-Only Adapter</strong> or <strong className="text-white">NAT Network</strong>.
          </div>
        </div>
      </div>

      {/* Step-by-Step VirtualBox Guide */}
      <div className="rounded-xl border border-[#00C8FF]/15 bg-[rgba(10,15,25,0.85)] backdrop-blur-[12px] p-5 sm:p-6 space-y-5 shadow-md">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-[#00C8FF]/15 text-[#00C8FF] border border-[#00C8FF]/30 font-mono text-xs flex items-center justify-center font-bold">
              VB
            </span>
            {VIRTUALBOX_GUIDE.title}
          </h3>
        </div>

        <div className="space-y-3">
          {VIRTUALBOX_GUIDE.steps.map((st) => (
            <div key={st.step} className="flex items-start gap-3.5 p-3.5 rounded-lg bg-[#05080F] border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-[#00C8FF]/10 text-[#00C8FF] border border-[#00C8FF]/30 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {st.step}
              </span>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-white">{st.title}</h4>
                <p className="text-xs text-[#C9D6E2] leading-relaxed">{st.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Docker DVWA script */}
        <div className="p-4 rounded-xl bg-black/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Terminal className="w-3.5 h-3.5" />
              1-Minute DVWA Docker Lab Setup (Run inside Kali terminal)
            </span>
            <button
              onClick={() =>
                copyToClipboard(
                  'sudo apt update && sudo apt install -y docker.io\nsudo systemctl start docker\nsudo docker run --rm -it -p 8080:80 vulnerables/web-dvwa',
                  'dvwa-docker'
                )
              }
              className="text-slate-400 hover:text-emerald-300 p-1 flex items-center gap-1"
            >
              {copiedCode === 'dvwa-docker' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copiedCode === 'dvwa-docker' ? 'Copied' : 'Copy script'}
            </button>
          </div>
          <pre className="text-xs font-mono text-emerald-300 overflow-x-auto p-2.5 bg-slate-950 rounded border border-slate-900">
{`# 1. Install and start Docker
sudo apt update && sudo apt install -y docker.io
sudo systemctl start docker

# 2. Run Damn Vulnerable Web App container on port 8080
sudo docker run --rm -it -p 8080:80 vulnerables/web-dvwa

# 3. Access in browser at: http://127.0.0.1:8080 (admin / password)`}
          </pre>
        </div>
      </div>

      {/* Target Platforms Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Recommended Practice Targets & Platforms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LAB_TARGETS.map((target) => (
            <div
              key={target.name}
              className="p-5 rounded-xl border border-slate-800 bg-slate-950/70 space-y-4 flex flex-col justify-between shadow-md"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-base font-bold text-white">{target.name}</h4>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        target.difficulty === 'Beginner'
                          ? 'text-emerald-400 border-emerald-800 bg-emerald-950/30'
                          : 'text-amber-400 border-amber-800 bg-amber-950/30'
                      }`}
                    >
                      {target.difficulty}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {target.type}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{target.description}</p>
              </div>

              {/* Instructions */}
              <div className="space-y-1.5 text-xs text-slate-400 bg-black/60 p-3 rounded-lg border border-slate-850">
                <span className="font-semibold text-slate-300 block mb-1">Setup Instructions:</span>
                <ol className="list-decimal list-inside space-y-1">
                  {target.setupInstructions.map((inst, i) => (
                    <li key={i} className="leading-relaxed">
                      {inst}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Key learnings */}
              <div className="text-[11px] text-emerald-400/90 font-mono pt-1 border-t border-slate-850 flex items-center justify-between">
                <span>Key focus: {target.keyLearning}</span>
                {target.url && (
                  <a
                    href={target.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-slate-400 hover:text-white underline shrink-0 ml-2"
                  >
                    Visit <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
