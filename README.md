<p align="center">
  <a href="https://sliitcoursewebmcp.kesaru.me/">
    <img src="assets/kesaru-pig-logo-sm.jpg" alt="SLIIT Courseweb MCP Logo" width="80" height="80" style="border-radius: 20px; box-shadow: 0 4px 14px rgba(0,0,0,0.1);">
  </a>
</p>

<h1 align="center">SLIIT Courseweb MCP Server</h1>

<p align="center">
  <b>Connect your Moodle LMS directly into Claude Code, Cursor, Google Antigravity, and Windsurf.</b><br>
  Sync lecture slides, extract exam marks from 100+ page PDFs, and track assignment deadlines in one human prompt.
</p>

<p align="center">
  <a href="https://sliitcoursewebmcp.kesaru.me/"><img src="https://img.shields.io/badge/Live_Website-sliitcoursewebmcp.kesaru.me-18181b?style=flat-square&logo=safari&logoColor=white" alt="Live Website"></a>
  <a href="https://modelcontextprotocol.io/"><img src="https://img.shields.io/badge/MCP-Standard_Compliant-000000?style=flat-square&logo=anthropic&logoColor=white" alt="MCP Compatible"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-20%2B-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js 20+"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="MIT License"></a>
  <a href="https://github.com/kesaruhasun"><img src="https://img.shields.io/badge/Author-Kesaru_Hasun-f59e0b?style=flat-square" alt="Author"></a>
</p>

<p align="center">
  <a href="#-the-problem-statement">Problem</a> •
  <a href="#-watch-the-launch-showcase">Watch Demo</a> •
  <a href="#-1-prompt-agent-self-installation">1-Prompt Install</a> •
  <a href="#-authentication-methods">Login Methods</a> •
  <a href="#-real-superpower-proofs">Superpowers</a> •
  <a href="#-mcp-tools-reference">Tools Reference</a> •
  <a href="#-port-to-your-university">Adapt for Your Uni</a>
</p>

---

## 🎬 Watch the Launch Showcase

> **Experience the SLIIT Courseweb MCP Server in action.** Watch how Claude Code autonomously reads a 103-page marksheet PDF, identifies the student's marks, and syncs course lecture decks in seconds.

<p align="center">
  <video src="https://sliitcoursewebmcp.kesaru.me/assets/courseweb-launch-trailer.mp4" poster="assets/courseweb-launch-poster.jpg" controls="controls" width="100%" style="border-radius: 12px; border: 1px solid #e4e4e7; max-width: 920px;">
    <a href="https://sliitcoursewebmcp.kesaru.me/assets/courseweb-launch-trailer.mp4">
      <img src="assets/courseweb-launch-poster.jpg" alt="Watch Launch Showcase" width="100%" style="border-radius: 12px;">
    </a>
  </video>
  <br>
  <sub><i>Video not playing? <a href="https://sliitcoursewebmcp.kesaru.me/assets/courseweb-launch-trailer.mp4">Direct MP4 Download</a> · <a href="https://sliitcoursewebmcp.kesaru.me/">Explore Interactive Trilingual Website (English / සිංහල / தமிழ்)</a></i></sub>
</p>

---

## 😫 The Problem Statement

If you are a student at SLIIT (or any university using Moodle LMS), your daily workflow looks like this:
1. **Waiting for Courseweb to load** during peak hours or exam submission deadlines.
2. **Navigating through 4 levels of nested folders** just to download Lecture 07 slides.
3. **Downloading massive 103-page marksheet PDFs**, then manually squinting to find your student ID (`ITxxxxxxxx`) among 1,200 classmates.
4. **Missing deadlines** because assignment notifications are buried deep inside separate course modules.

### The MCP Solution
Instead of clicking around a browser, **bring Courseweb directly into your AI coding assistant**. Your AI agent (Claude Code, Cursor, Antigravity, or Windsurf) uses this MCP server to interact with Courseweb in the background.

```
You: "Check my marks for IE2012 in the new PDF and sync today's slides."
AI:  "Found your marks: Question 1: 18/20, Question 2: 24/25. Total: 84%.
      Downloaded 2 new lecture slides to ./Software_Engineering_Notes (skipped 14 unchanged files)."
```

---

## 💡 What is an MCP? (In 1 Sentence)

> **Model Context Protocol (MCP)** is an open standard created by Anthropic that acts like a universal USB port for AI models — allowing coding assistants like Claude, Cursor, and Antigravity to safely query your real-world tools, databases, and websites without custom plugins.

---

## ⚡ 1-Prompt Agent Self-Installation

You don't need to manually write JSON configuration files. Simply **copy the universal prompt below and paste it into your AI assistant** (Claude Code, Antigravity, Cursor, or Windsurf). The AI will configure itself!

### 📋 The Universal Self-Install Prompt

