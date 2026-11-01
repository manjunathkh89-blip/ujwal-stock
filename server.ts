import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with recommended model and headers
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Security AI coding advice fallback library (offline-friendly)
function getOfflineFallbackAdvice(prompt: string, commandName?: string): string {
  const p = prompt.toLowerCase();

  // Python Directory / Web Fuzzer
  if (p.includes('dir') || p.includes('fuzz') || p.includes('url') || p.includes('gobuster') || p.includes('web')) {
    return `\`\`\`python
#!/usr/bin/env python3
import sys
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor

def check_path(base_url, word):
    url = f"{base_url.rstrip('/')}/{word.strip()}"
    req = urllib.request.Request(
        url,
        headers={'User-Agent': 'Mozilla/5.0 (Kali-Linux-Security-Audit/1.0)'}
    )
    try:
        with urllib.request.urlopen(req, timeout=3.0) as resp:
            code = resp.getcode()
            if code in [200, 204, 301, 302, 401, 403]:
                print(f"[+] Status {code} -> {url}")
    except urllib.error.HTTPError as e:
        if e.code in [401, 403]:
            print(f"[!] Access Denied ({e.code}) -> {url}")
    except Exception:
        pass

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 dir_fuzzer.py <http://target-ip-or-domain> [wordlist.txt]")
        sys.exit(1)

    target_url = sys.argv[1]
    wordlist = sys.argv[2] if len(sys.argv) > 2 else None
    
    # Common directory paths fallback
    words = ['admin', 'login', 'api', 'v1', 'dashboard', 'config', 'backup', 'uploads', 'robots.txt', '.env', 'server-status']
    if wordlist:
        try:
            with open(wordlist, 'r', errors='ignore') as f:
                words = [line.strip() for line in f if line.strip() and not line.startswith('#')]
        except IOError as e:
            print(f"[-] Could not read wordlist: {e}. Using default wordlist.")

    print(f"[*] Starting directory fuzzing against {target_url} ({len(words)} paths)...")
    with ThreadPoolExecutor(max_workers=10) as executor:
        for w in words:
            executor.submit(check_path, target_url, w)

if __name__ == '__main__':
    main()
\`\`\`

**How to Run:**
\`\`\`bash
python3 dir_fuzzer.py http://192.168.1.100
# Or with a custom wordlist:
python3 dir_fuzzer.py http://192.168.1.100 /usr/share/wordlists/dirb/common.txt
\`\`\`

**Prerequisites:** Python 3 standard library (no external \`pip\` packages needed).`;
  }

  // Python Packet Sniffer / Raw Socket
  if (p.includes('sniff') || p.includes('packet') || p.includes('raw') || p.includes('wireshark') || p.includes('tcpdump')) {
    return `\`\`\`python
#!/usr/bin/env python3
import socket
import struct
import sys

def unpack_ethernet(data):
    dest_mac, src_mac, proto = struct.unpack('! 6s 6s H', data[:14])
    dest_str = ':'.join(f'{b:02x}' for b in dest_mac)
    src_str = ':'.join(f'{b:02x}' for b in src_mac)
    return dest_str, src_str, socket.htons(proto), data[14:]

def unpack_ipv4(data):
    version_header_length = data[0]
    header_length = (version_header_length & 15) * 4
    ttl, proto, src, target = struct.unpack('! 8x B B 2x 4s 4s', data[:20])
    src_ip = socket.inet_ntoa(src)
    dest_ip = socket.inet_ntoa(target)
    return proto, src_ip, dest_ip, data[header_length:]

def main():
    print("[*] Starting raw socket network sniffer (requires sudo/root)...")
    try:
        # AF_PACKET is Linux-specific for raw link-layer captures
        conn = socket.socket(socket.AF_PACKET, socket.SOCK_RAW, socket.ntohs(3))
    except PermissionError:
        print("[-] Root privileges required. Run with: sudo python3 sniffer.py", file=sys.stderr)
        sys.exit(1)

    try:
        while True:
            raw_data, _ = conn.recvfrom(65536)
            dest_mac, src_mac, eth_proto, data = unpack_ethernet(raw_data)
            
            # 8 = IPv4 protocol
            if eth_proto == 8:
                proto, src_ip, dest_ip, payload = unpack_ipv4(data)
                proto_name = {6: 'TCP', 17: 'UDP', 1: 'ICMP'}.get(proto, f'Proto({proto})')
                print(f"[{proto_name:<4}] {src_ip:<15} -> {dest_ip:<15} | Length: {len(payload)} bytes")
    except KeyboardInterrupt:
        print("\\n[*] Sniffer terminated cleanly by user.")

if __name__ == '__main__':
    main()
\`\`\`

**How to Run:**
\`\`\`bash
sudo python3 sniffer.py
\`\`\`

**Prerequisites:** Linux root privileges (\`sudo\`) for \`AF_PACKET\` raw socket creation.`;
  }

  // Password Hash Cracker (MD5 / SHA256)
  if (p.includes('hash') || p.includes('crack') || p.includes('md5') || p.includes('sha') || p.includes('password')) {
    return `\`\`\`python
#!/usr/bin/env python3
import hashlib
import sys

def identify_hash_type(hash_str):
    length = len(hash_str.strip())
    if length == 32:
        return 'md5'
    elif length == 40:
        return 'sha1'
    elif length == 64:
        return 'sha256'
    elif length == 128:
        return 'sha512'
    return 'unknown'

def crack_hash(target_hash, wordlist_path):
    target_hash = target_hash.strip().lower()
    algo = identify_hash_type(target_hash)
    if algo == 'unknown':
        print(f"[-] Unsupported hash length ({len(target_hash)}). Supported: MD5, SHA1, SHA256, SHA512.")
        return None

    print(f"[*] Detected Hash Algorithm: {algo.upper()}")
    print(f"[*] Searching wordlist: {wordlist_path}...")

    attempts = 0
    try:
        with open(wordlist_path, 'r', encoding='latin-1', errors='ignore') as f:
            for line in f:
                attempts += 1
                word = line.strip()
                h = hashlib.new(algo, word.encode('utf-8')).hexdigest()
                if h == target_hash:
                    print(f"\\n[+] PASSWORD CRACKED: '{word}' (after {attempts} attempts)")
                    return word
                if attempts % 50000 == 0:
                    print(f"[*] Tested {attempts:,} candidates...", end='\\r')
        print(f"\\n[-] Exhausted wordlist ({attempts:,} words). Hash not found.")
        return None
    except FileNotFoundError:
        print(f"[-] Wordlist file not found: {wordlist_path}", file=sys.stderr)
        return None

def main():
    if len(sys.argv) < 3:
        print("Usage: python3 hash_cracker.py <target_hash> <wordlist_path>")
        print("Example: python3 hash_cracker.py 5d41402abc4b2a76b9719d911017c592 /usr/share/wordlists/rockyou.txt")
        sys.exit(1)

    crack_hash(sys.argv[1], sys.argv[2])

if __name__ == '__main__':
    main()
\`\`\`

**How to Run:**
\`\`\`bash
python3 hash_cracker.py 5d41402abc4b2a76b9719d911017c592 /usr/share/wordlists/rockyou.txt
\`\`\`

**Prerequisites:** Python 3 standard library (\`hashlib\`).`;
  }

  // Python Port Scanner
  if (p.includes('python') || p.includes('socket') || p.includes('port scan') || p.includes('scanner')) {
    return `\`\`\`python
#!/usr/bin/env python3
import socket
import sys
from concurrent.futures import ThreadPoolExecutor

def scan_port(target_host, port):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(1.0) # 1 second timeout
            result = s.connect_ex((target_host, port))
            if result == 0:
                try:
                    s.sendall(b'HEAD / HTTP/1.0\\r\\n\\r\\n')
                    banner = s.recv(1024).decode('utf-8', errors='ignore').strip()
                    first_line = banner.split('\\n')[0] if banner else 'No banner'
                    print(f"[+] Port {port:<5} OPEN | Banner: {first_line}")
                except Exception:
                    print(f"[+] Port {port:<5} OPEN | (No banner returned)")
    except (socket.timeout, ConnectionRefusedError):
        pass
    except Exception:
        pass

def main():
    target = sys.argv[1] if len(sys.argv) > 1 else '127.0.0.1'
    ports = [21, 22, 23, 25, 53, 80, 110, 139, 443, 445, 1433, 3306, 3389, 8080, 8443]
    print(f"[*] Starting multi-threaded scan against {target} across {len(ports)} common ports...")

    with ThreadPoolExecutor(max_workers=10) as executor:
        for port in ports:
            executor.submit(scan_port, target, port)

if __name__ == '__main__':
    main()
\`\`\`

**How to Run:**
\`\`\`bash
python3 port_scanner.py 192.168.1.1
\`\`\`

**Prerequisites:** Python 3 standard library (\`socket\`, \`concurrent.futures\`).`;
  }

  // Bash ping sweep
  if (p.includes('bash') || p.includes('ping') || p.includes('sweep') || p.includes('loop')) {
    return `\`\`\`bash
#!/bin/bash
# Subnet Live Host Discoverer
# Usage: ./pingsweep.sh 192.168.1

SUBNET="\${1:-192.168.1}"
OUTPUT_FILE="alive_hosts_\$(date +%Y%m%d).txt"

echo "[*] Scanning subnet \${SUBNET}.0/24 in parallel..."
> "\$OUTPUT_FILE"

# Loop through IPs 1 to 254 in parallel batches
for host in {1..254}; do
    (
        TARGET="\${SUBNET}.\${host}"
        # -c 1: send 1 packet, -W 1: 1 second timeout
        if ping -c 1 -W 1 "\$TARGET" > /dev/null 2>&1; then
            echo "[+] Host alive: \$TARGET"
            echo "\$TARGET" >> "\$OUTPUT_FILE"
        fi
    ) &

    # Throttle concurrency to 50 simultaneous background forks
    if (( host % 50 == 0 )); then
        wait
    fi
done

wait # Ensure all background child forks finish
echo "[*] Scan complete. Found \$(wc -l < "\$OUTPUT_FILE") alive hosts. Saved to \$OUTPUT_FILE."
\`\`\`

**How to Run:**
\`\`\`bash
chmod +x pingsweep.sh
./pingsweep.sh 192.168.1
\`\`\`

**Prerequisites:** Standard Linux bash & iputils-ping.`;
  }

  return `\`\`\`python
#!/usr/bin/env python3
import subprocess
import sys

def execute_security_command(cmd_args):
    """Executes system security tools with proper timeout and error boundary."""
    try:
        res = subprocess.run(
            cmd_args,
            capture_output=True,
            text=True,
            check=True,
            timeout=30
        )
        return res.stdout
    except subprocess.CalledProcessError as e:
        print(f"[-] Execution failed (Code {e.returncode}): {e.stderr}", file=sys.stderr)
        return None
    except subprocess.TimeoutExpired:
        print("[-] Process timed out after 30 seconds", file=sys.stderr)
        return None

if __name__ == '__main__':
    target = sys.argv[1] if len(sys.argv) > 1 else '127.0.0.1'
    print(f"[*] Running automated security probe on: {target}")
    output = execute_security_command(['nmap', '-sS', '-sV', '-T4', '-p', '22,80,443', target])
    if output:
        print(output)
\`\`\`

**How to Run:**
\`\`\`bash
python3 audit_tool.py 192.168.1.1
\`\`\`

**Prerequisites:** Python 3 and target security binary installed.`;
}

