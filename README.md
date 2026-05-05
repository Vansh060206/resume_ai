<p align="center">
  <img src="https://img.shields.io/badge/Resume_AI-AI%20Resume%20Analyzer-4F46E5?style=for-the-badge&logo=openai&logoColor=white" alt="Resume AI"/>
</p>

<h1 align="center">📄 Resume AI</h1>
<h3 align="center">AI-Powered Resume Analyzer & Optimization Platform</h3>

<p align="center">
  <strong>Transforming your professional profile into job-winning resumes through intelligent AI feedback.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1+-black?style=flat-square&logo=next.js&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=flat-square&logo=google&logoColor=white" alt="Google Gemini"/>
  <img src="https://img.shields.io/badge/Firebase-Admin-FFCA28?style=flat-square&logo=firebase&logoColor=black" alt="Firebase"/>
  <img src="https://img.shields.io/badge/TailwindCSS-V4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="TailwindCSS"/>
  <img src="https://img.shields.io/badge/Framer%20Motion-Animation-FF0055?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion"/>
</p>

<p align="center">
  <a href="#-the-problem">Problem</a> •
  <a href="#-our-solution">Solution</a> •
  <a href="#-key-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-developer">Developer</a>
</p>

---

## 🔴 The Problem

In today's highly competitive job market, countless qualified candidates get rejected simply because their resumes fail to pass Applicant Tracking Systems (ATS) or do not effectively highlight their strengths. 

### Existing Solutions Suffer From Three Major Gaps:

| Gap | Description |
|-----|-------------|
| **🤖 Blind ATS Filters** | Candidates submit resumes without knowing if they meet the specific keywords or formatting requirements of modern ATS software. |
| **🤷 Generic Feedback** | Most resume checkers provide generic, template-based advice rather than actionable, personalized recommendations based on the candidate's actual experience. |
| **⏱️ Time-Consuming Edits** | Manually reformatting and rewriting resumes for every single application is exhausting, taking time away from actual skill development and networking. |

> **Result:** Candidates face continuous rejections, not due to a lack of skills, but due to poor resume optimization and lack of intelligent insights.

---

## 💡 Our Solution

**Resume AI** is an intelligent platform that leverages advanced Generative AI to parse, evaluate, and provide deep, actionable feedback on your resume.

<p align="center">
  <img src="https://img.shields.io/badge/1-UPLOAD-blue?style=for-the-badge" alt="Upload"/>
  <img src="https://img.shields.io/badge/→-white?style=for-the-badge" alt="arrow"/>
  <img src="https://img.shields.io/badge/2-ANALYZE-green?style=for-the-badge" alt="Analyze"/>
  <img src="https://img.shields.io/badge/→-white?style=for-the-badge" alt="arrow"/>
  <img src="https://img.shields.io/badge/3-OPTIMIZE-orange?style=for-the-badge" alt="Optimize"/>
  <img src="https://img.shields.io/badge/→-white?style=for-the-badge" alt="arrow"/>
  <img src="https://img.shields.io/badge/4-EXPORT-gold?style=for-the-badge" alt="Export"/>
</p>

### What Resume AI Does:

| Feature | Description |
|---------|-------------|
| **📄 Parses** | Extracts text from PDF and DOCX files with high accuracy. |
| **🧠 Analyzes** | Uses Google's Gemini AI to evaluate structure, content, and ATS compatibility. |
| **🎯 Recommends** | Provides tailored suggestions to improve bullet points, impact metrics, and keywords. |
| **💾 Exports** | Allows candidates to export their revamped resumes in modern formats (PDF/DOCX). |

---

## ⭐ Key Features

### 🤖 AI-Powered Resume Analysis
- **Google Gemini Integration** for deep contextual understanding of professional experience.
- **ATS Score Prediction** to gauge the probability of passing automated screening.
- **Actionable Bullet Point Improvements** focusing on the "Action-Context-Result" framework.

