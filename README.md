# 🌊 WASA Smart Triage AI Dashboard

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

**WASA Smart Triage AI** is a state-of-the-art management system designed to revolutionize public utility complaint handling. Featuring a cutting-edge **AI Voice Agent**, it automates the intake process, extracts critical data using NLP, and prioritizes tickets in real-time to ensure rapid response for the most urgent issues.

---

## ✨ Key Features

### 🤖 1. AI Voice Agent (Multilingual)
- **Urdu & English Support:** Seamlessly communicates with citizens in their native language.
- **Automated Ticket Generation:** AI listens, understands, and creates tickets instantly.
- **Data Extraction:** Automatically identifies caller names, locations, and issue types.

### 🧠 2. Smart Triage & NLP
- **Priority Scoring:** AI-driven urgency assessment (0–100) based on issue severity and public impact.
- **Categorization:** Intelligent classification of complaints (e.g., Pipe Burst, No Water, Sewerage).
- **Sentiment Analysis:** (Beta) Gauging caller distress for better escalation.

### 📊 3. Modern Kanban Dashboard
- **Glassmorphic UI:** A premium, dark-mode-first design with smooth micro-animations.
- **Workflow Management:** Drag-and-drop tickets across *New*, *In Progress*, *Escalated*, and *Resolved* columns.
- **Real-time Stats:** Instant visibility into critical cases and performance metrics.

---

## 🛠️ Tech Stack

- **Frontend:** React 18 with TypeScript
- **Styling:** Tailwind CSS (Custom Glassmorphism)
- **Icons:** Lucide React
- **Voice Engine:** Google TTS (Translation-to-Speech)
- **Build Tool:** Vite
- **Validation:** Type-safe props and state management

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or higher)
- npm (v8.x or higher)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shameer412/wasa-voice-agent.git
   cd wasa-voice-agent
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```text
src/
├── components/          # Reusable UI components & Pages
│   ├── analytics/       # Data visualization & Stats
│   ├── kanban/          # Kanban board implementation
│   ├── voice/           # AI Voice Agent components
│   └── layout/          # Navigation and Sidebar
├── hooks/               # Custom React hooks (Tickets, Toast)
├── types/               # TypeScript interfaces & enums
└── data/                # Mock data & scripts
```

---

## 🌟 Why This Project?

This project demonstrates the power of **AI in public service**. By automating the initial contact phase, utility agencies like WASA can reduce human error, provide 24/7 support, and ensure that life-critical issues (like hospital pipe bursts) are addressed within minutes.

---

Developed with ❤️ by [Shameer Hussain](https://github.com/Shameer412)
