# **PromptPad – AI-Powered Word Processor**

A modern, intelligent word processor built with React and Node.js. Inspired by MS Word, **PromptPad** integrates advanced **AI writing assistance** (Gemini + OpenAI) for real-time content generation, rewriting, summarization, and more — all within a beautiful, intuitive interface.

---

## ✨ Features

* 🧠 **AI-Powered Writing Tools**: Summarize, rewrite, expand, simplify, and analyze your writing using Gemini & OpenAI
* 📝 **Modern Ribbon UI**: Microsoft Word-style editor with formatting, toolbar, and section-based layout
* 🧑‍🤝‍🧑 **Real-time Collaboration**: Multi-user editing with live sync *(planned feature)*
* 💾 **Document Management**: Create, save, load, auto-save, and manage versions
* 📤 **Export Options**: Download documents in various formats (PDF, DOCX, etc.)
* 📊 **Writing Analytics**: Word/char count, estimated read time, style metrics
* 🧰 **Templates**: Ready-made templates for blogs, resumes, letters, etc.
* 💡 **AI Sidebar**: Ask ChatGPT-style questions within your document (e.g., "Suggest a better intro")

---

## ⚙️ Tech Stack

### Frontend

* **React 18**
* **Material UI 6**
* **Lucide React** (for icons)
* **Draft.js** / **React Quill** for rich text editing
* **Tailwind CSS** *(optional styling layer)*

### Backend

* **Node.js + Express**
* **OpenAI API**
* **Google Gemini API**
* **MongoDB** *(for document persistence)*

---

## 🚀 Quick Start

### ✅ Prerequisites

* Node.js v16+
* npm or yarn

### 📦 Installation

```bash
# 1. Clone the repo
git clone <repository-url>
cd promptpad

# 2. Install all dependencies (frontend + backend)
npm run install:all

# 3. Set up environment variables
```

Create a `.env` file in the `/backend` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
NODE_ENV=development
```

### ▶️ Run the app

```bash
npm start
```

> This starts both the **frontend** on `localhost:3001` and **backend** on `localhost:3000`.

---

## 🧪 Run Individually

```bash
# Frontend only
cd frontend
npm start

# Backend only
cd backend
npm start
```

---

## 📁 Project Structure

```
promptpad/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Editor/        # Editor interface
│   │   │   ├── Toolbar/       # MS Word-style ribbon
│   │   │   ├── Sidebar/       # AI assistant sidebar
│   │   │   └── Dialogs/       # Popups (export, templates, etc.)
│   │   ├── context/           # React Context API
│   │   └── hooks/             # Custom hooks
│   └── public/                # Static assets
├── backend/
│   ├── server.js              # Main Express server
│   └── routes/ai.js           # AI endpoints
└── package.json               # Root scripts and tooling
```

---

## 📡 API Endpoints

### ✨ AI Writing

| Endpoint                  | Purpose                            |
| ------------------------- | ---------------------------------- |
| `POST /ai/summarize`      | Summarize selected content         |
| `POST /ai/rewrite`        | Rephrase selected text             |
| `POST /ai/expand`         | Expand brief text into a paragraph |
| `POST /ai/simplify`       | Make content easier to understand  |
| `POST /ai/analyze`        | Writing quality analysis           |
| `POST /ai/style-transfer` | Change tone/style of text          |

### 📄 Document Management

| Endpoint           | Purpose                            |
| ------------------ | ---------------------------------- |
| `POST /save`       | Save document                      |
| `POST /load`       | Load saved doc                     |
| `POST /export`     | Export as PDF/DOCX                 |
| `POST /cloud-save` | Save to cloud storage *(optional)* |

---

## 🔧 Configuration

### 🌐 Environment Variables

| Variable         | Description          | Required             |
| ---------------- | -------------------- | -------------------- |
| `GEMINI_API_KEY` | Google Gemini AI key | ✅                    |
| `OPENAI_API_KEY` | OpenAI API key       | 🔁 Optional          |
| `PORT`           | Backend server port  | Default: 3000        |
| `NODE_ENV`       | Environment          | Default: development |

---

## 🛠 Development

### NPM Scripts

| Script                   | Description                             |
| ------------------------ | --------------------------------------- |
| `npm start`              | Run frontend & backend together         |
| `npm run start:frontend` | Start frontend only                     |
| `npm run start:backend`  | Start backend only                      |
| `npm run build`          | Build production frontend               |
| `npm test`               | Run unit tests                          |
| `npm run install:all`    | Install frontend & backend dependencies |

---

## 📌 Tips & Troubleshooting

* **Port in use**? → Change `PORT` in `.env`
* **Missing API keys**? → Check `.env` and ensure backend can read it
* **CORS errors**? → Make sure frontend and backend are using the correct origins
* **Performance**? → Use production build for deployment

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Write/update tests if applicable
5. Open a PR!

---

## 📜 License

Licensed under the **ISC License**.

---

## 💬 Support

* [GitHub Issues](https://github.com/vinayj16/promptpad/issues)
* [Email](mailto:your-email@example.com)
* Or ask your AI assistant inside PromptPad 😉

---

Would you like a **logo, tagline, or landing page copy** for PromptPad next?
cd project/frontend
npm install
npm run dev

cd ../backend
npm install
npm start# PromptPad
