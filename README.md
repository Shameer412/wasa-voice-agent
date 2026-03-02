<div align="center">

```
██╗    ██╗ █████╗ ███████╗ █████╗
██║    ██║██╔══██╗██╔════╝██╔══██╗
██║ █╗ ██║███████║███████╗███████║
██║███╗██║██╔══██║╚════██║██╔══██║
╚███╔███╔╝██║  ██║███████║██║  ██║
 ╚══╝╚══╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
     SMART TRIAGE AI — DASHBOARD
```

<h3>A full-stack UI system built to demonstrate modern frontend architecture,<br/>AI-assisted product thinking, and real-world system design.</h3>

<br/>

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

<br/>

> **⚡ This is a frontend UI/UX portfolio project.**  
> Built to showcase component architecture, glassmorphic design systems, and AI-integrated product thinking.

</div>

---

## 🎯 What This Project Actually Is

This isn't a tutorial clone. This isn't a school assignment.

I designed and built this to answer one question: **"Can I design and architect a real-world AI-powered utility management system from scratch — UI, component structure, data flow, and all?"**

The answer is yes. Here's the proof.

**What I was practicing:**
- Translating a complex domain (public utility complaints) into clean, reusable UI components
- Designing a system with real-world constraints: multilingual users, urgent triage, high-volume tickets
- Applying AI-assisted development as a workflow — using AI as a collaborator, not a crutch
- Building a glassmorphic design system that's consistent, scalable, and actually usable

---

## 🤖 On AI-Assisted Development

> I used AI (Claude) to help design and build parts of this project. I'm not hiding that — I'm proud of it.

Here's the truth about modern frontend development: **the best engineers know how to leverage AI effectively.** That means:

- Knowing *what* to prompt for — you need architectural clarity first
- Knowing *when* the AI output is wrong — you need expertise to evaluate it  
- Knowing *how* to iterate toward quality — you need taste and judgment

This project demonstrates all three. Every component, every data flow decision, every design choice — I understood, evaluated, and owned it.

---

## 🧠 System Design Walkthrough

> This is the architecture I designed. Understanding this was the whole point.

```
┌─────────────────────────────────────────────────────────────┐
│                    CITIZEN TOUCHPOINT                        │
│   📞 Phone Call  ·  🌐 Web Portal  ·  📱 WhatsApp (future)  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   AI VOICE AGENT LAYER                       │
│                                                              │
│   🗣️  Google TTS (Urdu / English)                           │
│   🧠  NLP Extraction  →  Name · Location · Issue Type        │
│   📊  Priority Scorer  →  Urgency Score (0–100)              │
│   💬  Sentiment Analysis (Beta) →  Caller Distress Level     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      TRIAGE ENGINE                           │
│                                                              │
│   Category Assignment  ──→  Pipe Burst / No Water / Sewage  │
│   Priority Queue       ──→  Critical / High / Medium / Low  │
│   SLA Clock            ──→  Starts automatically on creation │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  KANBAN DASHBOARD  ← This UI                 │
│                                                              │
│   [ New ]  →  [ In Progress ]  →  [ Escalated ]  →  [ ✓ ]  │
│                                                              │
│   Real-time stats  ·  Drag-and-drop  ·  Glassmorphic UI     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
                  Field Team Dispatch
```

### Component Architecture

```
src/
├── components/
│   ├── kanban/
│   │   ├── KanbanBoard.tsx       # Orchestrates columns + DnD context
│   │   ├── KanbanColumn.tsx      # Status column with droppable zone
│   │   └── TicketCard.tsx        # Draggable card with priority badge
│   │
│   ├── voice/
│   │   ├── VoiceAgent.tsx        # Agent interface & state machine
│   │   ├── TranscriptView.tsx    # Live transcript with entity highlights
│   │   └── LanguageToggle.tsx    # Urdu ↔ English switch
│   │
│   ├── analytics/
│   │   ├── StatCard.tsx          # Reusable KPI tile
│   │   ├── PriorityChart.tsx     # Issue distribution chart
│   │   └── SLATracker.tsx        # Response time monitoring
│   │
│   └── layout/
│       ├── Sidebar.tsx           # Navigation + collapse behavior
│       └── TopNav.tsx            # Search, notifications, user menu
│
├── hooks/
│   ├── useTickets.ts             # Ticket CRUD + optimistic updates
│   └── useToast.ts               # Notification system
│
└── types/
    ├── ticket.ts                 # Ticket interface + enums
    └── agent.ts                  # Voice agent state types
```

