<div align="center">

# 🚀 DevAudit Studio

### Modern AI-Powered Code Security & Quality Auditor

An enterprise-grade code auditing platform built with React, Node.js, Express, MongoDB Atlas, and Google Gemini AI.

![Status](https://img.shields.io/badge/Status-Completed-success)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-3.6_Flash-8E75B2?logo=googlegemini)
![License](https://img.shields.io/badge/License-MIT-blue)

---

### ⭐ AI-Powered Developer Tool Portfolio Project

</div>

---

# 📸 Project Preview

> *(Add your screenshots into the `README-assets/` folder in your project root.)*

## Workspace & Split-Screen Dashboard

![Dashboard Workspace](README-assets/dashboard.png)

---

## AI Audit & Vulnerability Report

![Audit Report](README-assets/audit-results.png)

---

# ✨ Features

### Code Security & Quality
- **AST Security Auditing:** Automatically identifies critical security vulnerabilities including SQL Injection, Remote Code Execution (RCE), and unhandled exceptions.
- **Performance Optimization:** Provides recommendations for V8 engine optimizations, memory efficiency, and block-scoping improvements.
- **Automated Refactoring:** Generates clean, modern, and production-ready refactored code instantly.

### Platform Resilience & Architecture
- **Exponential Backoff Retry Engine:** Includes automatic retry mechanisms to gracefully handle transient `503 High Demand` AI service responses.
- **MongoDB Audit Persistence:** Automatically stores full audit records (original code, vulnerability findings, performance fixes, and refactored code) in MongoDB Atlas.
- **Split-Pane UI Workspace:** Features a modern, high-contrast dark theme editor built for side-by-side code review.

---

# 🛠 Tech Stack

## Frontend
- React.js (Vite)
- Modern JavaScript (ES6+)
- CSS3 (Flexbox & Grid Layout)

## Backend
- Node.js
- Express.js
- MongoDB Atlas & Mongoose
- Google Gen AI SDK (`@google/genai`)

## Tools & Utilities
- Git & GitHub
- Postman
- VS Code

---

## 🤝 Contributing

Contributions make the open-source community an incredible place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. **Fork** the Project
2. **Create** your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. **Push** to the Branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Usama Ali**  
**GitHub:** [@syedusamaali-dev](https://github.com/syedusamaali-dev)

---

## ⭐ Star This Repository!

If you found **DevAudit Studio** useful, please give it a star on **GitHub** — it helps the project grow!

# 📂 Folder Structure

```text
devaudit-studio
│
├── client
│   ├── src
│   │   ├── App.jsx          # Split-screen UI & API integration
│   │   ├── index.css        # Layout reset & viewport styles
│   │   └── main.jsx
│   └── package.json
│
├── server
│   ├── models
│   │   └── Audit.js         # Mongoose schema for saved audits
│   ├── routes
│   │   └── auditRoutes.js   # Gemini 3.6 Flash integration + retry logic
│   ├── server.js            # Express server initialization
│   └── package.json
│
└── README-assets/           # Screenshots folder