// Generic offline response generator for security questions and coding
function getOfflineSecurityKnowledge(prompt: string, category: 'code' | 'question' | 'general' = 'general'): string {
  const p = prompt.toLowerCase();

  // Concept: Port scanning & TCP
  if (p.includes('syn') || p.includes('three-way') || p.includes('handshake') || p.includes('connect')) {
    return `### TCP Three-Way Handshake & Scan Mechanics Explained

In standard networking, TCP establishes connections via a 3-step synchronization process:
1. **SYN (Synchronize)**: Client sends packet with SYN flag set to request a connection.
2. **SYN-ACK (Synchronize-Acknowledge)**: Server acknowledges and sends its own SYN flag back.
3. **ACK (Acknowledge)**: Client responds with ACK, opening the socket for data exchange.

#### TCP Full Connect (-sT) vs. Stealth SYN Scan (-sS):
* **Stealth SYN Scan (\`nmap -sS\`)**: Sends SYN. If server responds SYN-ACK, Nmap immediately sends **RST (Reset)** to tear down the connection before it completes. Because the 3-way handshake is never completed, older intrusion detection systems (IDS) and application logs (like Apache/Nginx) often do not log a connection.
* **TCP Connect Scan (\`nmap -sT\`)**: Completes the full 3-way handshake using the OS \`connect()\` syscall. It requires no root privileges, but creates a logged connection on the target.

**Security Pro Tip:** Modern firewalls inspect stateful packet tables (conntrack), so half-open SYN packets from single IPs are quickly detected unless randomized with \`-D RND:5\` (decoys) or fragmented with \`-f\`.`;
  }

  // Concept: SQL Injection
  if (p.includes('sql') || p.includes('sqli') || p.includes('injection')) {
    return `### Understanding SQL Injection (SQLi)

SQL Injection happens when untrusted user input is directly concatenated into a dynamic SQL database query string without input sanitization or parameterization.

#### Vulnerable Pattern Example:
\`\`\`sql
-- Backend PHP/Node code doing string concatenation:
SELECT * FROM users WHERE username = 'admin' AND password = '$userPassword'
\`\`\`
If an attacker enters: \`' OR '1'='1\`
The resultant executed query becomes:
\`\`\`sql
SELECT * FROM users WHERE username = 'admin' AND password = '' OR '1'='1'
\`\`\`
Because \`'1'='1'\` evaluates to TRUE, the query returns user records regardless of password match!

#### How to Prevent SQLi (Gold Standard):
1. **Parameterized Queries / Prepared Statements**: Never concatenate strings. The database driver compiles the query structure first, then treats inputs strictly as parameter values, completely neutralizing injection.
2. **Input Validation & Allowlisting**: Enforce regex checks on expected formats (e.g., UUIDs, integers).
3. **ORM (Object Relational Mapping)**: Use ORMs like Prisma, Drizzle, or SQLAlchemy that enforce parameter binding under the hood.`;
  }

  // Coding request: Python socket or scanner
  if (p.includes('python') || p.includes('socket') || p.includes('port scan') || category === 'code') {
    return getOfflineFallbackAdvice(prompt);
  }

  // General Linux/Kali Troubleshooting
  if (p.includes('wifi') || p.includes('adapter') || p.includes('monitor') || p.includes('airmon')) {
    return `### Troubleshooting Wi-Fi Adapters & Monitor Mode in Kali Linux

If your wireless interface is not entering monitor mode or dropping packets, follow this standard troubleshooting sequence:

#### Step 1: Verify Hardware Detection
\`\`\`bash
# Check if the USB adapter chipset is recognized
lsusb
# Check interface names (usually wlan0 or wlan1)
ip link show
\`\`\`

#### Step 2: Kill Conflicting Background Network Daemons
NetworkManager and wpa_supplicant frequently reset wireless channels during packet capture:
\`\`\`bash
sudo airmon-ng check kill
\`\`\`

#### Step 3: Enable Monitor Mode
\`\`\`bash
sudo airmon-ng start wlan0
# Verify that the interface changed to wlan0mon
iwconfig
\`\`\`

#### What NOT to Do:
- Do not run scans on congested 5GHz channels without an adapter supporting 802.11ac dual-band chipsets (e.g., Alfa AWUS036ACH or Realtek RTL8812AU).
- Never test unauthorized SSIDs; broadcast test SSIDs on your isolated home router for practice.`;
  }

  // Default deep cybersecurity answer
  return `### DracoSec Cyber Defense Intelligence: ${prompt.slice(0, 50)}...

#### Technical Analysis & Methodology
In professional penetration testing and security operations (SecOps), understanding tool internals and protocol mechanics is paramount:

1. **Reconnaissance & Enumeration**: Always establish target boundary constraints. Passive recon (OSINT, DNS records via \`theHarvester\`, \`dig\`) must precede active scanning (\`nmap\`, \`nikto\`).
2. **Noise Reduction**: High-rate scanning triggers SOC automated IP blocks and IDS/IPS alerts. Use rate limiting (\`--max-rate 50\`) and randomized timing templates.
3. **Data Integrity & Documentation**: Always log commands and pipe output to timestamped files using \`tee\` or tool logging flags (\`-oN\`, \`-oJ\`).

#### Recommended Workflow / Scripting Tip:
When scripting Kali tasks in Python or Bash:
- Catch \`KeyboardInterrupt\` (Ctrl+C) gracefully to flush buffers and close open file descriptors.
- Enforce strict parameter validation before passing arguments to system processes.
- Test workflows exclusively in sandboxed environments like VirtualBox, Docker, or TryHackMe.`;
}

