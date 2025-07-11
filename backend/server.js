import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import winston from 'winston';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import routes
import authRoutes from './routes/auth.js';
import documentRoutes from './routes/documents.js';
import aiRoutes from './routes/ai.js';
import collaborationRoutes from './routes/collaboration.js';
import templateRoutes from './routes/templates.js';

// Import middleware
import { authenticateToken } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import socket handlers
import { setupCollaborationSocket } from './sockets/collaboration.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const requiredEnv = ['MONGODB_URI', 'GEMINI_API_KEY'];
const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length) {
  logger.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'promptpad-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// AI-specific rate limiting
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 AI requests per minute
  message: 'Too many AI requests, please try again later.'
});
app.use('/api/ai/', aiLimiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/your-db";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => logger.info('Connected to MongoDB'))
.catch(err => logger.error('MongoDB connection error:', err));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Make AI instance available to routes
app.locals.genAI = genAI;
app.locals.logger = logger;

// Log Gemini model and API key status at startup
logger.info(`Gemini model: ${process.env.GEMINI_MODEL || 'gemini-2.0-flash'}`);
logger.info(`Gemini API key set: ${!!process.env.GEMINI_API_KEY}`);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', authenticateToken, documentRoutes);
app.use('/api/ai', authenticateToken, aiRoutes);
app.use('/api/collaboration', authenticateToken, collaborationRoutes);
app.use('/api/templates', templateRoutes);

// Legacy routes for backward compatibility
app.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.0-flash', apiKey: process.env.GEMINI_API_KEY });
    const result = await model.generateContent(prompt);
    const generatedText = result.response?.candidates[0]?.content?.parts[0]?.text || "No response from AI";
    res.json({ text: generatedText });
  } catch (error) {
    logger.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

app.post('/grammar', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });
    
    const prompt = `You are a grammar and spelling assistant. For the following text, find all grammar and spelling mistakes. For each mistake, return the offset (start index), length, suggested correction, and a short explanation. Respond in JSON array format: [{"offset":..., "length":..., "suggestion":..., "explanation":...}].\n\nText: """${text}"""`;
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.0-flash', apiKey: process.env.GEMINI_API_KEY });
    const result = await model.generateContent(prompt);
    const generatedText = result.response?.candidates[0]?.content?.parts[0]?.text || "[]";
    
    let suggestions = [];
    try {
      suggestions = JSON.parse(generatedText);
    } catch {
      suggestions = [];
    }
    res.json({ suggestions });
  } catch (error) {
    logger.error('Error in grammar check:', error);
    res.status(500).json({ error: 'Failed to check grammar' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Setup Socket.IO for real-time collaboration
setupCollaborationSocket(io, logger);

// Serve static files from the frontend build
app.use(express.static(join(__dirname, '../frontend/dist')));

// For any other route, serve index.html (for React Router)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../frontend/dist/index.html'));
});

// Error handling middleware (for API errors)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`🚀 PromptPad Backend running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});

export default app;