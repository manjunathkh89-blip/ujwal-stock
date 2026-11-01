import { LabTarget } from '../types';

export const LAB_TARGETS: LabTarget[] = [
  {
    name: 'Metasploitable 2',
    type: 'local-vm',
    difficulty: 'Beginner',
    description: 'An intentionally vulnerable Ubuntu Linux virtual machine designed for training on network services, default passwords, and known CVE exploits.',
    setupInstructions: [
      'Download the official Metasploitable 2 zip file from SourceForge.',
      'Unzip and open the `.vmdk` or `.ovf` virtual appliance in VirtualBox or VMware Workstation.',
      'CRITICAL: Configure the network adapter to "Host-Only Adapter" (or "Internal Network"). NEVER set to Bridged or NAT on public Wi-Fi!',
      'Start the VM. Default login credentials are `msfadmin` : `msfadmin`.',
      'Run `ip addr` inside Metasploitable to find its IP, then scan it from your Kali VM using `nmap -sC -sV <IP>`.',
    ],
    keyLearning: 'Vulnerable daemons (vsftpd 2.3.4 backdoor, Samba usermap script, Tomcat manager default credentials, distcc exploit).',
  },
  {
    name: 'DVWA (Damn Vulnerable Web App)',
    type: 'web-lab',
    difficulty: 'Beginner',
    description: 'A PHP/MySQL web application created to be extremely vulnerable, with toggleable difficulty levels (Low, Medium, High, Impossible).',
    setupInstructions: [
      'Install Docker on Kali: `sudo apt update && sudo apt install -y docker.io`.',
      'Start the Docker daemon: `sudo systemctl start docker`.',
      'Run DVWA in a sandboxed container: `sudo docker run --rm -it -p 8080:80 vulnerables/web-dvwa`.',
      'Open your Kali web browser and navigate to `http://127.0.0.1:8080`.',
      'Click "Create / Reset Database", then log in with username `admin` and password `password`.',
      'Go to "DVWA Security" and set difficulty to "Low" to start practicing SQL injection, XSS, and command injection.',
    ],
    keyLearning: 'SQL Injection, Cross-Site Scripting (XSS), Command Execution, File Inclusion, and CSRF.',
  },
  {
    name: 'TryHackMe (THM)',
    type: 'online-platform',
    difficulty: 'Beginner',
    url: 'https://tryhackme.com',
    description: 'Hands-on guided cybersecurity training rooms with browser-based attack machines or private OpenVPN connectivity into isolated target networks.',
    setupInstructions: [
      'Create a free account on tryhackme.com.',
      'Navigate to the "Access" page and download your personal OpenVPN configuration file (`username.ovpn`).',
      'Connect from Kali terminal: `sudo openvpn username.ovpn`. Look for "Initialization Sequence Completed".',
      'Start beginner rooms: "Pre-Security", "Complete Beginner Pathway", and "Junior Penetration Tester".',
      'Deploy target machines on the THM webpage and interact directly using the 10.10.x.x target IP.',
    ],
    keyLearning: 'Structured CTF rooms, Linux & Windows basics, guided offensive & defensive walkthroughs.',
  },
  {
    name: 'Hack The Box (HTB)',
    type: 'online-platform',
    difficulty: 'Intermediate',
    url: 'https://www.hackthebox.com',
    description: 'Massive gamified cybersecurity ecosystem featuring realistic vulnerable machines, active directory labs, and Pro Labs.',
    setupInstructions: [
      'Sign up at hackthebox.com and head to HTB Labs.',
      'Download your Lab VPN pack for Starting Point or Machines.',
      'Run `sudo openvpn lab_username.ovpn` on your Kali machine.',
      'Start with the "Starting Point" tier (Tier 0 -> Tier 2: Meow, Fawn, Dancing, Vaccine) for gentle onboarding.',
      'Progress to Easy and Medium Active Machines, capturing the `user.txt` and `root.txt` flags.',
    ],
    keyLearning: 'Real-world enterprise penetration testing, Active Directory attacks, binary exploitation, and reverse engineering.',
  },
  {
    name: 'VulnHub',
    type: 'local-vm',
    difficulty: 'Intermediate',
    url: 'https://www.vulnhub.com',
    description: 'A community repository of downloadable custom vulnerable virtual machine disk images for offline CTF practice.',
    setupInstructions: [
      'Download popular beginner VMs such as Kioptrix Level 1, Basic Pentesting, or Mr-Robot.',
      'Import into VirtualBox and set network mode to "Host-Only Adapter" under Settings > Network.',
      'Configure your Kali Linux VM to the exact same Host-Only network subnet so they can communicate.',
      'Use `sudo arp-scan -l` or `netdiscover` on Kali to detect the new VM\'s IP address automatically.',
      'Begin reconnaissance with Nmap and proceed to web or service exploitation.',
    ],
    keyLearning: 'Realistic black-box penetration testing without walkthrough hand-holding in a 100% offline sandbox.',
  },
];

export const VIRTUALBOX_GUIDE = {
  title: 'Setting Up an Isolated VirtualBox Penetration Testing Lab',
  steps: [
    {
      step: 1,
      title: 'Download & Install VirtualBox',
      detail: 'Download Oracle VirtualBox and the VirtualBox Extension Pack from virtualbox.org. Install on your host OS (Windows, macOS, or Linux).',
    },
    {
      step: 2,
      title: 'Download Kali Linux Pre-built VM',
      detail: 'Visit kali.org/get-kali/ and select "Virtual Machines". Download the official 64-bit VirtualBox appliance (.7z or .ova). This saves hours compared to manual ISO installation!',
    },
    {
      step: 3,
      title: 'Extract & Import Kali VM',
      detail: 'Extract the downloaded archive using 7-Zip or tar. Double-click the `.vbox` file to open it directly in VirtualBox. Allocate at least 2 CPU cores and 4GB RAM (8GB recommended).',
    },
    {
      step: 4,
      title: 'CRITICAL: Configure Host-Only Isolated Network',
      detail: 'To ensure target vulnerabilities NEVER touch your home Wi-Fi: In VirtualBox, go to Tools > Network Manager > Host-only Networks. Create `vboxnet0` (e.g., 192.168.56.1/24 with DHCP enabled). In both Kali and Target VM settings, set Adapter 2 to Host-only `vboxnet0`.',
    },
    {
      step: 5,
      title: 'Take a Baseline Snapshot',
      detail: 'Before running any exploit or installing messy tools, select your Kali VM, click "Snapshots", and create "Clean Baseline". If anything ever breaks, you can restore state in 2 seconds!',
    },
  ],
};
