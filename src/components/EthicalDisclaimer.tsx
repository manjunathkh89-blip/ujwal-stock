import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface EthicalDisclaimerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EthicalDisclaimerModal: React.FC<EthicalDisclaimerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0B1220] border border-[#00C8FF]/20 rounded-xl shadow-2xl overflow-hidden p-6 text-[#C9D6E2] space-y-4">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Ethical Use &amp; Legal Compliance Mandate
              </h2>
              <p className="text-xs text-[#EF4444] font-mono">
                MANDATORY RULES OF ENGAGEMENT
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#7C8DA0] hover:text-white hover:bg-[#162035] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legal Notice */}
        <div className="p-4 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs sm:text-sm text-[#C9D6E2] leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-bold text-[#EF4444]">
            <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0" />
            <span>Strict Legal Warning</span>
          </div>
          <p>
            The tools, commands, techniques, and procedures described in this guide are provided strictly for <strong className="text-white">educational, defensive security research, and authorized penetration testing</strong>.
          </p>
          <p className="text-[#EF4444]/90 font-medium">
            Accessing, scanning, probing, or attacking computer systems, networks, or wireless access points without <strong className="text-white">prior, formal, written consent</strong> from the system owner is illegal under federal and international statutes (including the US Computer Fraud and Abuse Act 18 U.S.C. § 1030, the UK Computer Misuse Act 1990, and international cybercrime treaties).
          </p>
        </div>

        {/* 4 Golden Rules */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#7C8DA0]">
            The 4 Golden Rules of Ethical Security Testing:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-lg bg-[#05080F] border border-slate-800">
              <div className="font-semibold text-[#00C8FF] mb-0.5">1. Explicit Written Scope</div>
              <p className="text-[#7C8DA0]">Always define strict Rules of Engagement (ROE) and exact target IP ranges before typing any probe command.</p>
            </div>
            <div className="p-3 rounded-lg bg-[#05080F] border border-slate-800">
              <div className="font-semibold text-[#00C8FF] mb-0.5">2. Isolate Testing Environments</div>
              <p className="text-[#7C8DA0]">Practice on host-only virtual machines (VirtualBox/VMware), Metasploitable, DVWA, or dedicated labs (HackTheBox, TryHackMe).</p>
            </div>
            <div className="p-3 rounded-lg bg-[#05080F] border border-slate-800">
              <div className="font-semibold text-[#00C8FF] mb-0.5">3. Responsible Vulnerability Disclosure</div>
              <p className="text-[#7C8DA0]">If you identify an unpatched vulnerability in an authorized engagement, report it privately to the maintainers.</p>
            </div>
            <div className="p-3 rounded-lg bg-[#05080F] border border-slate-800">
              <div className="font-semibold text-[#00C8FF] mb-0.5">4. Do No Harm</div>
              <p className="text-[#7C8DA0]">Never execute destructive payloads, denial of service (DoS), or unapproved data exfiltration on production systems.</p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto h-9 px-5 bg-[#00C8FF] hover:bg-[#00C8FF]/90 text-[#05080F] font-semibold rounded-lg text-xs transition-all duration-200 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            I Understand &amp; Agree to Test Responsibly
          </button>
        </div>
      </div>
    </div>
  );
};

export const EthicalBanner: React.FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="w-full bg-[#EF4444]/10 border-b border-[#EF4444]/25 px-4 py-2 text-xs text-[#C9D6E2] flex items-center justify-between gap-3 font-sans">
      <div className="flex items-center gap-2 max-w-[1320px] mx-auto truncate">
        <ShieldAlert className="w-4 h-4 text-[#EF4444] shrink-0" />
        <span className="truncate">
          <strong className="text-[#EF4444] font-semibold">Ethical Use Policy:</strong> Only test systems you own or have explicit written permission to test. Unauthorized access is strictly illegal.
        </span>
        <button
          onClick={onOpenModal}
          className="text-xs text-[#00C8FF] hover:underline shrink-0 font-medium ml-1"
        >
          View Mandate
        </button>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-[#7C8DA0] hover:text-white p-1 shrink-0"
        title="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
