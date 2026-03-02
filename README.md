<div align="center">

# 🌊 WASA Smart Triage AI Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 18"/>
  <img src="https://img.shields.io/badge/TypeScript-5.x-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/Shameer412/wasa-voice-agent?style=social" alt="Stars"/>
  <img src="https://img.shields.io/github/forks/Shameer412/wasa-voice-agent?style=social" alt="Forks"/>
  <img src="https://img.shields.io/github/issues/Shameer412/wasa-voice-agent" alt="Issues"/>
  <img src="https://img.shields.io/github/license/Shameer412/wasa-voice-agent" alt="License"/>
</p>

<br/>

**An AI-powered complaint management system for public utilities — built to handle real emergencies, at scale, 24/7.**

Featuring a multilingual **AI Voice Agent**, real-time **NLP triage**, and a glassmorphic **Kanban Dashboard** — WASA Smart Triage transforms how utility agencies respond to citizens.

[🚀 Live Demo](#) · [📖 Documentation](#) · [🐛 Report Bug](https://github.com/Shameer412/wasa-voice-agent/issues) · [✨ Request Feature](https://github.com/Shameer412/wasa-voice-agent/issues)

</div>

---

## 📸 Screenshots

> _Coming soon — add your dashboard screenshots here._

---

## 🌟 Why WASA Smart Triage?

Every minute matters when a hospital's water supply fails or a main pipe bursts in a residential area. Traditional complaint hotlines rely on manual intake — creating delays, miscommunication, and missed priorities.

**WASA Smart Triage AI** solves this by:

- 🤖 **Automating the first line of contact** — no human agent needed for intake
- 🧠 **Intelligently prioritizing** every complaint in real-time using NLP
- 🌐 **Serving citizens in their own language** — Urdu & English out of the box
- 📊 **Giving teams a live operational view** through a modern Kanban board

---

## ✨ Key Features

### 🤖 AI Voice Agent (Multilingual)
- Communicates fluently in **Urdu and English**
- **Auto-generates tickets** from voice calls — no manual data entry
- Extracts caller name, location, and issue type using **NLP**
- Powered by **Google TTS** for natural, human-like responses

### 🧠 Smart Triage & NLP Engine
| Feature | Description |
|---|---|
| Priority Scoring | AI-generated urgency score (0–100) per complaint |
| Auto-Categorization | Classifies issues: Pipe Burst, No Water, Sewerage, etc. |
| Sentiment Analysis *(Beta)* | Detects caller distress for smarter escalation |

### 📊 Kanban Dashboard
- **Glassmorphic dark-mode UI** with smooth micro-animations
- **Drag-and-drop workflow** across `New → In Progress → Escalated → Resolved`
- **Real-time stats** — critical case counts, SLA metrics, and team performance
- Fully **responsive** for desktop and tablet use

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 + TypeScript |
| Styling | Tailwind CSS with custom glassmorphism |
| Icons | Lucide React |
| Voice Engine | Google TTS (Text-to-Speech) |
| Build Tool | Vite |
| State Management | Type-safe React hooks |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v16.x or higher
- npm v8.x or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Shameer412/wasa-voice-agent.git
cd wasa-voice-agent

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be running at `http://localhost:5173` by default.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```
wasa-voice-agent/
├── public/                  # Static assets
└── src/
    ├── components/
    │   ├── analytics/       # Data visualizations & KPI stats
    │   ├── kanban/          # Kanban board, columns, and cards
    │   ├── voice/           # AI Voice Agent UI & logic
    │   └── layout/          # Sidebar, Navbar, and shell components
    ├── hooks/               # Custom React hooks (tickets, toasts, state)
    ├── types/               # TypeScript interfaces & enums
    └── data/                # Mock complaint data & seed scripts
```

---

## 🔄 Workflow Overview

```
Citizen Call
    │
    ▼
AI Voice Agent (Urdu/English)
    │  Extracts: Name, Location, Issue Type
    ▼
NLP Triage Engine
    │  Assigns: Priority Score, Category, Sentiment
    ▼
Kanban Board
    │  Columns: New → In Progress → Escalated → Resolved
    ▼
Field Team Dispatch
```

---

## 🗺️ Roadmap

- [x] AI Voice Agent (Urdu + English)
- [x] NLP-based triage & categorization
- [x] Glassmorphic Kanban dashboard
- [x] Drag-and-drop ticket management
- [ ] Live backend integration (REST API)
- [ ] SMS/WhatsApp notifications for citizens
- [ ] Advanced analytics & SLA dashboards
- [ ] Role-based access control (Admin / Supervisor / Field Agent)
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

Please follow the existing code style and open an issue before making large changes.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

## 👤 Author

**Muhammad Shameer**  
GitHub: [@Shameer412](https://github.com/Shameer412)

> _Built with ❤️ to make public services faster, smarter, and more human._

---

<div align="center">
  <sub>If this project helped you, consider giving it a ⭐ on GitHub!</sub>
</div>
