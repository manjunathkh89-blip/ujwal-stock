import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, RotateCcw, Copy, Check } from 'lucide-react';

interface TerminalOutput {
  id: string;
  command: string;
  result: string;
  isError?: boolean;
}

const PRESET_COMMANDS: Record<string, string> = {
  'whoami': 'kali',
  'uname -a': 'Linux kali 6.6.9-amd64 #1 SMP PREEMPT_DYNAMIC Kali 6.6.9-1kali1 (2024-01-08) x86_64 GNU/Linux',
  'pwd': '/home/kali/lab',
  'ls': 'exploit.py  hash.txt  notes.md  scans/  target_ips.txt  wordlist.txt',
  'ls -la': `total 48
drwxr-xr-x 3 kali kali 4096 Oct 30 18:22 .
drwxr-xr-x 5 kali kali 4096 Oct 30 14:10 ..
-rwxr-xr-x 1 kali kali 1420 Oct 30 16:04 exploit.py
-rw-r--r-- 1 kali kali   33 Oct 30 15:40 hash.txt
-rw-r--r-- 1 kali kali  840 Oct 30 18:01 notes.md
drwxr-xr-x 2 kali kali 4096 Oct 30 14:22 scans
-rw-r--r-- 1 kali kali  120 Oct 30 15:10 target_ips.txt
-rw-r--r-- 1 kali kali 4200 Oct 30 15:30 wordlist.txt`,
  'cat hash.txt': 'e8d95a51f3af4a3b134bf6bb680a213a',
  'cat /etc/os-release': `PRETTY_NAME="Kali GNU/Linux Rolling"
NAME="Kali GNU/Linux"
VERSION_ID="2024.3"
VERSION="2024.3"
ID=kali
ID_LIKE=debian
HOME_URL="https://www.kali.org/"
SUPPORT_URL="https://forums.kali.org/"`,
  'ip a': `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN
    inet 127.0.0.1/8 scope host lo
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP
    inet 192.168.56.101/24 brd 192.168.56.255 scope global dynamic eth0`,
  'ping -c 3 192.168.56.1': `PING 192.168.56.1 (192.168.56.1) 56(84) bytes of data.
64 bytes from 192.168.56.1: icmp_seq=1 ttl=64 time=0.812 ms
64 bytes from 192.168.56.1: icmp_seq=2 ttl=64 time=0.745 ms
64 bytes from 192.168.56.1: icmp_seq=3 ttl=64 time=0.780 ms

--- 192.168.56.1 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2010ms
rtt min/avg/max/mdev = 0.745/0.779/0.812/0.027 ms`,
  'nmap -sV 192.168.56.105': `Starting Nmap 7.94 ( https://nmap.org ) at 2026-10-30 18:30 UTC
Nmap scan report for metasploitable.local (192.168.56.105)
Host is up (0.0012s latency).
PORT     STATE SERVICE VERSION
21/tcp   open  ftp     vsftpd 2.3.4 (Vulnerable Backdoor)
22/tcp   open  ssh     OpenSSH 4.7p1 Debian (protocol 2.0)
80/tcp   open  http    Apache httpd 2.2.8 ((Ubuntu) DAV/2)
3306/tcp open  mysql   MySQL 5.0.51a-3ubuntu5
MAC Address: 08:00:27:B5:41:09 (Oracle VirtualBox virtual NIC)

Service detection performed. 1 IP address (1 host up) scanned in 4.12 seconds`,
  'sudo -l': `Matching Defaults entries for kali on kali-box:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:...

User kali may run the following commands on kali-box:
    (ALL : ALL) ALL`,
  'help': `Available interactive simulator commands:
  - whoami              Show current logged-in user
  - pwd                 Print current directory
  - ls, ls -la          List files and permissions
  - cat hash.txt        Inspect sample MD5 hash file
  - cat /etc/os-release View Kali release info
  - ip a                Inspect local IP configuration
  - ping -c 3 <ip>      Test host reachability
  - nmap -sV <target>   Simulate service version discovery
  - sudo -l             View sudo permissions
  - clear               Wipe the terminal screen
  - date                Display current UTC time
  - history             List recently run commands`,
  'date': 'Fri Oct 30 18:34:22 UTC 2026',
  'history': `1  whoami
2  ip a
3  ping -c 3 192.168.56.1
4  nmap -sV 192.168.56.105
5  cat hash.txt`,
};

