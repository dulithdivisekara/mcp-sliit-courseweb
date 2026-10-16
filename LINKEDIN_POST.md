# 🚀 LinkedIn Publication Kit — SLIIT Courseweb MCP Server

This kit contains:
1. **The Short-Form Feed Post** (Optimized for LinkedIn algorithm, high reach & comments)
2. **The Long-Form Pulse Article** (For publishing under LinkedIn "Write an Article")
3. **Media Attachments**:
   - Primary Banner: `assets/linkedin-project-banner.jpg` (16:9 4K developer dark mode)
   - Demo Video: `assets/courseweb-launch-preview.mp4` (600 KB 720p 60fps faststart)
   - Marksheet Proof: `assets/demo-marksheet.jpg` (103-page PDF parse in 3 seconds)
   - Delta Sync Proof: `assets/demo-updates.jpg` (MD5 slide mirror)

---

## 📱 Short-Form LinkedIn Feed Post (Copy & Paste Ready)

```markdown
I got tired of waiting for SLIIT Courseweb to load just to check if exam marks were released...

So I connected my university's Moodle LMS directly into Claude Code, Cursor, and AI coding agents via the Model Context Protocol (MCP). 🚀

Here is the reality every university student knows too well:
⏳ The LMS crawls during peak hours right before midnight deadlines.
📑 Midterm & final exam marks are released in massive 103-page PDFs where finding your student ID requires agonizing manual search.
📦 Downloading 14 weeks of lecture slides, lab sheets, and tutorial answers means clicking through dozens of nested web pages.

I thought: In 2026, why isn't our AI agent managing this for us?

Over the past few weeks, I built the SLIIT Courseweb MCP Server — an open-source bridge that gives AI assistants native tools to interact with Courseweb:

✨ Key Highlights:
1️⃣ Instant 103-Page PDF Marksheet Parsing: Tell your agent "Find my midterm score in the SE results PDF". It downloads the file, scans 100+ pages in under 3 seconds, extracts your grade breakdown, and calculates your class percentile.
2️⃣ Smart Delta Lecture Syncing: Uses MD5 checksum hashing to mirror course materials locally — downloading only newly uploaded or modified slides (zero duplicates).
3️⃣ Academic Deadline Radar: One prompt aggregates upcoming assignment cutoffs across all your enrolled modules into an actionable priority to-do list.
4️⃣ Frictionless Auth: Automated Playwright browser handles Microsoft Single Sign-On (SSO) and 2-digit Microsoft Authenticator MFA, with instant MoodleSession cookie injection for headless cloud VMs.
5️⃣ 1-Prompt Agent Self-Installation: Paste one prompt into Claude Code CLI, Cursor Composer, Google Antigravity, or Windsurf — the agent clones, builds, and registers the server autonomously.

🌐 Try the Live Portal (Built with English, Spoken Sinhala & Tamil documentation):
👉 https://sliitcoursewebmcp.kesaru.me

🐙 GitHub Repository (Star, Fork, or Clone):
👉 https://github.com/kesaruhasun/mcp-sliit-courseweb

The era of browsing bloated university web portals is coming to an end. AI agents equipped with MCP will be how students interact with education systems.

Would love to hear feedback from fellow engineers, SLIIT students, and educators! How are you integrating AI agents into your daily workflows?

#ModelContextProtocol #AI #SoftwareEngineering #OpenSource #ClaudeCode #CursorAI #EdTech #SLIIT #WebAutomation #TypeScript #DeveloperTools
```

---

## 📰 Long-Form LinkedIn Pulse Article

**Headline:**
### Building an Autonomous Academic Assistant: How I Bridged Moodle into Claude and Cursor with Model Context Protocol

**Cover Image:**
Attach `assets/linkedin-project-banner.jpg`

**Body:**

### The Frustration of Legacy Educational Portals
Every university student in Sri Lanka has lived this moment: It’s 11:45 PM, an assignment is due at midnight, and the Learning Management System (LMS) is grinding to a halt under the traffic of thousands of panicked undergraduates.

Even worse is "Marksheet Day." Lecturers release midterm examination results as massive, unindexed 103-page PDFs containing thousands of anonymous rows. Students spend 10 minutes on their phones pinching, zooming, and searching for an 8-digit registration number, only to wonder how their score compares to the class average.

