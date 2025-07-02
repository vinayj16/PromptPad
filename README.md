# MS Word Clone - AI-Powered Word Processor

A modern, AI-powered word processor built with React and Node.js, featuring a Microsoft Word-like interface with advanced AI capabilities.

## Features

- **Modern Ribbon UI**: Microsoft Word-style interface with tabs and toolbars
- **AI-Powered Writing**: Integration with Google Gemini and OpenAI for content generation
- **Real-time Collaboration**: Multi-user editing with live synchronization
- **Advanced Formatting**: Rich text editing with comprehensive formatting options
- **Document Management**: Save, load, and organize documents
- **Export Options**: Support for multiple file formats
- **Auto-save**: Automatic document saving with version history
- **Writing Analytics**: Word count, character count, and writing statistics
- **Templates**: Pre-built document templates for various use cases

## Tech Stack

### Frontend
- React 18
- Material-UI 6
- Lucide React (Icons)
- Draft.js (Rich text editing)
- React Quill (Alternative editor)

### Backend
- Node.js
- Express.js
- Google Generative AI (Gemini)
- OpenAI API
- MongoDB (optional)

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd msword
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the application**
   ```bash
   npm start
   ```

   This will start both the frontend (port 3001) and backend (port 3000) concurrently.

### Alternative: Run Frontend Only

If you want to run just the frontend without AI features:

```bash
cd frontend
npm start
```

### Alternative: Run Backend Only

```bash
cd backend
npm start
```

## Project Structure

```
msword/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Editor/      # Main editor components
│   │   │   ├── Toolbar/     # Ribbon UI components
│   │   │   ├── Sidebar/     # Sidebar components
│   │   │   └── Dialogs/     # Modal dialogs
│   │   ├── context/         # React context providers
│   │   └── hooks/           # Custom React hooks
│   └── public/              # Static assets
├── backend/                  # Node.js backend server
│   ├── server.js            # Main server file
│   └── package.json         # Backend dependencies
└── package.json             # Root package.json with scripts
```

## API Endpoints

### AI Features
- `POST /ai/summarize` - Summarize text
- `POST /ai/rewrite` - Rewrite text
- `POST /ai/expand` - Expand text
- `POST /ai/simplify` - Simplify text
- `POST /ai/analyze` - Analyze writing quality
- `POST /ai/style-transfer` - Change writing style

### Document Management
- `POST /save` - Save document
- `POST /load` - Load document
- `POST /export` - Export document
- `POST /cloud-save` - Save to cloud storage

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes (for AI features) |
| `OPENAI_API_KEY` | OpenAI API key | No (for grammar checking) |
| `PORT` | Backend server port | No (default: 3000) |
| `NODE_ENV` | Environment mode | No (default: development) |

### Getting API Keys

1. **Google Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file

2. **OpenAI API Key** (optional):
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Add it to your `.env` file

## Development

### Available Scripts

- `npm start` - Start both frontend and backend
- `npm run start:frontend` - Start only frontend
- `npm run start:backend` - Start only backend
- `npm run build` - Build frontend for production
- `npm test` - Run frontend tests
- `npm run install:all` - Install all dependencies

### Code Style

The project uses:
- ESLint for JavaScript linting
- Prettier for code formatting
- Material-UI for consistent styling

## Troubleshooting

### Common Issues

1. **Port already in use**:
   - Change the port in the `.env` file
   - Or kill the process using the port

2. **API key errors**:
   - Ensure your API keys are valid
   - Check that the `.env` file is in the correct location

3. **Missing dependencies**:
   - Run `npm run install:all` to install all dependencies

4. **CORS errors**:
   - Ensure the backend is running on the correct port
   - Check that the frontend is making requests to the correct backend URL

### Performance Tips

- Use the latest version of Node.js
- Enable hardware acceleration in your browser
- Close unnecessary browser tabs
- Consider using a development build for better performance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section above
- Review the code comments for implementation details # word
