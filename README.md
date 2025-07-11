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
* [Email](mailto: vinays15201718@gmail.com)
* Or ask your AI assistant inside PromptPad 😉

---

# 🚀 Deployment & Production Checklist

## 1. **Set Required Environment Variables on Render**

Go to your Render service → **Environment** tab → Add these variables:

| Key              | Value (example)                                                                                   | Required? |
|------------------|--------------------------------------------------------------------------------------------------|-----------|
| `MONGODB_URI`    | `mongodb+srv://<user>:<pass>@cluster0.mongodb.net/promptpad?retryWrites=true&w=majority`         | Yes       |
| `GEMINI_API_KEY` | `your-gemini-api-key`                                                                            | Yes       |
| `GEMINI_MODEL`   | `gemini-pro` (or your preferred Gemini model)                                                    | Yes       |
| `JWT_SECRET`     | `your-very-secret-jwt-key`                                                                       | Yes       |
| `FRONTEND_URL`   | `https://promptpad.onrender.com` (or your custom domain, if CORS issues)                         | Optional  |
| `NODE_ENV`       | `production`                                                                                     | Optional  |

**Note:**  
- Double-check for typos (e.g., `MONGODB_URI` not `MONGODB_URl`).
- Never commit secrets to git.

---

## 2. **Deploy with the Latest Code**

- Push your latest code to GitHub.
- Trigger a manual deploy on Render (or wait for auto-deploy).

---

## 3. **Test All Major Flows in Production**

### **Authentication**
- Register a new user.
- Login and logout.
- Try invalid login (wrong password/email) and check for friendly error.

### **Document Management**
- Create a new document.
- Edit and save changes.
- Delete a document.
- Check that changes persist after refresh.

### **Real-Time Collaboration**
- Open the same document in two browser windows (or with two users).
- Edit content in one window and see updates in the other.
- Add comments and resolve them.

### **AI Features**
- Use AI features: Summarize, rewrite, grammar check, generate content, etc.
- Check for correct AI responses and error handling (e.g., if you hit a rate limit).

### **Error Handling**
- Try to access a document you don’t own (should get “Access denied”).
- Exceed AI rate limits (should get a clear error).
- Disconnect internet and try actions (should show network error).

---

## 4. **Check Logs for Backend Errors**

- In Render, go to your service → **Logs** tab.
- Look for errors or warnings during your tests.
- Fix any issues and redeploy if needed.

---

## 5. **(Optional) Add a README Section**

```markdown
<code_block_to_apply_changes_from>
```

---

**If you want a more detailed README or a deployment script, let me know!**  
If you hit any issues during testing, paste the error/log here and I’ll help you debug it.