---

## ✨ UI Design System

### Design Philosophy
> *"Glassmorphism done right — depth without noise, clarity without flatness."*

```
DESIGN TOKENS
──────────────────────────────────────────────────────
Background      #0a0f1e           Deep Navy
Surface         rgba(255,255,255,0.05) + backdrop-blur
Border          rgba(255,255,255,0.10)
Text Primary    #f0f4ff
Text Muted      #8892a4
Accent Blue     #3b82f6
Accent Cyan     #06b6d4
Critical        #ef4444
Warning         #f59e0b

TYPOGRAPHY
──────────────────────────────────────────────────────
Display         Space Grotesk    (headers, stats, KPIs)
Body            Inter            (content, labels, forms)
Mono            JetBrains Mono   (ticket IDs, timestamps)

MOTION
──────────────────────────────────────────────────────
Drag spring     cubic-bezier(0.34, 1.56, 0.64, 1)
Fade-in         opacity 0→1 + translateY 8px, 200ms ease
Priority pulse  @keyframe, 2s infinite — critical tickets only
```

### Priority Color System

| Priority | Score Range | Indicator | Typical Case |
|----------|-------------|-----------|--------------|
| 🔴 Critical | 80 – 100 | `#ef4444` | Hospital, school, emergency |
| 🟠 High | 60 – 79 | `#f59e0b` | Commercial area, 10+ households |
| 🟡 Medium | 40 – 59 | `#3b82f6` | Residential complaints |
| 🟢 Low | 0 – 39 | `#10b981` | Minor issues, monitoring |

---

## 🚀 Run It Locally

```bash
git clone https://github.com/Shameer412/wasa-voice-agent.git
cd wasa-voice-agent
npm install
npm run dev
# → http://localhost:5173
```

```bash
npm run build    # production build
npm run preview  # preview production build
npm run lint     # ESLint check
```

---

## 📈 What I Built This to Demonstrate

| Skill Area | What This Project Shows |
|---|---|
| **Component Design** | Reusable, prop-typed components with clear, single responsibilities |
| **State Architecture** | Complex ticket state managed with custom hooks + optimistic updates |
| **Design Systems** | Consistent token-based system across colors, spacing, and motion |
| **AI Collaboration** | Effective prompting, output evaluation, and iterating to quality |
| **Domain Modeling** | Real-world utility ops translated into clean TypeScript interfaces |
| **DX & Tooling** | Vite, strict TypeScript, ESLint, path aliases, clean project structure |

---

## 🗺️ If This Were Production

Decisions I'd make with a real backend, team, and budget:

- [ ] WebSocket — live ticket updates across all connected agents
- [ ] Auth — role-based access (Admin / Supervisor / Field Agent)
- [ ] REST API + PostgreSQL — persistent ticket storage and history
- [ ] Twilio — real voice call handling and recording
- [ ] Push notifications — SLA breach alerts before they happen
- [ ] Offline support — service workers for field teams with poor connectivity
- [ ] React Native — mobile app for field agents in the field

---

<div align="center">

---

**Designed & built by [Muhammad Shameer](https://github.com/Shameer412)**

*Frontend developer · UI/UX thinker · AI-native builder*

<br/>

*This project exists to show what I can design, architect, and ship.*  
*If you're a recruiter or engineer reading this — let's talk.*

---

</div>