export const TerminalSimulator: React.FC<{ initialCommand?: string }> = ({ initialCommand }) => {
  const [input, setInput] = useState(initialCommand || '');
  const [history, setHistory] = useState<TerminalOutput[]>([
    {
      id: 'welcome',
      command: 'kali-welcome',
      result: `Kali Linux GNU/Linux Rolling [Release 2024.3]
* Interactive sandbox terminal ready. Type 'help' to see simulated commands.
* Practice real Kali commands in an isolated web environment safely!`,
    },
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialCommand) {
      setInput(initialCommand);
      inputRef.current?.focus();
    }
  }, [initialCommand]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleExecute = (cmdToRun?: string) => {
    const rawCmd = (cmdToRun !== undefined ? cmdToRun : input).trim();
    if (!rawCmd) return;

    if (rawCmd.toLowerCase() === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    let output = '';
    let isError = false;

    // Check exact match or prefix
    if (PRESET_COMMANDS[rawCmd]) {
      output = PRESET_COMMANDS[rawCmd];
    } else if (rawCmd.startsWith('ping')) {
      output = PRESET_COMMANDS['ping -c 3 192.168.56.1'];
    } else if (rawCmd.startsWith('nmap')) {
      output = PRESET_COMMANDS['nmap -sV 192.168.56.105'];
    } else if (rawCmd.startsWith('cat')) {
      output = `kali@kali: File inspected.\n${PRESET_COMMANDS['cat hash.txt']}`;
    } else if (rawCmd.startsWith('echo ')) {
      output = rawCmd.substring(5);
    } else {
      output = `bash: ${rawCmd}: command simulated in lab demo mode. Type 'help' to see supported sandbox commands.`;
      isError = true;
    }

    setHistory((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        command: rawCmd,
        result: output,
        isError,
      },
    ]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleExecute();
    }
  };

  const copyResult = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickSamples = ['whoami', 'ip a', 'nmap -sV 192.168.56.105', 'cat hash.txt', 'help'];

  return (
    <div className="w-full rounded-xl border border-cyan-950 bg-[#020510]/95 text-slate-200 shadow-2xl overflow-hidden font-mono text-xs sm:text-sm">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#01040a] border-b border-cyan-950/80 select-none">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-cyan-500/80 inline-block" />
          <span className="ml-2 text-xs text-slate-400 font-sans font-medium flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
            kali@kali: ~ (Interactive Lab Sandbox)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHistory([])}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-400 transition-colors px-2 py-0.5 rounded hover:bg-slate-900"
            title="Clear terminal screen"
          >
            <RotateCcw className="w-3 h-3" />
            Clear
          </button>
        </div>
      </div>

      {/* Suggested Quick Drills */}
      <div className="flex items-center gap-1.5 px-4 py-2 bg-[#020510]/80 border-b border-cyan-950/60 overflow-x-auto text-xs">
        <span className="text-slate-500 text-[11px] uppercase tracking-wider shrink-0 font-sans">
          Quick test:
        </span>
        {quickSamples.map((cmd) => (
          <button
            key={cmd}
            onClick={() => {
              setInput(cmd);
              handleExecute(cmd);
            }}
            className="px-2 py-0.5 bg-slate-900/90 hover:bg-cyan-950/60 hover:text-cyan-300 text-slate-300 rounded border border-cyan-950/80 transition-colors shrink-0 text-xs"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal Output Area */}
      <div className="p-4 space-y-3 max-h-[380px] overflow-y-auto font-mono text-[13px] leading-relaxed">
        {history.map((item) => (
          <div key={item.id} className="space-y-1">
            <div className="flex items-center justify-between text-slate-400 group">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-semibold">┌──(kali㉿kali)-[~]</span>
              </div>
              <button
                onClick={() => copyResult(item.result, item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-slate-300 p-1"
                title="Copy output"
              >
                {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-semibold">└─$</span>
              <span className="text-white font-medium">{item.command}</span>
            </div>
            <pre className={`whitespace-pre-wrap pl-4 py-1 text-xs sm:text-[13px] ${item.isError ? 'text-amber-400/90' : 'text-slate-300'} font-mono`}>
              {item.result}
            </pre>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Active Prompt Input */}
      <div className="px-4 py-3 bg-[#01040a] border-t border-cyan-950/80 flex items-center gap-2">
        <span className="text-cyan-400 font-semibold shrink-0">kali@kali:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a Kali command here (e.g. nmap, whoami, ip a) and press Enter..."
          className="w-full bg-transparent text-cyan-300 focus:outline-none placeholder:text-slate-600 font-mono text-xs sm:text-sm"
        />
        <button
          onClick={() => handleExecute()}
          disabled={!input.trim()}
          className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-30 text-slate-950 font-bold rounded flex items-center gap-1.5 transition-all text-xs shrink-0 font-sans shadow-[0_0_12px_rgba(6,182,212,0.3)]"
        >
          <Play className="w-3 h-3 fill-current" />
          Run
        </button>
      </div>
    </div>
  );
};