```text
Please install and configure the SLIIT Courseweb MCP server for this workspace.

Repository: https://github.com/kesaruhasun/courseweb_automation.git
Build steps:
1. Clone the repository or inspect local source: cd courseweb_automation && npm install && npm run build
2. Configure your MCP settings:
   - Command: node
   - Args: ["<ABSOLUTE_PATH>/courseweb_automation/build/index.js"]
   - Environment:
       SLIIT_USERNAME: "your_it_number"
       SLIIT_PASSWORD: "your_courseweb_password"
       HEADLESS: "true"
3. Test connectivity by running the `list_modules` tool.
```

---

### Manual Configurations by Agent

<details open>
<summary><b>1. Claude Code CLI (Recommended)</b></summary>

Add the MCP server in one command using the Claude Code CLI:

```bash
claude mcp add sliit_courseweb node /ABSOLUTE_PATH_TO/courseweb_automation/build/index.js -e SLIIT_USERNAME="itXXXXXX" -e SLIIT_PASSWORD="yourPassword" -e HEADLESS="true"
```
Or simply tell `claude`:
```text
Run `claude mcp add sliit_courseweb ...` using my current courseweb credentials and build/index.js.
```
</details>

<details>
<summary><b>2. Google Antigravity</b></summary>

In your Antigravity agent settings or workspace `.gemini/antigravity/mcp/sliit_courseweb.json`:

```json
{
  "name": "sliit_courseweb",
  "command": "node",
  "args": ["/ABSOLUTE_PATH_TO/courseweb_automation/build/index.js"],
  "env": {
    "SLIIT_USERNAME": "your_it_number",
    "SLIIT_PASSWORD": "your_password",
    "HEADLESS": "true"
  }
}
```
</details>

<details>
<summary><b>3. Cursor IDE</b></summary>

Add to `~/.cursor/mcp.json` or your project `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "sliit_courseweb": {
      "command": "node",
      "args": ["/ABSOLUTE_PATH_TO/courseweb_automation/build/index.js"],
      "env": {
        "SLIIT_USERNAME": "your_it_number",
        "SLIIT_PASSWORD": "your_password",
        "HEADLESS": "true"
      }
    }
  }
}
```
</details>