As software engineers, we build intelligent agents to write code, debug distributed systems, and automate infrastructure. Why are we still manually clicking through clunky web portals for our university studies?

### What is the Model Context Protocol (MCP)?
Announced recently by Anthropic, the **Model Context Protocol (MCP)** is an open, standardized protocol that acts like a "USB-C port for AI models." Instead of relying on brittle copy-pasting or generic web scraping, MCP allows local AI models (such as Claude Code, Cursor Composer, Google Antigravity, and Windsurf) to securely query external tools, databases, and APIs as first-class primitives.

When you install an MCP server, your agent gains specialized functions. It can decide when to call them, inspect their structured outputs, and chain them together into complex multi-step workflows.

### Engineering the SLIIT Courseweb MCP Server
To solve our campus workflow bottlenecks, I engineered **SLIIT Courseweb MCP** in TypeScript and Node.js.

The architecture addresses three core technical hurdles:

#### 1. Navigating Institutional SSO & Multi-Factor Authentication
SLIIT uses Microsoft Office 365 Single Sign-On backed by 2-digit Microsoft Authenticator MFA. To solve this without compromising security:
- **Interactive Mode:** The server launches an automated Playwright Chromium browser that pre-fills user credentials and waits gracefully for the student to approve the 2-digit phone prompt. It then persists the encrypted session state in `storage_state.json`.
- **Headless Cloud Mode:** For developers running inside headless Linux VMs or remote dev containers, I implemented a zero-browser session cookie injection tool (`set_session_cookie`), allowing instant one-line cookie transfer from browser DevTools.

#### 2. MD5 Delta File Synchronization
Courseweb courses often contain hundreds of files (PDF slides, lab worksheets, zip archives). Re-downloading them wastes campus bandwidth and clutters local directories. The `sync_module` tool computes streaming MD5 hashes for every remote resource and compares them against existing local files, downloading only modified or newly uploaded materials.

#### 3. Agent-Native 1-Prompt Self-Configuration
I wanted zero friction for students who have never configured an MCP server before. Instead of forcing users to locate and edit hidden JSON configuration files, I engineered prompt blueprints for Claude Code, Antigravity, Cursor, and Windsurf. Users simply paste one prompt into their agent's chat, and the agent uses its own shell tools to clone the repo, compile the TypeScript build, and update its MCP configuration table.

### Real Results in Production
In real-world testing:
- **103-Page Exam Results PDF Search:**
  *Prompt:* `"What was my score in the Probability and Statistics midterm results PDF?"`
  *Agent Action:* Fetches course announcements, identifies the PDF link, downloads it, parses the text stream across 103 pages, locates registration number `#IT25103992` on page 98, extracts the 15/20 score, and reports class statistics — all in **under 3 seconds**.
- **Weekly Standup Generation:**
  *Prompt:* `"What assignments and lab deliverables are due this week?"`
  *Agent Action:* Calls `get_deadlines`, aggregates submission statuses, and generates a categorized markdown priority task list with deadlines and links.

### Multilingual Accessibility for Sri Lankan Students
Technology should bridge gaps, not widen them. To help junior students and peers across all SLIIT faculties adopt agentic workflows:
- The project documentation and web portal (**[sliitcoursewebmcp.kesaru.me](https://sliitcoursewebmcp.kesaru.me)**) are natively translated into **Spoken Sinhala (සිංහල)** and **Spoken Tamil (தமிழ்)** alongside standard English.
- Native Apple SF typography (`Gemunu Libre` and `Anek Tamil`) was selected to ensure beautiful legibility across mobile devices.

### Open Source & Next Steps
The entire codebase is open-sourced under the MIT License:
- **GitHub:** https://github.com/kesaruhasun/mcp-sliit-courseweb
- **Live Portal:** https://sliitcoursewebmcp.kesaru.me

The shift from manual web browsing to autonomous AI agent orchestration is happening now. If you're building with MCP or looking to connect your institution's systems to modern LLMs, check out the repository, submit a PR, or reach out!

---
*Kesaru Hasun is a software developer and student exploring AI agent orchestration, developer tooling, and distributed systems.*
