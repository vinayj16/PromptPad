# MS Word-Style AI Word Processor (Next-Gen)

A next-generation, web-based MS Word-style word processor with rich text editing, advanced AI features (ChatGPT, Grammarly, Notion AI, WordTune), vibrant templates, Ribbon UI, collaboration, and more. Built with React (frontend) and Node.js/Express (backend).

---

## ✨ Features

- **Ribbon UI**: Home, Insert, Draw, Design, Layout, References, Mailings, Review, View, Help tabs, each with modern toolbars and features.
- **Vibrant Templates**: Resume, Report, Letter, Blog, and more. One-click start with beautiful, colorful templates.
- **Color Themes**: Switch between vibrant color palettes and fonts (Vibrant Blue, Sunset, Mint, Night, etc.).
- **Centered, Paginated Editor**: Modern, responsive, and visually attractive editor with auto-pagination and print/web/read views.
- **Rich Formatting**: Bold, italic, underline, superscript, subscript, font/size/color, alignment, lists, indent, line height, direction, and more.
- **Insert Tools**: Table picker, image upload, shape/diagram/arrow/triangle/circle picker, chart (bar/line/pie) generator, captions, cross-references.
- **Draw Tab**: Pen, highlighter, eraser, color/width selection, and freehand drawing on a canvas overlay.
- **Layout Tools**: Margins, orientation, page size, columns, paragraph spacing, indents.
- **References**: Table of Contents, citations, bibliography, footnotes, captions, cross-references, AI-generated TOC/citations.
- **Mailings**: Mail merge, recipient selection, merge fields, preview, finish & merge, envelopes, labels.
- **Review**: Spell check, grammar check, word count, comments, tracked changes, accept/reject, compare, restrict editing.
- **View**: Print/web/read layouts, zoom, ruler, gridlines, navigation pane, new window, arrange, split.
- **Help**: Help, support, feedback, training dialogs.
- **AI Sidebar**: Floating sidebar for prompts, image upload, quick AI actions (summarize, rewrite, explain, generate title, etc.), advanced analysis, style transfer, context rewriting, suggestions, and more.
- **Collaboration**: Real-time collaborative mode, inline comments, AI discussions, versioning, restore/compare, add collaborators.
- **Outline Sidebar**: Auto-generated outline from headings, clickable navigation.
- **Quick Actions**: Floating button for new/save/export/AI/templates.
- **Recent Documents**: Sidebar with pin/star, open, and quick access.
- **Preferences**: Theme, font, size, auto-save, spell/grammar check, writing stats, and more.
- **Advanced Tools**: AI TOC, smart citations, image suggestions, code formatter, smart formatting, structure, enhanced export (DOCX, PDF, ePub, HTML, TXT), auto-publish (Medium, WordPress, LinkedIn, Blogger), cloud save (Google Drive, Dropbox, OneDrive, GitHub).
- **Smart Search**: AI-powered search in document.
- **Focus Mode**: Highlight current paragraph for distraction-free writing.
- **Auto-save & Recovery**: Local storage auto-save, recovery, and versioning.
- **Modern, Responsive UI**: Sticky header/ribbon, vibrant design, mobile-friendly, beautiful alignment and spacing.

---

## 🚀 Getting Started

### Prerequisites
- Node.js and npm
- Gemini API key (for AI features)

### 1. Backend
```sh
cd backend
cp .env.example .env # or create .env
# Add your Gemini API key:
# GEMINI_API_KEY=your_gemini_api_key_here
npm install
npm start
```
Backend runs on [http://localhost:3000](http://localhost:3000).

### 2. Frontend
```sh
cd frontend
npm install
npm start
```
Frontend runs on [http://localhost:3000](http://localhost:3000) (or next available port).

---

## 📝 Usage
- Use the Ribbon tabs for all editing, inserting, drawing, design, layout, references, mailings, review, view, and help features.
- Open the AI sidebar for advanced writing, analysis, suggestions, and quick actions.
- Use the floating Quick Actions and Recent Documents for fast access.
- Save, export, and publish documents with one click.
- Collaborate in real-time, add comments, manage versions, and more.
- Customize your experience in Preferences.

---

## 💡 Tips
- Try vibrant templates and color themes for a beautiful start.
- Use AI to summarize, rewrite, expand, or analyze your writing.
- Use the Outline sidebar for quick navigation.
- Use Advanced Tools for TOC, citations, export, publishing, and cloud save.
- Enable Focus Mode for distraction-free writing.

---

## 📚 Learn More
- Frontend: [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- Backend: Node.js, Express, Gemini API
- For full feature list, see the Ribbon UI and AI sidebar in the app.

---

## 🖼️ Screenshots
> _Add screenshots of the Ribbon UI, editor, AI sidebar, templates, and more here._

---

## 🛠️ Roadmap
- Real-time multi-user collaboration (Google Docs style)
- More AI models and integrations
- More templates and export formats
- Plugin/extension system
- Mobile app

---

## 📄 License
MIT
