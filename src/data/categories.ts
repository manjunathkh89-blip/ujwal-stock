import { CategoryItem } from '../types';

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'linux-basics',
    name: 'Linux Basics & System Navigation',
    shortName: 'Linux Basics',
    description: 'File operations (ls, cd, rm), permissions (chmod), administrative rights (sudo), search (grep, find), and apt packages.',
    iconName: 'Terminal',
    accentColor: '#10b981', // emerald
  },
  {
    id: 'networking',
    name: 'Networking & Host Probing',
    shortName: 'Networking',
    description: 'IP inspection (ip), connectivity (ping), listening sockets (ss), web transfers (curl, wget), DNS (dig), and secure remote access (ssh).',
    iconName: 'Network',
    accentColor: '#06b6d4', // cyan
  },
  {
    id: 'info-gathering',
    name: 'Information Gathering & Recon',
    shortName: 'Recon & OSINT',
    description: 'Port and service discovery (nmap), domain records (whois), email harvesting (theHarvester), and DNS brute-force (dnsenum).',
    iconName: 'Search',
    accentColor: '#3b82f6', // blue
  },
  {
    id: 'web-testing',
    name: 'Web Application Testing',
    shortName: 'Web Testing',
    description: 'Vulnerability scanners (nikto), directory fuzzers (gobuster, ffuf), database takeover (sqlmap), and proxy analysis (Burp Suite).',
    iconName: 'Globe',
    accentColor: '#8b5cf6', // purple
  },
  {
    id: 'password-security',
    name: 'Password Security & Auditing',
    shortName: 'Password Security',
    description: 'GPU hash cracking (hashcat), CPU dictionary attacks (john), and network authentication brute-force (hydra).',
    iconName: 'KeyRound',
    accentColor: '#ef4444', // red
  },
  {
    id: 'wireless-security',
    name: 'Wireless Security',
    shortName: 'Wireless',
    description: '802.11 monitor mode (airmon-ng), traffic capture (airodump-ng), and automated WPA/WPA2 cracking (aircrack-ng suite, wifite).',
    iconName: 'Wifi',
    accentColor: '#14b8a6', // teal
  },
  {
    id: 'traffic-analysis',
    name: 'Traffic Analysis & Sniffing',
    shortName: 'Traffic Analysis',
    description: 'Packet capture and forensic inspection with Wireshark and tcpdump to analyze protocols and cleartext credentials.',
    iconName: 'Activity',
    accentColor: '#ec4899', // pink
  },
  {
    id: 'metasploit',
    name: 'Metasploit Framework',
    shortName: 'Metasploit',
    description: 'Exploitation framework console (msfconsole), payload and shellcode generation (msfvenom), and meterpreter post-exploitation.',
    iconName: 'Flame',
    accentColor: '#f97316', // orange
  },
  {
    id: 'forensics',
    name: 'Digital Forensics & Artifacts',
    shortName: 'Forensics',
    description: 'Firmware extraction (binwalk), metadata examination (exiftool), lost file carving (foremost), and disk forensics (autopsy).',
    iconName: 'FileSearch',
    accentColor: '#6366f1', // indigo
  },
  {
    id: 'scripting',
    name: 'Scripting & Automation',
    shortName: 'Scripting',
    description: 'Bash one-liners and loops, and Python socket programming to build custom penetration testing and automation tools.',
    iconName: 'Code',
    accentColor: '#84cc16', // lime
  },
  {
    id: 'nethunter-tips',
    name: 'Termux, NetHunter & Troubleshooting',
    shortName: 'Termux / NetHunter',
    description: 'Running Kali on Android phones with Termux/NetHunter KeX, fixing broken apt mirrors, and system maintenance.',
    iconName: 'Wrench',
    accentColor: '#a855f7', // violet
  },
];
