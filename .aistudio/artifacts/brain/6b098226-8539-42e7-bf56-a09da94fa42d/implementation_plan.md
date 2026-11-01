# Implementation Plan: DracoSec Command Practice Mode

## Overview
Build an interactive **Command Practice Mode** for **DracoSec: Kali Linux Command Codex**. In this mode, security engineers and ethical hackers are assigned tactical scenarios (e.g., finding hidden directories, detecting SUID binaries, scanning network subnets, extracting password hashes, and analyzing web headers). Users interact directly with an authentic Kali Linux simulated CLI, receiving realistic command output, step validation, progressive hints, and rank progression.

---

## User Review Required
> [!IMPORTANT]
> The clarifying questions were skipped, so we are proceeding with the recommended specifications:
> 1. **Structure**: Curated step-by-step CTF-style Mission Tracks (Beginner Recon & File Discovery, Intermediate Network Enumeration, Advanced Privilege Escalation, and Web Exploitation).
> 2. **Validation**: Intelligent command & argument parsing with semantic regex, realistic terminal outputs, and dynamic status flags.
> 3. **Curriculum**: Full-spectrum Kali offensive security workflows.

---

## Proposed Changes & Architecture

### 1. Scenario Data Engine (`src/data/scenarios.ts`)
Create a comprehensive scenario collection covering essential offensive security tasks:
- **Scenario Definition Interface**:
  - `id`: Unique identifier (e.g., `recon-hidden-dirs`, `suid-privesc`, `nmap-service-detect`, `hash-identification`).
  - `title`: Tactical mission title.
  - `track`: Category track (`recon`, `web`, `system`, `privesc`, `network`).
  - `difficulty`: `Beginner` | `Intermediate` | `Advanced`.
  - `briefing`: Narrative mission background (e.g., "Target compromised server `corp-internal-01` has suspected hidden deployment scripts...").
  - `objective`: Clear user task (e.g., "Find all hidden files and directories in the `/var/www/internal` directory including permission metadata").
  - `simulatedPath`: Current simulated working directory (e.g., `kali@dracosec:~/targets/corp-internal$`).
  - `acceptedCommands`: Array of regex patterns or valid command patterns accepting common alias/flag permutations (e.g., `ls -la`, `ls -al`, `ls -a -l`, `find . -name ".*"`).
  - `expectedOutput`: High-fidelity terminal output mimicking Kali Linux tools (`ls -la`, `find`, `nmap`, `gobuster`, `hashcat`, etc.).
  - `failFeedback`: Specific error tips if typical mistakes are made (e.g., forgetting `-a` flag for hidden files).
  - `hints`: 3 progressive hints (from vague direction -> flag clue -> exact syntax breakdown).
  - `solutionExplanation`: In-depth breakdown explaining the security rationale, why the flags are used, and MITRE ATT&CK / real-world relevance.
  - `xp`: Experience points earned upon completion.

### 2. Interactive Practice View (`src/components/CommandPractice.tsx`)
Create a responsive, dual-pane cybersecurity challenge terminal:
- **Left Panel (Mission Briefing & Objectives)**:
  - Track & difficulty badge.
  - Mission briefing with high-contrast tactical styling.
  - Interactive objective checklist with real-time completion state.
  - Progressive Hint Drawer (reveals Hint 1, 2, 3 on demand with hint usage tracking).
  - Solution toggle (accessible after attempts or on request with confirmation).
  - Progress tracker (completed scenarios, earned XP, Hacker Rank badge: Script Novice -> Recon Specialist -> Cyber Operator -> Apex Dragon).
- **Right Panel (Kali Interactive Terminal Sandbox)**:
  - Embedded responsive terminal with custom command prompt (`kali@dracosec:~$`).
  - Command input with auto-focus, history navigation (Up/Down arrows), tab autocomplete for common commands, and `clear` support.
  - Real-time command validation engine:
    - Parses input, checks against regex rules and semantic criteria.
    - Emits authentic tool output (e.g., formatted tables, port lists, colored permissions).
    - Plays subtle audio/visual success indicators (cyan glow pulse, success sound).
  - "Ask DracoAI for Hint" integration: 1-click bridge that allows users to ask the AI advisor for guided assistance without giving away the exact solution immediately.

### 3. Header & Navigation Updates (`src/components/Header.tsx` & `src/App.tsx`)
- Add `'practice'` to `ActiveTab` type.
- Add **"Practice"** tab in the main header with a tactical target / terminal icon and badge indicator.
- Support deep-linking from Command Cards: users browsing commands in the Codex (e.g., `find`, `nmap`, `gobuster`) can click a "Practice this command in Lab" button to launch directly into the relevant scenario.
- Persist scenario progress, completed IDs, and earned badges in `localStorage` (`dracosec_practice_progress`).

---

## Verification Plan

### Automated Build Verification:
1. Run `compile_applet` to ensure TypeScript compilation succeeds without errors.
2. Run `lint_applet` to check for missing imports or unused declarations.

### Functional Testing in Browser:
1. Open the dev server preview (`http://localhost:3000`).
2. Navigate to the new **Practice** tab from the top navigation.
3. Test Scenario 1 ("Find Hidden Directories & Artifacts"):
   - Enter invalid command (`ls`) -> Verify failure hint or standard listing without secret files.
   - Enter valid command (`ls -la` or `find . -name ".*"`) -> Verify authentic output, objective completed state, XP increment, and success banner.
4. Test Progressive Hint system (verify hints unlock in sequence 1 -> 2 -> 3).
5. Test Track selection (switch between Reconnaissance, System Auditing, Network Scanning, and Web Fuzzing).
6. Test mobile responsiveness (drawer collapsing and clean terminal layout on smaller screens).
7. Test Codex integration: click "Practice in Lab" from a command card in the Codex view and confirm it navigates directly to that scenario.
