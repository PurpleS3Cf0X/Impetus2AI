
# Impetus2AI ⚡
### Next-Gen AI-Powered Autonomous Security Platform

![Version](https://img.shields.io/badge/version-1.0.3-accent)
![Status](https://img.shields.io/badge/status-production-success)
![Platform](https://img.shields.io/badge/platform-web--container-blue)
![License](https://img.shields.io/badge/license-MIT-gray)

**Impetus2AI** is a cutting-edge, containerized-style platform designed to democratize penetration testing and security auditing. By leveraging advanced Large Language Models (LLMs) like **Google Gemini Pro** and **Claude 3.5 Sonnet**, it simulates a fully functional **Kali Linux** environment capable of autonomous reasoning, tool execution, and comprehensive reporting.

---

## 📹 Product Demo
<img width="1687" height="803" alt="Screenshot 2025-12-04 at 3 48 42 PM" src="https://github.com/user-attachments/assets/f6de4b60-c861-472d-8e97-2089be45341d" />

> *Watch Impetus2AI in action: From target acquisition to automated exploitation and reporting.*

[![Impetus2AI Demo](https://img.youtube.com/vi/placeholder/maxresdefault.jpg)](https://your-demo-video-link.com)

*(Click the banner above to view the walkthrough)*

---

## 🚀 Key Features

### 🧠 Autonomous Cyber Agents
- **Dual-Mode Operation**:
  - **Shell Mode**: Interact with the AI as a standard Linux terminal (ZSH/Bash).
  - **Auto-Pilot Mode**: Assign a high-level objective (e.g., *"Audit scanme.nmap.org for vulnerabilities"*) and watch the agent plan, execute, and iterate autonomously.
- **Multi-Model Support**: Seamlessly switch between **Gemini 2.5 Flash** (Speed), **Gemini 3 Pro** (Deep Reasoning), and **Claude 3.5 Sonnet** (Coding/Agentic).

### 🖥️ High-Fidelity Terminal Emulator
- **Realistic TTY**: Features syntax highlighting (PrismJS), command history, ANSI escape code handling, and raw shell formatting.
- **Virtual Filesystem**: Simulates a Kali Linux directory structure (`/usr/bin`, `/var/log`), giving agents a grounded environment.
- **Visual "Thinking" Blocks**: Clearly distinguishes between the AI's internal reasoning/planning phase and the actual command execution.

### 📂 Intelligent Artifact Management
- **Auto-Capture**: Automatically detects generated files (scan reports, Python scripts, JSON logs) from the terminal stream.
- **Live Preview**: Inspect captured data instantly in a VS Code-style editor.
- **Local Persistence**: Save artifacts to local storage or download them as raw files.

### 📊 Strategic Reporting Engine
- **One-Click Generation**: Transform raw technical findings into industry-standard documents.
- **Audience-Tailored**:
  - **Executive Summary**: Focuses on business risk and high-level impact.
  - **Technical Report**: Includes reproduction steps, CVSS estimates, and remediation code.
  - **Full Audit**: A comprehensive merge of both.
- **Markdown Export**: Reports are generated in clean Markdown for easy integration with other tools.

### 🛡️ MITRE ATT&CK Mapping
- **Attack Scenarios Library**: Pre-configured templates mapped to specific Tactic and Technique IDs (e.g., T1595 Active Scanning).
- **Visual Coverage**: Dashboard visualization showing your operational coverage across the MITRE framework.

---

## 🛠️ Architecture & Tech Stack

Impetus2AI is built as a **Client-Side SPA (Single Page Application)** to ensure privacy and low latency, communicating directly with AI provider APIs.

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **State Management**: React Hooks + LocalStorage Persistence
- **AI Integration**: Google GenAI SDK (`@google/genai`)
- **Terminal Rendering**: Custom Stream Parser + PrismJS
- **Routing**: React Router DOM v7

---

## 🏁 Getting Started

### Prerequisites
- A modern web browser (Chrome/Edge/Firefox).
- A valid **Google Gemini API Key** (Required).
- (Optional) Anthropic API Key for Claude features.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/impetus2ai.git
   cd impetus2ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Access the platform:**
   Open `http://localhost:3000` in your browser.

---

## 📖 Usage Guide

### 1. Configuration
Navigate to **Settings** (`/settings`).
- **Gemini CLI**: Ensure your environment API Key is detected.
- **Claude Code**: Enable the toggle and input your Anthropic key if needed.
- **Shell Preference**: Choose between `/bin/zsh` or `/bin/bash` for your agent's persona.

### 2. Launching an Operation
- Go to **Sessions** -> **New Session**.
- Enter a **Target** (e.g., `192.168.1.50`) and an **Objective**.
- Select your AI Agent.
- Click **Deploy Session Container**. The terminal will boot and automatically begin the mission.

### 3. Attack Scenarios
- Use the **Attack Scenarios** library to load pre-built templates.
- Hover over the **MITRE ID** column to see specific technique names.
- Click **Run** to instantly hydrate a new session with that scenario's tools and prompts.

### 4. Analyzing Data
- **Console**: Watch the live execution.
- **Artifacts**: Click the folder tab to browse files created by the agent (scans, code).
- **Reports**: Generate a PDF-ready Markdown report to finalize the engagement.

---

## ⚠️ Legal Disclaimer

**Impetus2AI is a security tool intended for authorized penetration testing, educational purposes, and defensive security research only.**

Usage of this tool for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state, and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program.

---

*Built with ❤️ by the Impetus2AI Team.*
