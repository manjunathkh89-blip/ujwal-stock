import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ==========================================
  // LINUX BASICS (5 questions)
  // ==========================================
  {
    id: 'lb-1',
    categoryId: 'linux-basics',
    question: 'Which chmod permission code grants read, write, and execute permissions to the owner, but no access to anyone else?',
    options: ['chmod 777', 'chmod 755', 'chmod 700', 'chmod 644'],
    correctIndex: 2,
    explanation: 'In octal notation, 7 is 4(read) + 2(write) + 1(execute). 700 gives 7 to the user/owner and 0 to group and others.',
  },
  {
    id: 'lb-2',
    categoryId: 'linux-basics',
    question: 'How do you recursively search for the word "password" inside all files in the current directory and subdirectories?',
    options: ['find -name password', 'grep -rn "password" .', 'cat "password" *', 'ls -la | grep password'],
    correctIndex: 1,
    explanation: 'grep with -r (recursive) and -n (line number) searches inside the text contents of every file in the tree.',
  },
  {
    id: 'lb-3',
    categoryId: 'linux-basics',
    question: 'What is the primary difference between kill -15 (SIGTERM) and kill -9 (SIGKILL)?',
    options: [
      'SIGTERM asks the process to exit cleanly and save state, while SIGKILL halts it immediately with no cleanup',
      'SIGKILL restarts the process, while SIGTERM deletes its binary from disk',
      'SIGTERM can only be run by root, while SIGKILL can be run by anyone',
      'There is no difference in Linux kernels',
    ],
    correctIndex: 0,
    explanation: 'SIGTERM (15) allows programs to flush file buffers and close network sockets. SIGKILL (9) cannot be caught or ignored by the process.',
  },
  {
    id: 'lb-4',
    categoryId: 'linux-basics',
    question: 'Which flag in `ls` displays human-readable file sizes (e.g. 14K, 24M, 1.2G)?',
    options: ['-s', '-h', '-H', '-m'],
    correctIndex: 1,
    explanation: 'The `-h` option paired with `-l` (e.g. `ls -lh`) converts byte counts into easy-to-read units like K, M, and G.',
  },
  {
    id: 'lb-5',
    categoryId: 'linux-basics',
    question: 'What command safely updates the package index on Kali Linux before installing new software?',
    options: ['sudo apt upgrade', 'sudo apt update', 'sudo apt install all', 'apt-cache refresh'],
    correctIndex: 1,
    explanation: '`apt update` fetches the latest package lists from mirrors. `apt upgrade` actually installs the newer package versions.',
  },

  // ==========================================
  // NETWORKING (5 questions)
  // ==========================================
  {
    id: 'net-1',
    categoryId: 'networking',
    question: 'Which command replaces the legacy `ifconfig` and `route` commands in modern Kali Linux distributions?',
    options: ['ip', 'netstat', 'traceroute', 'arp'],
    correctIndex: 0,
    explanation: 'The `ip` tool from iproute2 (`ip addr`, `ip route`, `ip link`) has officially replaced legacy net-tools.',
  },
  {
    id: 'net-2',
    categoryId: 'networking',
    question: 'Which `ss` command options display listening TCP and UDP sockets with process names in numeric format?',
    options: ['ss -a', 'sudo ss -tulpn', 'ss -x', 'ss --listen --all'],
    correctIndex: 1,
    explanation: '-t (TCP), -u (UDP), -l (listening), -p (processes), -n (numeric ports). Sudo is required to see processes owned by other users.',
  },
  {
    id: 'net-3',
    categoryId: 'networking',
    question: 'How does traceroute determine each router hop between your machine and a destination?',
    options: [
      'It asks the destination server to list its upstream providers',
      'It increments the IP packet Time-To-Live (TTL) field starting from 1 to trigger ICMP Time Exceeded messages',
      'It sends ARP broadcast queries over the entire global Internet',
      'It scans port 53 on all intermediate servers',
    ],
    correctIndex: 1,
    explanation: 'By setting TTL=1, 2, 3..., intermediate routers discard the expired packet and send back an ICMP Time Exceeded packet revealing their IP.',
  },
  {
    id: 'net-4',
    categoryId: 'networking',
    question: 'Which dig command argument returns only the IP address result without verbose DNS headers?',
    options: ['+answer', '+clean', '+short', '-terse'],
    correctIndex: 2,
    explanation: '`dig +short <domain>` returns only the raw resolved record data (e.g. `93.184.216.34`).',
  },
  {
    id: 'net-5',
    categoryId: 'networking',
    question: 'What curl flag tells it to fetch only the HTTP response headers without downloading the HTML body?',
    options: ['-s', '-H', '-I (or --head)', '-b'],
    correctIndex: 2,
    explanation: '`curl -I` sends an HTTP HEAD request to retrieve status codes, server headers, and cookies without the payload.',
  },

  // ==========================================
  // INFORMATION GATHERING & RECON (5 questions)
  // ==========================================
  {
    id: 'info-1',
    categoryId: 'info-gathering',
    question: 'What is an Nmap SYN Stealth scan (`-sS`), and why is it called "stealthy"?',
    options: [
      'It encrypts the packet payload using AES-256',
      'It sends a SYN packet and resets with RST before completing the full 3-way TCP handshake',
      'It routes all packets through 5 random Tor nodes',
      'It changes the source IP address to a fake Google address',
    ],
    correctIndex: 1,
    explanation: 'Because it never sends the final ACK to complete the TCP handshake, older services did not log a completed connection.',
  },
  {
    id: 'info-2',
    categoryId: 'info-gathering',
    question: 'What does the Nmap flag `-sV` do during an assessment?',
    options: [
      'Sets verbose scan speed',
      'Determines the exact service version and daemon software running on open ports',
      'Sends virus signature test strings',
      'Validates SSL certificates only',
    ],
    correctIndex: 1,
    explanation: '`-sV` interrogates open ports with service-specific probes to detect exact daemon names and version numbers.',
  },
  {
    id: 'info-3',
    categoryId: 'info-gathering',
    question: 'Which tool is designed to harvest employee emails, names, and subdomains using OSINT search engines?',
    options: ['theHarvester', 'tcpdump', 'binwalk', 'wifite'],
    correctIndex: 0,
    explanation: 'theHarvester queries passive sources like search engines, PGP keyrings, and certificate transparency logs.',
  },
  {
    id: 'info-4',
    categoryId: 'info-gathering',
    question: 'What is a DNS Zone Transfer (AXFR) vulnerability?',
    options: [
      'When a DNS server allows any unauthorized client to download its complete internal record database',
      'When DNS packets travel over UDP instead of TCP',
      'When a domain name expires and is bought by someone else',
      'When an IP address is blocked by spam blacklists',
    ],
    correctIndex: 0,
    explanation: 'AXFR is meant for secondary DNS servers to replicate records. If misconfigured, anyone can dump all subdomains and internal hostnames.',
  },
  {
    id: 'info-5',
    categoryId: 'info-gathering',
    question: 'Which tool quickly fingerprints web technologies (CMS, web server, JavaScript libraries, frameworks) from the CLI?',
    options: ['whatweb', 'whois', 'dig', 'chown'],
    correctIndex: 0,
    explanation: 'whatweb inspects HTTP headers, cookies, HTML tags, and scripts to identify over 1,800 web technologies.',
  },

  // ==========================================
  // VULNERABILITY SCANNING (5 questions)
  // ==========================================
  {
    id: 'vuln-1',
    categoryId: 'vuln-scanning',
    question: 'What makes Nikto noisy and easily detectable by web application firewalls (WAF)?',
    options: [
      'It sends thousands of requests probing known dangerous files, old CGIs, and bad headers in rapid succession',
      'It uses unencrypted telnet connections',
      'It crashes the computer hardware',
      'It sends ICMP floods to port 80',
    ],
    correctIndex: 0,
    explanation: 'Nikto tests for over 6,700 items with predictable user agents and known vulnerability paths that trigger IDS/WAF alerts.',
  },
  {
    id: 'vuln-2',
    categoryId: 'vuln-scanning',
    question: 'Which command mirrors (copies) an exploit script from Exploit-DB to your current directory using searchsploit?',
    options: ['searchsploit -d <id>', 'searchsploit -m <id>', 'searchsploit --pull <id>', 'searchsploit -c <id>'],
    correctIndex: 1,
    explanation: '`-m` (mirror) copies the matching proof-of-concept file from the local Kali Exploit-DB archive directly into your working directory.',
  },
  {
    id: 'vuln-3',
    categoryId: 'vuln-scanning',
    question: 'Which specialized security scanner audits WordPress plugins, themes, and usernames?',
    options: ['sqlmap', 'wpscan', 'dirb', 'aircrack-ng'],
    correctIndex: 1,
    explanation: 'WPScan is the dedicated black-box scanner for WordPress CMS installations.',
  },
  {
    id: 'vuln-4',
    categoryId: 'vuln-scanning',
    question: 'What is the modern name and setup command for the OpenVAS vulnerability scanner in Kali?',
    options: ['gvm (Greenbone Vulnerability Management) via gvm-setup and gvm-start', 'openvas-ng start', 'nessus-kali', 'vuln-manager start'],
    correctIndex: 0,
    explanation: 'OpenVAS was rebranded under the Greenbone Vulnerability Management (GVM) suite, managed with `gvm-setup` and `gvm-start`.',
  },
  {
    id: 'vuln-5',
    categoryId: 'vuln-scanning',
    question: 'What does a CVE identifier (e.g., CVE-2021-44228) stand for?',
    options: ['Computer Virus Enumeration', 'Common Vulnerabilities and Exposures', 'Certified Verification Engine', 'Cyberdefense Vector Entity'],
    correctIndex: 1,
    explanation: 'CVE stands for Common Vulnerabilities and Exposures, the industry standard catalog for publicly disclosed cybersecurity vulnerabilities.',
  },

  // ==========================================
  // WEB APPLICATION TESTING (5 questions)
  // ==========================================
  {
    id: 'web-1',
    categoryId: 'web-testing',
    question: 'Which flag in sqlmap prevents it from halting and waiting for interactive prompts by selecting defaults automatically?',
    options: ['--silent', '--force', '--batch', '--auto-all'],
    correctIndex: 2,
    explanation: '`--batch` runs sqlmap non-interactively, accepting default safe choices when prompts arise.',
  },
  {
    id: 'web-2',
    categoryId: 'web-testing',
    question: 'What tool allows you to intercept and manually modify web requests before they hit the server in your browser?',
    options: ['Burp Suite Proxy', 'curl', 'ping', 'whois'],
    correctIndex: 0,
    explanation: 'Burp Suite acts as a local HTTP proxy that intercepts browser requests so you can inspect and tamper with headers and parameters.',
  },
  {
    id: 'web-3',
    categoryId: 'web-testing',
    question: 'When fuzzing with `ffuf`, what keyword must be placed in the URL to denote the injection point for wordlist entries?',
    options: ['{WORD}', 'FUZZ', '$PAYLOAD', '%INPUT%'],
    correctIndex: 1,
    explanation: 'ffuf replaces the literal string `FUZZ` in URLs, headers, or POST data with each entry from the specified wordlist.',
  },
  {
    id: 'web-4',
    categoryId: 'web-testing',
    question: 'What does a 301 or 302 HTTP status code returned during Gobuster directory scanning typically indicate?',
    options: ['The file does not exist', 'The path is an existing directory that redirects (e.g. to /admin/)', 'The server has crashed', 'The server is blocking your IP address'],
    correctIndex: 1,
    explanation: 'Web servers frequently issue a 301 Moved Permanently redirect to add a trailing slash (e.g. `/admin` -> `/admin/`).',
  },
  {
    id: 'web-5',
    categoryId: 'web-testing',
    question: 'Why should you never test SQL injection on production systems without explicit authorization?',
    options: [
      'Payloads can corrupt or delete live database tables and violate computer crime laws',
      'It turns off the power to the server',
      'It formats your Kali Linux hard drive',
      'It disables your web browser',
    ],
    correctIndex: 0,
    explanation: 'Untested SQL payloads can trigger DROP or UPDATE queries, lock table rows, expose private customer data, and result in severe criminal liability.',
  },

  // ==========================================
  // PASSWORD SECURITY (5 questions)
  // ==========================================
  {
    id: 'pwd-1',
    categoryId: 'password-security',
    question: 'Where is the famous standard password dictionary located by default in Kali Linux?',
    options: ['/etc/shadow', '/usr/share/wordlists/rockyou.txt (or .txt.gz)', '/var/passwords.txt', '/home/kali/passwords.dic'],
    correctIndex: 1,
    explanation: 'The rockyou wordlist is installed at `/usr/share/wordlists/rockyou.txt.gz` and contains over 14 million passwords.',
  },
  {
    id: 'pwd-2',
    categoryId: 'password-security',
    question: 'Why is Hashcat typically much faster at cracking password hashes than CPU-based tools?',
    options: [
      'It uses your GPU (graphics card) compute cores, which can execute thousands of parallel mathematical hashes simultaneously',
      'It bypasses the hash algorithm completely',
      'It looks up the plain passwords on Wikipedia',
      'It uses quantum encryption',
    ],
    correctIndex: 0,
    explanation: 'Modern graphics cards contain thousands of shader cores optimized for parallel calculations, reaching billions of hashes per second.',
  },
  {
    id: 'pwd-3',
    categoryId: 'password-security',
    question: 'In Hydra, what is the difference between `-p` and `-P` flags?',
    options: [
      '`-p` specifies a single password string, while `-P` specifies a file containing a list of passwords',
      '`-p` is for port number, `-P` is for password',
      '`-p` specifies plaintext, `-P` specifies encrypted passwords',
      '`-p` enables parallel mode, `-P` is for pause',
    ],
    correctIndex: 0,
    explanation: 'In THC Hydra, lowercase `-l`/`-p` takes a single literal username/password; uppercase `-L`/`-P` takes a file path.',
  },
  {
    id: 'pwd-4',
    categoryId: 'password-security',
    question: 'What is a password "salt" and why does it prevent Rainbow Table attacks?',
    options: [
      'A random string added to the password before hashing so identical passwords produce completely different hash outputs',
      'An encrypted file header',
      'A special character like $ or @',
      'A secret key shared over Bluetooth',
    ],
    correctIndex: 0,
    explanation: 'Salting prevents precomputed hash tables (rainbow tables) from working because an attacker must recompute the table for every unique salt.',
  },
  {
    id: 'pwd-5',
    categoryId: 'password-security',
    question: 'What command in John the Ripper shows previously cracked passwords from its potfile?',
    options: ['john --verify', 'john --show <file>', 'john --history', 'john --dump'],
    correctIndex: 1,
    explanation: '`john --show <file>` reads John\'s `.pot` file and displays any hashes that have already been broken in previous runs.',
  },

  // ==========================================
  // WIRELESS SECURITY (5 questions)
  // ==========================================
  {
    id: 'wifi-1',
    categoryId: 'wireless-security',
    question: 'What does "monitor mode" on a wireless network card allow you to do?',
    options: [
      'Capture and inspect all 802.11 radio frames passing through the air without connecting to any router',
      'Increase your home Wi-Fi download speed to 10 Gbps',
      'Display your desktop on a wireless monitor',
      'Connect to 10 Wi-Fi networks at once',
    ],
    correctIndex: 0,
    explanation: 'Normal managed mode filters out packets not addressed to your MAC. Monitor mode listens promiscuously to all airwaves.',
  },
  {
    id: 'wifi-2',
    categoryId: 'wireless-security',
    question: 'What crucial 4-step sequence is needed in a WPA2 network to perform an offline dictionary crack with aircrack-ng?',
    options: ['A 4-way WPA Handshake', 'A DHCP lease offer', 'An ARP table sync', 'A DNS zone transfer'],
    correctIndex: 0,
    explanation: 'The 4-way handshake occurs when a device connects to an AP. If captured, it can be tested offline against wordlists without touching the router again.',
  },
  {
    id: 'wifi-3',
    categoryId: 'wireless-security',
    question: 'What tool can automatically coordinate monitor mode, handshake captures, and WPS testing via a simple interactive menu?',
    options: ['wifite', 'nikto', 'exiftool', 'sshd'],
    correctIndex: 0,
    explanation: 'Wifite is designed for automated wireless audits, orchestrating aircrack tools, tshark, and reaver automatically.',
  },
  {
    id: 'wifi-4',
    categoryId: 'wireless-security',
    question: 'What does the `airmon-ng check kill` command do before starting monitor mode?',
    options: [
      'Terminates background network services (like NetworkManager and wpa_supplicant) that would steal control of the wireless card',
      'Deletes old network configurations',
      'Turns off your computer screen',
      'Kills rogue Wi-Fi access points',
    ],
    correctIndex: 0,
    explanation: 'NetworkManager constantly tries to roam and reconnect, which knocks wireless cards out of passive monitor mode unless killed.',
  },
  {
    id: 'wifi-5',
    categoryId: 'wireless-security',
    question: 'Is it legal to deauthenticate clients or capture handshakes from your neighbor’s Wi-Fi network without permission?',
    options: [
      'No. It violates federal and international wiretap and radio communications laws and is a serious crime',
      'Yes, as long as you do not read their personal email',
      'Yes, if you use Kali Linux',
      'Yes, on weekends only',
    ],
    correctIndex: 0,
    explanation: 'Deauthentication is illegal jamming/denial of service. Only test wireless access points that you own or have explicit written authority to test.',
  },

  // ==========================================
  // SNIFFING & PACKET ANALYSIS (5 questions)
  // ==========================================
  {
    id: 'sniff-1',
    categoryId: 'sniffing-analysis',
    question: 'Which tcpdump filter captures only traffic destined for or originating from port 443 on interface eth0?',
    options: ['sudo tcpdump -i eth0 port 443', 'tcpdump --filter 443', 'tcpdump -X eth0', 'tcpdump /dev/net 443'],
    correctIndex: 0,
    explanation: '`-i eth0` specifies the interface, and `port 443` specifies the Berkeley Packet Filter (BPF) rule.',
  },
  {
    id: 'sniff-2',
    categoryId: 'sniffing-analysis',
    question: 'What standard file extension is used by tcpdump and Wireshark to save raw network packet captures?',
    options: ['.pcap (or .pcapng)', '.log', '.bin', '.tar.gz'],
    correctIndex: 0,
    explanation: 'PCAP (Packet Capture) and PCAPNG are the universal standard file formats for storing network packet traces.',
  },
  {
    id: 'sniff-3',
    categoryId: 'sniffing-analysis',
    question: 'In Wireshark, what handy feature reconstructs an entire two-way conversation (such as HTTP or Telnet) into readable text?',
    options: ['Follow TCP Stream', 'Decode As DNS', 'Reassemble Packet', 'Hex Dump View'],
    correctIndex: 0,
    explanation: '"Follow TCP Stream" reassembles sequential sequence/ack numbers into a cohesive plaintext or hex transcript of the connection.',
  },
  {
    id: 'sniff-4',
    categoryId: 'sniffing-analysis',
    question: 'What does the `-X` flag do when running tcpdump?',
    options: ['Prints packet headers and data in both Hexadecimal and ASCII text', 'Exports to XML format', 'Runs in extreme stealth mode', 'Enables X11 forwarding'],
    correctIndex: 0,
    explanation: '`-X` outputs data in hex and ASCII, making it easy to read plaintext protocols like HTTP, FTP, and SMTP.',
  },
  {
    id: 'sniff-5',
    categoryId: 'sniffing-analysis',
    question: 'If network traffic is encrypted using modern TLS (HTTPS), what will a packet sniffer see inside the HTTP body payload?',
    options: [
      'Unintelligible encrypted ciphertext that cannot be read without the private session keys',
      'The plaintext password anyway',
      'A blank empty packet',
      'The server\'s root password',
    ],
    correctIndex: 0,
    explanation: 'TLS encrypts the transport payload. Without SSL/TLS session secrets or a decrypting proxy CA, the data appears as pseudo-random ciphertext.',
  },

  // ==========================================
  // EXPLOITATION FRAMEWORK (5 questions)
  // ==========================================
  {
    id: 'exploit-1',
    categoryId: 'exploitation',
    question: 'What command in msfconsole configures the IP address of the target machine being assessed?',
    options: ['set RHOSTS <target_ip>', 'set LHOST <ip>', 'target ip = <ip>', 'connect <ip>'],
    correctIndex: 0,
    explanation: 'RHOSTS (Remote Hosts) defines the destination target, while LHOST (Local Host) defines your own attacking IP for reverse payloads.',
  },
  {
    id: 'exploit-2',
    categoryId: 'exploitation',
    question: 'What is the primary architectural difference between a "bind shell" and a "reverse shell"?',
    options: [
      'In a bind shell the target opens a port waiting for the attacker; in a reverse shell the target connects outbound back to the attacker\'s listener',
      'Bind shells are encrypted, reverse shells are never encrypted',
      'Reverse shells only work on Windows, bind shells only work on Linux',
      'Bind shells require Metasploit, reverse shells do not',
    ],
    correctIndex: 0,
    explanation: 'Reverse shells connect OUTBOUND from target to attacker, which easily bypasses inbound network firewalls and NAT router restrictions.',
  },
  {
    id: 'exploit-3',
    categoryId: 'exploitation',
    question: 'Which Metasploit payload provides an advanced, memory-resident post-exploitation shell with built-in pivoting, screenshots, and hash dumping?',
    options: ['Meterpreter', 'bash/sh', 'cmd/generic', 'telnet_bind'],
    correctIndex: 0,
    explanation: 'Meterpreter is an in-memory interactive payload that allows stealthy post-exploitation without touching disk or creating new processes.',
  },
  {
    id: 'exploit-4',
    categoryId: 'exploitation',
    question: 'Which standalone utility is used to generate custom shellcode binaries, reverse shells, and malicious office macros from the command line?',
    options: ['msfvenom', 'msfdb', 'msfupdate', 'armitage'],
    correctIndex: 0,
    explanation: '`msfvenom` generates and encodes payloads in dozens of formats (`elf`, `exe`, `raw`, `aspx`, `php`, etc.).',
  },
  {
    id: 'exploit-5',
    categoryId: 'exploitation',
    question: 'What command in msfconsole initiates the selected exploit against the target machine?',
    options: ['run (or exploit)', 'start', 'execute', 'pwn'],
    correctIndex: 0,
    explanation: 'Either `run` or `exploit` commands will validate configured options and fire the module.',
  },

  // ==========================================
  // DIGITAL FORENSICS (5 questions)
  // ==========================================
  {
    id: 'forensic-1',
    categoryId: 'forensics',
    question: 'What command-line tool is renowned for inspecting, extracting, and stripping EXIF camera and GPS metadata from photos and documents?',
    options: ['exiftool', 'binwalk', 'strings', 'file'],
    correctIndex: 0,
    explanation: 'ExifTool reads and writes rich metadata tags (camera model, GPS coordinates, creator, timestamps) across hundreds of file types.',
  },
  {
    id: 'forensic-2',
    categoryId: 'forensics',
    question: 'What does `binwalk -e firmware.bin` do when executed?',
    options: [
      'Scans the firmware for embedded files and file systems, then automatically extracts them into a directory',
      'Erases the firmware completely',
      'Flashes the firmware onto your physical motherboard',
      'Encrypts the binary with AES',
    ],
    correctIndex: 0,
    explanation: '`-e` activates extraction mode, carving discovered Squashfs filesystems, zip archives, and headers out of the binary.',
  },
  {
    id: 'forensic-3',
    categoryId: 'forensics',
    question: 'What is "file carving" in digital forensics?',
    options: [
      'Recovering files from raw disk sectors based on their distinct header and footer signatures without relying on the file system index',
      'Splitting a large video file into two halves',
      'Deleting files securely so they cannot be recovered',
      'Renaming a file extension from .txt to .jpg',
    ],
    correctIndex: 0,
    explanation: 'Carvers like `foremost` identify starting and ending byte patterns (magic bytes) to reconstruct lost files from unallocated drive space.',
  },
  {
    id: 'forensic-4',
    categoryId: 'forensics',
    question: 'Why must digital forensic examiners calculate cryptographic hashes (like SHA-256) of evidence drives before touching them?',
    options: [
      'To prove the chain of custody and verify that the evidence was not modified or tampered with during analysis',
      'To make the hard drive spin faster',
      'To decrypt the user\'s passwords automatically',
      'To format the disk partition',
    ],
    correctIndex: 0,
    explanation: 'If the hash of an image changes by even one bit, the evidence could be ruled inadmissible in court.',
  },
  {
    id: 'forensic-5',
    categoryId: 'forensics',
    question: 'Which tool provides an extensible graphical interface for digital forensics investigations (browsing disk images, deleted files, web history)?',
    options: ['Autopsy', 'Nikto', 'Sqlmap', 'John the Ripper'],
    correctIndex: 0,
    explanation: 'Autopsy is the premier open-source digital forensics graphical platform built on top of The Sleuth Kit (TSK).',
  },

  // ==========================================
  // PRIVILEGE ESCALATION (5 questions)
  // ==========================================
  {
    id: 'privesc-1',
    categoryId: 'privesc-post',
    question: 'What is the purpose of running `sudo -l` as your very first step when gaining a standard user shell on a Linux system?',
    options: [
      'To check if the user is permitted to run specific commands as root with or without typing a password',
      'To list all files in the current folder',
      'To restart the SSH daemon',
      'To ping the default gateway',
    ],
    correctIndex: 0,
    explanation: 'Misconfigured sudoers entries frequently allow standard accounts to execute binaries like `find`, `vim`, or `python` as root without passwords.',
  },
  {
    id: 'privesc-2',
    categoryId: 'privesc-post',
    question: 'What website is the essential community reference for exploiting binaries with SUID or sudo rights to spawn root shells?',
    options: ['GTFOBins', 'Google Maps', 'Wikipedia', 'Linux.org'],
    correctIndex: 0,
    explanation: 'GTFOBins curates legitimate Unix binaries that can be abused by attackers to bypass local security restrictions and escalate privileges.',
  },
  {
    id: 'privesc-3',
    categoryId: 'privesc-post',
    question: 'What does the permission bit `rwsr-xr-x` (with an "s" in the owner permissions) indicate on a binary?',
    options: [
      'The SUID (Set User ID) bit is enabled; it executes with the privileges of the file owner (e.g. root)',
      'The file is encrypted with SSL',
      'The file cannot be read by anyone',
      'The file is a temporary system log',
    ],
    correctIndex: 0,
    explanation: 'SUID binaries execute under the file owner\'s user ID rather than the invoking user\'s ID, making them high-value privilege escalation targets.',
  },
  {
    id: 'privesc-4',
    categoryId: 'privesc-post',
    question: 'What automated script is widely used during CTF competitions and authorized pentests to audit Linux systems for privesc vectors?',
    options: ['LinPEAS', 'Nikto', 'Nmap', 'Burp Suite'],
    correctIndex: 0,
    explanation: 'LinPEAS (Linux Privilege Escalation Awesome Script) scans filesystems, cron jobs, network interfaces, and kernel versions for privilege escalation paths.',
  },
  {
    id: 'privesc-5',
    categoryId: 'privesc-post',
    question: 'If you discover that `/etc/passwd` has write permissions (`-rw-rw-rw-`), how can an attacker become root?',
    options: [
      'By appending a new user with UID 0 and a known password hash directly to `/etc/passwd`',
      'By rebooting the server into safe mode',
      'By sending a ping packet to port 80',
      'By deleting the network card driver',
    ],
    correctIndex: 0,
    explanation: 'In Unix systems, any account with UID 0 has full root privileges. An attacker can generate a hash and add `toor:hash:0:0::/root:/bin/bash`.',
  },

  // ==========================================
  // SCRIPTING & AUTOMATION (5 questions)
  // ==========================================
  {
    id: 'script-1',
    categoryId: 'scripting',
    question: 'Which Python 3 one-liner starts a fast temporary HTTP web server in your current folder on port 8000?',
    options: ['python3 -m http.server 8000', 'python3 -run web 8000', 'python3 --serve .', 'python3 -a start_server'],
    correctIndex: 0,
    explanation: '`python3 -m http.server 8000` starts an instant web server, ideal for downloading exploits or scripts onto a target machine in your lab.',
  },
  {
    id: 'script-2',
    categoryId: 'scripting',
    question: 'What does the `&` symbol at the end of a command in Bash do?',
    options: [
      'Pushes the process to execute in the background, immediately returning control of your shell prompt',
      'Encrypts the command execution',
      'Deletes the output from terminal history',
      'Runs the command as root',
    ],
    correctIndex: 0,
    explanation: 'Adding `&` runs the command asynchronously in a subshell background job so your prompt stays interactive.',
  },
  {
    id: 'script-3',
    categoryId: 'scripting',
    question: 'In Bash, what does `2>/dev/null` mean when appended to a command?',
    options: [
      'Redirects standard error (file descriptor 2) to the null device to silence permission errors and noise',
      'Multiplies the speed by 2',
      'Saves the output to a file named null',
      'Prints the output twice',
    ],
    correctIndex: 0,
    explanation: 'File descriptor 1 is standard output (stdout), while descriptor 2 is standard error (stderr). Redirecting `2>/dev/null` silences error messages.',
  },
  {
    id: 'script-4',
    categoryId: 'scripting',
    question: 'What is the "Shebang" line at the very top of an executable Bash script?',
    options: ['#!/bin/bash', '// bash script', '<!-- bash -->', '#include <bash.h>'],
    correctIndex: 0,
    explanation: 'The shebang (`#!/bin/bash` or `#!/usr/bin/env python3`) tells the kernel which interpreter to invoke when the file is executed.',
  },
  {
    id: 'script-5',
    categoryId: 'scripting',
    question: 'Which Bash loop syntax tests ping connectivity across IP addresses 192.168.1.1 to 192.168.1.20?',
    options: [
      'for i in {1..20}; do ping -c 1 192.168.1.$i; done',
      'loop ping 192.168.1.* from 1 to 20',
      'while ping 192.168.1.1-20',
      'repeat 20 ping 192.168.1.x',
    ],
    correctIndex: 0,
    explanation: 'The brace expansion `{1..20}` generates the sequence 1 through 20 and iterates using a standard `for ... in ...; do ...; done` loop.',
  },

  // ==========================================
  // KALI TOOLS & MAINTENANCE (5 questions)
  // ==========================================
  {
    id: 'kali-1',
    categoryId: 'kali-tools',
    question: 'What official Kali utility lets you quickly toggle Undercover Mode (making your desktop look like Windows 10)?',
    options: ['kali-tweaks', 'apt-get windows', 'xfce-theme-win', 'chtheme undercover'],
    correctIndex: 0,
    explanation: '`kali-tweaks` is the official menu for Undercover Mode, ZSH configurations, virtualization guest tools, and bleeding-edge repos.',
  },
  {
    id: 'kali-2',
    categoryId: 'kali-tools',
    question: 'What is the recommended command to perform a full system and tool upgrade on Kali Linux rolling release?',
    options: ['sudo apt update && sudo apt full-upgrade -y', 'sudo apt-get install all', 'kali-system-update', 'pacman -Syu'],
    correctIndex: 0,
    explanation: '`apt full-upgrade` intelligently removes obsolete packages and manages complex dependency shifts during rolling updates.',
  },
  {
    id: 'kali-3',
    categoryId: 'kali-tools',
    question: 'What is Kali NetHunter?',
    options: [
      'An Android-based penetration testing platform that runs Kali Linux chroot tools on mobile hardware',
      'A software program that hunts for animals on the internet',
      'A hardware router sold by OffSec',
      'A password cracking website',
    ],
    correctIndex: 0,
    explanation: 'NetHunter brings Kali Linux onto Android devices, supporting BadUSB, HID keyboard attacks, wireless frame injection, and KeX desktop VNC.',
  },
  {
    id: 'kali-4',
    categoryId: 'kali-tools',
    question: 'If Kali fails to copy/paste or resize dynamically inside VirtualBox, what package should you verify is installed?',
    options: ['virtualbox-guest-x11', 'wine', 'vlc', 'nmap-gui'],
    correctIndex: 0,
    explanation: '`virtualbox-guest-x11` (or `open-vm-tools-desktop` for VMware) enables seamless mouse integration, bidirectional clipboard, and auto-resize.',
  },
  {
    id: 'kali-5',
    categoryId: 'kali-tools',
    question: 'What is the default non-root username and password on modern Kali Linux official VM images?',
    options: ['kali / kali', 'root / toor', 'admin / admin', 'user / password'],
    correctIndex: 0,
    explanation: 'Since Kali 2020.1, Kali default credentials are `kali` for username and `kali` for password, transitioning away from the default root user.',
  },
];