// AI Coding Advice & Security Question Endpoint
app.post(['/api/ai/coding-advice', '/api/ai/ask'], async (req: Request, res: Response) => {
  try {
    const { prompt, commandName, mode = 'general', history = [] } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'A prompt string is required.' });
      return;
    }

    // If Gemini client is available, call the API
    if (ai) {
      try {
        const isCodingRequest = mode === 'code' || mode === 'direct-code' || /code|script|write|create|python|bash|golang|generate|exploit|scanner/i.test(prompt);

        const systemInstruction = isCodingRequest
          ? `You are "DracoSec Direct Code Engine", a senior cybersecurity exploit and automation engineer for "DracoSec: Kali Linux Command Codex" (Delivered by Manjunath KH).

CRITICAL DIRECT CODING MANDATE:
1. OUTPUT THE COMPLETE, RUNNABLE, PRODUCTION-GRADE SCRIPT DIRECTLY ON THE FIRST LINE.
2. DO NOT include any conversational preamble, filler, greetings, or polite chatter (NEVER say "Sure!", "Here is the code you requested", "Certainly!").
3. Always wrap the code in a markdown block with the exact language identifier (\`\`\`python, \`\`\`bash, \`\`\`go, \`\`\`c, \`\`\`powershell).
4. The code must be 100% complete, fully implemented, and executable with realistic imports, command-line arguments (sys.argv/argparse), timeout safety, error catches, and helpful inline comments. Never use lazy placeholders like '# TODO: implement' or '# add logic here'.
5. Directly below the closing \`\`\` code fence, provide:
   - **How to Run**: exact terminal command (e.g. \`chmod +x script.sh && ./script.sh <args>\` or \`python3 script.py <target>\`).
   - **Dependencies**: exact \`pip install ...\` or \`apt install ...\` commands if any.
   - **Security / Execution Tip**: 1-2 bullet points explaining critical flags or common pitfalls.`
          : `You are "DracoSec AI", an elite senior cybersecurity engineer, Linux kernel specialist, and ethical hacking instructor for the platform "DracoSec: Kali Linux Command Codex" (Delivered by Manjunath KH).

Your responsibilities:
1. Answer ANY user question regarding Kali Linux, ethical hacking, networking protocols, vulnerability assessments, penetration testing methodologies, Linux system administration, and cyber defense.
2. When the user asks for code, output the code DIRECTLY in a formatted code block without conversational delays.
3. Clearly explain how commands and security concepts work in simple, crystal-clear plain English.
4. Emphasize what NOT to do: point out common traps, syntax errors, and safety hazards.
5. Strictly adhere to ethical boundaries: explicitly state that attacks and penetration testing must ONLY be executed on systems owned by the user or with written authorization.`;

        // Build conversation contents including history if provided
        let conversationContents: any[] = [];

        if (Array.isArray(history) && history.length > 0) {
          conversationContents = history.slice(-6).map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content || '' }],
          }));
        }

        const userPromptWithContext = commandName
          ? `[Context Tool: ${commandName}] [Mode: ${mode}]\n${prompt}`
          : `[Mode: ${mode}]\n${prompt}`;

        conversationContents.push({
          role: 'user',
          parts: [{ text: userPromptWithContext }],
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: conversationContents,
          config: {
            systemInstruction,
          },
        });

        const textOutput = response.text;
        if (textOutput && textOutput.trim().length > 0) {
          res.json({
            advice: textOutput,
            source: 'gemini-3.8-flash',
          });
          return;
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call warning, falling back to local security knowledge engine:', geminiError?.message || geminiError);
        // Fall back to offline knowledge engine
      }
    }

    // Fallback response if no API key or on error
    const fallback = getOfflineSecurityKnowledge(prompt, mode as any);
    res.json({
      advice: fallback,
      source: 'dracosec-offline-knowledge-engine',
    });
  } catch (error: any) {
    console.error('API Error:', error);
    res.status(500).json({
      error: 'An unexpected error occurred while generating security advice.',
      details: error?.message,
    });
  }
});

// In development, hook Vite middleware; in production, serve built static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kali Linux Learning Hub server running on port ${PORT}`);
  });
}

startServer();