<details>
<summary><b>4. Windsurf / Codeium</b></summary>

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "sliit_courseweb": {
      "command": "node",
      "args": ["/ABSOLUTE_PATH_TO/courseweb_automation/build/index.js"],
      "env": {
        "SLIIT_USERNAME": "your_it_number",
        "SLIIT_PASSWORD": "your_password",
        "HEADLESS": "true"
      }
    }
  }
}
```
</details>

<details>
<summary><b>5. Claude Desktop App</b></summary>

Add to your macOS `~/Library/Application Support/Claude/claude_desktop_config.json` or Windows `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "sliit_courseweb": {
      "command": "node",
      "args": ["/ABSOLUTE_PATH_TO/courseweb_automation/build/index.js"],
      "env": {
        "SLIIT_USERNAME": "your_it_number",
        "SLIIT_PASSWORD": "your_password",
        "HEADLESS": "true"
      }
    }
  }
}
```
</details>

---

## 🔐 Authentication Methods

SLIIT Courseweb uses **Microsoft 365 single sign-on (SSO)** with Multi-Factor Authentication (MFA). We provide two frictionless methods to authenticate:

### Method A: Interactive MFA Login (Local Machines with GUI)
If you are developing on a laptop or desktop with a screen:
1. Run this terminal command:
   ```bash
   node -e "import('./build/courseweb.js').then(m => new m.CoursewebClient().interactiveLogin().then(console.log));"
   ```
2. A real browser window will appear showing the Microsoft 365 login screen.
3. Complete your standard login and approve the MFA prompt (Microsoft Authenticator / SMS).
4. The authenticated session cookie (`MoodleSession`) is automatically saved to `.env`. You won't have to log in again until the session expires!

---

### Method B: Headless DevTools One-Liner (Cloud VM / GitHub Codespaces / Servers)
If you are running in a headless environment without a browser:

<p align="center">
  <img src="assets/demo-devtools-cookie.jpg" alt="Copy MoodleSession Cookie from Browser DevTools" width="85%" style="border-radius: 8px; border: 1px solid #e4e4e7;">
</p>

1. Open [courseweb.sliit.lk](https://courseweb.sliit.lk) in Chrome/Safari/Edge on your personal computer and log in normally.
2. Press `F12` (or `Cmd + Option + I`) to open **Developer Tools** and switch to the **Console** tab.
3. Paste and run this one-line command:
   ```javascript
   copy(document.cookie.split('; ').find(row => row.startsWith('MoodleSession=')).split('=')[1])
   ```
4. The session token is now copied to your clipboard.
5. In your AI agent (Claude / Cursor / Antigravity), simply ask:
   ```text
   Please authenticate to SLIIT courseweb using this session cookie: <PASTE_TOKEN>
   ```
   *(Your agent will invoke the built-in `set_session_cookie` tool and immediately connect!)*

---

## 🔥 Real Superpower Proofs

### 1. Instant Marks & Average Calculation from 100+ Page PDFs
No more searching through massive tabular marksheets. The agent uses `scrape_page` and `download_file` to parse the document and extract your exact grades.

<p align="center">
  <img src="assets/demo-marksheet.jpg" alt="Marksheet Extraction Proof" width="90%" style="border-radius: 8px; border: 1px solid #e4e4e7;">
</p>

**Sample Prompt:**
> *"Check my IE2012 mid-exam marks from the marksheet PDF on Courseweb and compute the class average if possible."*

---

### 2. Smart Delta Sync for Lecture Slides (Zero Duplicates)
The MCP calculates MD5 checksums for every lecture slide, tutorial PDF, and code sample. It only downloads new or modified files, keeping your local notes perfectly up-to-date.

<p align="center">
  <img src="assets/demo-updates.jpg" alt="Delta Sync Proof" width="90%" style="border-radius: 8px; border: 1px solid #e4e4e7;">
</p>

**Sample Prompt:**
> *"Sync all slides and lab guides for IT2040 into my local /Lectures folder."*

---

### 3. Assignment Deadlines & Submission Verification
Check your academic calendar and confirm your submission status before the deadline closes.

**Sample Prompt:**
> *"What assignments are due in the next 7 days, and have I submitted my Software Architecture assignment?"*

---

## 🧰 MCP Tools Reference

The server exposes 9 specialized MCP tools to your AI assistant:

| Tool Name | Parameters | Description |
| :--- | :--- | :--- |
| `list_modules` | *(none)* | Returns all enrolled modules with IDs and names. |
| `get_announcements` | `moduleId` *(optional)* | Scrapes recent notices, announcements, and exam schedules. |
| `check_module_updates` | `moduleId` | Checks for new lecture notes, slides, and files since last check. |
| `get_deadlines` | *(none)* | Scrapes upcoming assignment deadlines from the Moodle calendar. |
| `scrape_page` | `url` | Deep-scrapes any Moodle page URL into structured markdown for the agent. |
| `download_file` | `fileUrl`, `destinationPath` | Downloads a specific course asset or PDF directly to disk. |
| `sync_module` | `moduleId`, `targetDirectory` | Bulk downloads all lecture slides and materials with MD5 deduplication. |
| `check_assignment_status`| `assignmentId` | Checks submission status, grading feedback, and due dates. |
| `set_session_cookie` | `cookie` | Injects an active `MoodleSession` token without browser automation. |
| `interactive_login` | *(none)* | Launches a GUI browser window for Microsoft 365 MFA authentication. |

---

## 🌍 Port to Your University Moodle

> **Are you a student at University of Moratuwa (UoM), UCSC, IIT, Peradeniya, NSBM, or an overseas university using Moodle?**

Because Moodle powers over 80% of university learning platforms worldwide, the architecture of this MCP server is **100% adaptable** to your campus portal:
1. Fork this repository: `git clone https://github.com/kesaruhasun/courseweb_automation.git`
2. Update the base URL in `src/courseweb.ts` (e.g., `https://lms.uom.lk` or `https://moodle.iit.ac.lk`).
3. Adjust the SSO login selectors to match your university's authentication portal.
4. Send a pull request or publish your campus edition!

If you want help adapting this for your university, open an [Issue](https://github.com/kesaruhasun/courseweb_automation/issues) or reach out at [kesaru.me](https://kesaru.me).

---

## 🛠️ Local Development & Build

```bash
# Clone the repository
git clone https://github.com/kesaruhasun/courseweb_automation.git
cd courseweb_automation

# Install dependencies
npm install

# Compile TypeScript
npm run build

# Run in watch mode for development
npm run dev
```

---

## ⚖️ Disclaimer & Ethical Usage

This project is an open-source productivity tool created for **personal educational purposes only**. It is not officially affiliated with or endorsed by the Sri Lanka Institute of Information Technology (SLIIT).

- **Rate Limiting**: Automated requests should be executed at sensible intervals to prevent unnecessary load on university servers.
- **Privacy & Security**: Credentials and session cookies are stored exclusively on your local machine (`.env`) and are never transmitted to third-party servers.

---

## 👨‍💻 Built with ❤️ by Kesaru Hasun

<p align="left">
  <img src="assets/kesaru-pig-logo-sm.jpg" width="40" height="40" align="left" style="margin-right: 12px; border-radius: 8px;">
  <b>Kesaru Hasun</b><br>
  Website: <a href="https://kesaru.me">kesaru.me</a> • GitHub: <a href="https://github.com/kesaruhasun">@kesaruhasun</a> • Showcase: <a href="https://sliitcoursewebmcp.kesaru.me">sliitcoursewebmcp.kesaru.me</a>
</p>

<br>

**Distributed under the MIT License.** If you find this project helpful, please give it a ⭐ on [GitHub](https://github.com/kesaruhasun/courseweb_automation)!
