import { PracticeScenario } from '../types';

export const PRACTICE_SCENARIOS: PracticeScenario[] = [
  {
    id: 'recon-hidden-dirs',
    title: 'Artifact Discovery: Uncover Hidden Directories',
    track: 'system',
    difficulty: 'beginner',
    badge: 'Artifact Hunter',
    briefing:
      'Intelligence indicates that an adversary left a hidden staging directory on this Linux workstation before disconnecting. Your objective is to inspect the current project root, uncover all hidden files and hidden dot-directories, and inspect their permissions.',
    targetEnv: 'corp-workstation-07 (/var/www/deployment)',
    objective: 'Type a command to list ALL directory contents including hidden dot-files and folders with detailed permissions and timestamps.',
    simulatedPath: 'kali@dracosec:/var/www/deployment$',
    acceptedCommands: [
      { pattern: '^ls\\s+.*-[a-zA-Z]*a[a-zA-Z]*l.*', isRegex: true },
      { pattern: '^ls\\s+.*-[a-zA-Z]*l[a-zA-Z]*a.*', isRegex: true },
      { pattern: '^ls\\s+-la$', isRegex: true },
      { pattern: '^ls\\s+-al$', isRegex: true },
      { pattern: '^ls\\s+-l\\s+-a$', isRegex: true },
      { pattern: '^ls\\s+-a\\s+-l$', isRegex: true },
      { pattern: '^ls\\s+--all\\s+-l$', isRegex: true },
      { pattern: '^ls\\s+-l\\s+--all$', isRegex: true },
      { pattern: '^find\\s+\\.\\s+-maxdepth\\s+1.*', isRegex: true },
    ],
    commonMistakes: [
      {
        pattern: '^ls$',
        feedback: 'Standard "ls" ignores files and folders beginning with a dot. You need the flag that reveals all hidden files.',
      },
      {
        pattern: '^ls\\s+-l$',
        feedback: 'Almost there! "-l" shows long details, but hides dotfiles. Combine it with the "-a" (all) flag.',
      },
      {
        pattern: '^ls\\s+-a$',
        feedback: 'The "-a" flag shows hidden files, but the objective requires permissions and timestamp details too. Add "-l" for long format!',
      },
    ],
    simulatedOutput: `total 48
drwxr-xr-x 6 www-data www-data 4096 Oct 31 10:14 .
drwxr-xr-x 4 root     root     4096 Oct 15 08:22 ..
-rw-r--r-- 1 www-data www-data  220 Oct 31 09:30 .bash_logout
drwxr-x--- 2 attacker shadow   4096 Oct 31 10:12 .hidden_exfil_vault
-rw------- 1 attacker shadow    842 Oct 31 10:13 .secret_access_keys.enc
drwxr-xr-x 8 www-data www-data 4096 Oct 31 09:12 .git
-rw-r--r-- 1 www-data www-data 1152 Oct 31 08:45 index.html
drwxr-xr-x 2 www-data www-data 4096 Oct 31 08:45 assets
-rw-r--r-- 1 www-data www-data 3412 Oct 31 08:45 main.js
-rw-r--r-- 1 www-data www-data  420 Oct 31 08:45 robots.txt
[+] SUCCESS: Hidden staging directory ".hidden_exfil_vault" and encrypted keyfile ".secret_access_keys.enc" discovered!`,
    hints: [
      'In Linux, hidden files and directories start with a period (.) such as .git or .bashrc.',
      'The "ls" command accepts the "-a" (all) flag to show hidden files and "-l" (long) to display file permissions and owners.',
      'Try typing: ls -la',
    ],
    solutionCommand: 'ls -la',
    solutionExplanation:
      'In POSIX/Linux file systems, files starting with a leading dot (.) are treated as hidden by default utilities. The "ls -la" command flags "-l" (detailed long listing: permissions, owner, group, file size, modification date) and "-a" (all files including . and ..) ensure complete situational awareness during digital forensics and incident response.',
    mitreTechnique: 'T1083 - File and Directory Discovery',
    xp: 100,
  },
  {
    id: 'recon-nmap-service-detect',
    title: 'Network Recon: Service Version Detection',
    track: 'network',
    difficulty: 'beginner',
    badge: 'Network Scout',
    briefing:
      'You are performing an authorized penetration test against an unmapped perimeter gateway at 192.168.1.50. Standard ping sweeps responded, but firewall rules may be hiding service headers. Discover open ports and determine running service versions without running noisy full OS scripts.',
    targetEnv: 'Target IP: 192.168.1.50',
    objective: 'Run nmap against target IP 192.168.1.50 to inspect and determine service versions running on the top open ports.',
    simulatedPath: 'kali@dracosec:~$',
    acceptedCommands: [
      { pattern: '^nmap\\s+.*-sV.*192\\.168\\.1\\.50.*', isRegex: true },
      { pattern: '^nmap\\s+192\\.168\\.1\\.50.*-sV.*', isRegex: true },
      { pattern: '^nmap\\s+-sV\\s+192\\.168\\.1\\.50$', isRegex: true },
      { pattern: '^nmap\\s+-sV\\s+-p-\\s+192\\.168\\.1\\.50$', isRegex: true },
      { pattern: '^nmap\\s+-Pn\\s+-sV\\s+192\\.168\\.1\\.50$', isRegex: true },
    ],
    commonMistakes: [
      {
        pattern: '^nmap\\s+192\\.168\\.1\\.50$',
        feedback: 'Basic nmap only checks if ports are open, but does not query application banners for service versions. Add the "-sV" flag!',
      },
      {
        pattern: '^ping.*',
        feedback: 'Ping only tests ICMP reachability, not open port services. Use nmap with "-sV".',
      },
    ],
    simulatedOutput: `Starting Nmap 7.94 ( https://nmap.org ) at 2026-10-31 10:20 EDT
Nmap scan report for gateway-corp.local (192.168.1.50)
Host is up (0.0012s latency).
Not shown: 996 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.6 (Ubuntu Linux; protocol 2.0)
80/tcp   open  http    Apache httpd 2.4.52 ((Ubuntu))
443/tcp  open  ssl/ssl OpenSSL 3.0.2
8080/tcp open  http    Apache Tomcat/9.0.58
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 6.42 seconds
[+] SUCCESS: Service versions detected! Identified unpatched Apache Tomcat 9.0.58 on port 8080.`,
    hints: [
      'Nmap offers service detection using the "-sV" flag.',
      'Make sure you specify the target host IP (192.168.1.50) alongside the flag.',
      'Try typing: nmap -sV 192.168.1.50',
    ],
    solutionCommand: 'nmap -sV 192.168.1.50',
    solutionExplanation:
      'The "-sV" flag instructs Nmap to actively probe open ports by interrogating banners, protocol handshakes, and signatures against nmap-service-probes database. This reveals exact daemon versions (e.g., Apache Tomcat 9.0.58) essential for checking known CVE advisories.',
    mitreTechnique: 'T1046 - Network Service Discovery',
    xp: 150,
  },
  {
    id: 'privesc-find-suid',
    title: 'Privilege Escalation: Hunt Dangerous SUID Binaries',
    track: 'privesc',
    difficulty: 'intermediate',
    badge: 'Root Seeker',
    briefing:
      'You have obtained a low-privilege shell as user "www-data" on a Linux production node. Standard sudo rights are disabled. Search the whole filesystem for binaries configured with the SUID bit (Set-User-ID) owned by root, discarding permission errors to find privilege escalation vectors.',
    targetEnv: 'compromised-linux-node (user: www-data)',
    objective: 'Use the find command from root (/) to locate all SUID binaries (-perm -4000 or -perm -u=s) owned by root, redirecting error messages to /dev/null.',
    simulatedPath: 'www-data@production-node:~$',
    acceptedCommands: [
      { pattern: 'find\\s+/\\s+-perm\\s+-4000.*2>/dev/null', isRegex: true },
      { pattern: 'find\\s+/\\s+-perm\\s+-u=s.*2>/dev/null', isRegex: true },
      { pattern: 'find\\s+/\\s+-user\\s+root\\s+-perm\\s+-4000.*2>/dev/null', isRegex: true },
      { pattern: 'find\\s+/\\s+-perm\\s+-4000\\s+-type\\s+f.*2>/dev/null', isRegex: true },
      { pattern: 'find\\s+/\\s+-type\\s+f\\s+-perm\\s+-4000.*2>/dev/null', isRegex: true },
      { pattern: 'find\\s+/\\s+-perm\\s+-4000', isRegex: true },
    ],
    commonMistakes: [
      {
        pattern: '^find\\s+/\\s+-name.*',
        feedback: 'Searching by filename won\'t find SUID bits. Use the "-perm -4000" flag to search by permission bitmask.',
      },
      {
        pattern: '.*2>/dev/null',
        feedback: 'Good error suppression! Now make sure your base find command checks for "-perm -4000" starting at root "/".',
      },
    ],
    simulatedOutput: `/usr/bin/passwd
/usr/bin/chfn
/usr/bin/newgrp
/usr/bin/gpasswd
/usr/bin/sudo
/usr/bin/mount
/usr/bin/umount
/usr/local/bin/backup-tool-root
/usr/bin/pkexec
[+] PRIVILEGE ESCALATION VULNERABILITY FOUND:
/usr/local/bin/backup-tool-root is a non-standard SUID root binary with world-executable permissions!
Checking binary strings reveals: invokes "tar" without absolute path (vulnerable to PATH hijacking)!`,
    hints: [
      'The find command can search from the root path "/" for specific permissions with "-perm".',
      'The SUID bit represents octal 4000. Use "-perm -4000" to match files with SUID enabled.',
      'Add "2>/dev/null" at the end to suppress noisy "Permission denied" errors. Example: find / -perm -4000 -type f 2>/dev/null',
    ],
    solutionCommand: 'find / -perm -4000 -type f 2>/dev/null',
    solutionExplanation:
      'SUID (Set User ID) allows executables to run with the privileges of the file owner (commonly root). Attackers and penetration testers search for misconfigured SUID binaries (like custom scripts or GTFOBins) using "find / -perm -4000 2>/dev/null" to escalate from unprivileged shell to root.',
    mitreTechnique: 'T1548.001 - Abuse Elevation Control Mechanism: Setuid and Setgid',
    xp: 200,
  },
  {
    id: 'web-fuzz-endpoints',
    title: 'Web Enumeration: Fuzz Hidden Endpoints with Gobuster',
    track: 'web',
    difficulty: 'intermediate',
    badge: 'Web Fuzzer',
    briefing:
      'A web application at http://10.10.11.200 has a public landing page with no visible navigation links. OSINT suggests an administrative dashboard and API endpoints exist on this server. Fuzz directory paths using gobuster with the common wordlist.',
    targetEnv: 'Target Web Host: http://10.10.11.200',
    objective: 'Run gobuster in directory mode (dir) targeting url http://10.10.11.200 using wordlist /usr/share/wordlists/dirb/common.txt.',
    simulatedPath: 'kali@dracosec:~$',
    acceptedCommands: [
      { pattern: 'gobuster\\s+dir\\s+.*-u\\s+http://10\\.10\\.11\\.200.*-w\\s+/usr/share/wordlists/dirb/common\\.txt', isRegex: true },
      { pattern: 'gobuster\\s+dir\\s+.*-w\\s+/usr/share/wordlists/dirb/common\\.txt.*-u\\s+http://10\\.10\\.11\\.200', isRegex: true },
      { pattern: 'gobuster\\s+dir\\s+.*-u\\s+http://10\\.10\\.11\\.200', isRegex: true },
      { pattern: 'ffuf\\s+.*-u\\s+http://10\\.10\\.11\\.200/FUZZ', isRegex: true },
    ],
    commonMistakes: [
      {
        pattern: '^gobuster$',
        feedback: 'Gobuster requires a mode. For directory brute forcing, specify "gobuster dir".',
      },
      {
        pattern: '.*10\\.10\\.11\\.200.*',
        feedback: 'Ensure you specify the target URL flag "-u http://10.10.11.200" and wordlist "-w /usr/share/wordlists/dirb/common.txt".',
      },
    ],
    simulatedOutput: `===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.10.11.200
[+] Method:                  GET
[+] Wordlist:                /usr/share/wordlists/dirb/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/.hta                 (Status: 403) [Size: 279]
/.htpasswd            (Status: 403) [Size: 279]
/admin                (Status: 301) [Size: 317] [--> http://10.10.11.200/admin/]
/api                  (Status: 200) [Size: 184]
/assets               (Status: 301) [Size: 318] [--> http://10.10.11.200/assets/]
/backup               (Status: 301) [Size: 318] [--> http://10.10.11.200/backup/]
/console              (Status: 401) [Size: 452]
/robots.txt           (Status: 200) [Size: 42]
/server-status        (Status: 403) [Size: 279]
===============================================================
Finished
===============================================================
[+] CRITICAL ENDPOINTS FOUND: /admin, /api, and /backup exposed!`,
    hints: [
      'Gobuster directory mode syntax starts with: gobuster dir',
      'Specify the URL with "-u http://10.10.11.200" and the wordlist with "-w /usr/share/wordlists/dirb/common.txt".',
      'Try typing: gobuster dir -u http://10.10.11.200 -w /usr/share/wordlists/dirb/common.txt',
    ],
    solutionCommand: 'gobuster dir -u http://10.10.11.200 -w /usr/share/wordlists/dirb/common.txt',
    solutionExplanation:
      'Gobuster performs high-speed HTTP URI brute forcing. Finding hidden directories like /backup and /api often leads to sensitive configuration file downloads, unauthenticated endpoints, and administration portals.',
    mitreTechnique: 'T1595.002 - Active Scanning: Vulnerability Scanning',
    xp: 200,
  },
  {
    id: 'crypto-hash-crack',
    title: 'Password Audit: Identify & Crack MD5 Hash with Hashcat',
    track: 'recon',
    difficulty: 'advanced',
    badge: 'Hash Breaker',
    briefing:
      'An incident investigation extracted an unsalted 32-character hexadecimal credential hash from a compromised database: 5ebe2294ecd0e0f08eab7690d2a6ee69. Identify the hash algorithm (MD5 = mode 0) and crack it using hashcat against the classic rockyou wordlist.',
    targetEnv: 'Cracking Rig: RTX 4090 / Kali OpenCL',
    objective: 'Run hashcat in straight dictionary mode (-a 0) for MD5 (-m 0) against the hash "5ebe2294ecd0e0f08eab7690d2a6ee69" with wordlist /usr/share/wordlists/rockyou.txt.',
    simulatedPath: 'kali@dracosec:~$',
    acceptedCommands: [
      { pattern: 'hashcat\\s+.*-m\\s+0.*5ebe2294ecd0e0f08eab7690d2a6ee69.*/usr/share/wordlists/rockyou\\.txt', isRegex: true },
      { pattern: 'hashcat\\s+-m\\s+0\\s+5ebe2294ecd0e0f08eab7690d2a6ee69\\s+/usr/share/wordlists/rockyou\\.txt', isRegex: true },
      { pattern: 'hashcat\\s+-a\\s+0\\s+-m\\s+0\\s+5ebe2294ecd0e0f08eab7690d2a6ee69\\s+/usr/share/wordlists/rockyou\\.txt', isRegex: true },
      { pattern: 'hashcat\\s+-m\\s+0\\s+-a\\s+0\\s+5ebe2294ecd0e0f08eab7690d2a6ee69\\s+/usr/share/wordlists/rockyou\\.txt', isRegex: true },
      { pattern: 'john\\s+--format=raw-md5.*5ebe2294ecd0e0f08eab7690d2a6ee69', isRegex: true },
    ],
    commonMistakes: [
      {
        pattern: '^hashcat.*',
        feedback: 'Make sure you specify the hash mode with "-m 0" for MD5, followed by the hash string and rockyou wordlist path.',
      },
    ],
    simulatedOutput: `hashcat (v6.2.6) starting...

OpenCL API (OpenCL 3.0 CUDA 12.4.131) - Platform #1 [NVIDIA Corporation]
========================================================================
* Device #1: NVIDIA GeForce RTX 4090, 24151/24564 MB, 128MCU

Minimum password length supported by kernel: 0
Maximum password length supported by kernel: 256

Hashes: 1 digests; 1 unique digests, 1 unique salts
Bitmaps: 16 bits, 65536 entries, 0x0000ffff mask, 1048576 bytes
Rules: 1

Applicable optimizers applied:
* Zero-Byte
* Early-Skip
* Not-Salted
* Single-Hash
* Single-Salt
* Raw-Hash

5ebe2294ecd0e0f08eab7690d2a6ee69:secret

Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 0 (MD5)
Hash.Target......: 5ebe2294ecd0e0f08eab7690d2a6ee69
Time.Started.....: Sat Oct 31 10:24:02 2026 (0 secs)
Time.Estimated...: Sat Oct 31 10:24:02 2026 (0 secs)
Kernel.Feature...: Pure Kernel
Guess.Base.......: File (/usr/share/wordlists/rockyou.txt)
Speed.#1.........: 14221.4 MH/s (4.12ms)
Recovered........: 1/1 (100.00%) Digests

[+] SUCCESS: Hash cracked! Plaintext password: "secret"`,
    hints: [
      'In Hashcat, MD5 corresponds to mode 0 ("-m 0").',
      'Straight dictionary attack mode is "-a 0" (or omitted as it is the default).',
      'Try typing: hashcat -m 0 5ebe2294ecd0e0f08eab7690d2a6ee69 /usr/share/wordlists/rockyou.txt',
    ],
    solutionCommand: 'hashcat -m 0 5ebe2294ecd0e0f08eab7690d2a6ee69 /usr/share/wordlists/rockyou.txt',
    solutionExplanation:
      'MD5 is an obsolete, cryptographically broken message digest algorithm susceptible to collision and rapid brute-forcing. A modern GPU can compute tens of billions of MD5 hashes per second, recovering common passwords from dictionaries like rockyou within milliseconds.',
    mitreTechnique: 'T1110.002 - Brute Force: Password Cracking',
    xp: 250,
  },
  {
    id: 'network-tcpdump-sniff',
    title: 'Traffic Analysis: Live Packet Capture on eth0',
    track: 'network',
    difficulty: 'intermediate',
    badge: 'Packet Hunter',
    briefing:
      'Suspicious beaconing traffic has been observed originating from the primary internal interface "eth0". You need to capture live network packets on this interface, displaying ASCII payload text and packet hex data without resolving DNS domain names.',
    targetEnv: 'Internal Gateway eth0',
    objective: 'Run tcpdump on interface eth0 (-i eth0) with verbose ASCII/hex output (-X) and numeric IPs (-n) limited to 5 packets (-c 5).',
    simulatedPath: 'root@dracosec:~#',
    acceptedCommands: [
      { pattern: 'tcpdump\\s+.*-i\\s+eth0.*-X.*-n.*-c\\s+5', isRegex: true },
      { pattern: 'tcpdump\\s+.*-i\\s+eth0.*-n.*-X.*-c\\s+5', isRegex: true },
      { pattern: 'tcpdump\\s+.*-i\\s+eth0.*-n.*-X', isRegex: true },
      { pattern: 'tcpdump\\s+-i\\s+eth0\\s+-X\\s+-n', isRegex: true },
      { pattern: 'tcpdump\\s+-i\\s+eth0', isRegex: true },
    ],
    commonMistakes: [
      {
        pattern: '^tcpdump$',
        feedback: 'tcpdump without flags may listen on default interface and spam your screen. Specify "-i eth0" and flags "-n -X -c 5".',
      },
    ],
    simulatedOutput: `tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
10:30:12.441029 IP 10.10.14.5.44820 > 10.10.10.100.80: Flags [P.], seq 1:85, ack 1, win 502, length 84: HTTP: GET /api/telemetry HTTP/1.1
	0x0000:  4500 007c a124 4000 4006 8ef1 0a0a 0e05  E..|.$@.@.......
	0x0010:  0a0a 0a64 af14 0050 7e2f 1a3b 9c34 5018  ...d...P~/.;.4P.
	0x0020:  01f6 3d12 0000 4745 5420 2f61 7069 2f74  ..=...GET./api/t
	0x0030:  656c 656d 6574 7279 2048 5454 502f 312e  elemetry.HTTP/1.
	0x0040:  310d 0a48 6f73 743a 2031 302e 3130 2e31  1..Host:.10.10.1
10:30:12.441890 IP 10.10.10.100.80 > 10.10.14.5.44820: Flags [.], ack 85, win 509, length 0
5 packets captured
5 packets received by filter
0 packets dropped by kernel
[+] CAPTURE COMPLETE: Cleartext HTTP API telemetry payload successfully extracted from eth0 stream!`,
    hints: [
      'Specify the network interface using "-i eth0".',
      'The "-X" flag dumps both hexadecimal and ASCII payload representation; "-n" avoids slow DNS lookups.',
      'Try typing: tcpdump -i eth0 -n -X -c 5',
    ],
    solutionCommand: 'tcpdump -i eth0 -n -X -c 5',
    solutionExplanation:
      'tcpdump is the defacto command-line packet analyzer for Linux. Using "-n" disables hostname resolution (faster and stealthier), "-X" outputs both hex and ASCII payload for protocol analysis, and "-c" limits the capture count.',
    mitreTechnique: 'T1040 - Network Sniffing',
    xp: 175,
  },
];