### 📊 Comprehensive Candidate Dashboard
- Manage multiple resume iterations and track improvements over time.
- View detailed breakdown of skills, missing keywords, and readability scores.
- Interactive and fully responsive UI powered by **Framer Motion** animations.

### 🔐 Secure Authentication & Storage
- **Firebase Authentication** for secure login and account management.
- User data securely stored using **Firebase Admin SDK**.
- Personalized profiles mapping career goals to resume metrics.

### 📄 Multi-format Parsing & Export
- Robust support for parsing `.pdf` and `.docx` using `pdf-parse` and `mammoth`.
- Export highly optimized resumes directly back into PDF or Word format (`jspdf`, `docx`).
- Automated email reports sent via **Nodemailer**.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                 Resume AI Architecture                              │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│    ┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐      │
│    │   Next.js       │         │   Next.js       │   API   │  Google Gemini  │      │
│    │   Frontend      │◄───────►│   API Routes    │◄───────►│  (GenAI Model)  │      │
│    │   (React 18)    │         │   (Node.js)     │         │                 │      │
│    └────────┬────────┘         └────────┬────────┘         └─────────────────┘      │
│             │                           │                                           │
│             │                           │                                           │
│             │         ┌─────────────────┼─────────────────┐                         │
│             │         │                 │                 │                         │
│             ▼         ▼                 ▼                 ▼                         │
│    ┌────────────────────┐      ┌─────────────────┐   ┌───────────────┐              │
│    │ Firebase Auth      │      │ PDF/DOCX Parser │   │ Email Service │              │
│    │ (User Management)  │      │ (pdf-parse)     │   │ (Nodemailer)  │              │
│    └────────────────────┘      └─────────────────┘   └───────────────┘              │
│                                         │                                           │
│                                         ▼                                           │
│                              ┌────────────────────┐                                 │
│                              │   Firebase Admin   │                                 │
│                              │    (Firestore)     │                                 │
│                              └────────────────────┘                                 │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 16** | App Router, Server Components, and SSR |
| **React 18** | UI framework with Hooks |
| **TailwindCSS** | Utility-first responsive styling |
| **Framer Motion** | Smooth, professional animations |
| **Zustand** | Lightweight global state management |

### Backend & API
| Technology | Purpose |
|------------|---------|
| **Next.js API Routes** | Serverless backend logic |
| **Google Generative AI** | Core intelligence engine |
| **pdf-parse / mammoth** | Document extraction |
| **Nodemailer** | Transactional email delivery |
| **Axios** | Efficient HTTP client requests |

### Database & Auth
| Technology | Purpose |
|------------|---------|
| **Firebase** | Client-side authentication |
| **Firebase Admin** | Server-side secure data interaction |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm / pnpm**
- **Firebase Project**
- **Google Gemini API Key**

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Vansh060206/resume_ai.git
cd resume_ai
```

### 2️⃣ Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3️⃣ Configure Environment Variables

Create a `.env.local` file in the root directory and add:

```env
# Google GenAI
GEMINI_API_KEY=your_gemini_api_key

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4️⃣ Start the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🔮 Future Roadmap

- [ ] **LinkedIn Profile Integration** - One-click import from LinkedIn
- [ ] **Custom Resume Builder** - Drag & drop template editor
- [ ] **Cover Letter Generation** - AI-generated cover letters based on the optimized resume
- [ ] **Job Matching** - Recommending specific job listings based on analyzed skills

---

## 👨‍💻 Developer

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Vansh060206">
        <img src="https://avatars.githubusercontent.com/u/152912628?v=4" width="100px;" alt=""/>
        <br />
        <sub><b>Vansh Mankani</b></sub>
      </a>
      <br />
      <sub>Full Stack Developer</sub>
    </td>
  </tr>
</table>

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  <strong>🚀 Built to empower your career journey 💼</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge" alt="Made with love"/>
  <img src="https://img.shields.io/badge/For-Future%20Professionals-blue?style=for-the-badge" alt="For Professionals"/>
</p>
