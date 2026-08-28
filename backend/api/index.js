import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'
import projectRoutes from './routes/projectRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import mediaRoutes from './routes/mediaRoutes.js'
import settingsRoutes from './routes/settingsRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'

// Load .env from backend directory or backend/api directory
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })
dotenv.config({ path: path.join(__dirname, '.env') })

// ─── PROCESS ERROR HANDLERS ──────────────────────────────────────────────────
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err)
})

// ─── EXPRESS APP SETUP ───────────────────────────────────────────────────────
const app = express()
const clientOrigin = process.env.CLIENT_URL || 'http://localhost:5173'

// Trust proxy for Vercel / reverse proxy rate limiting
app.set('trust proxy', 1)

// ─── REQUEST LOGGER MIDDLEWARE ──────────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now()
  const { method, url } = req

  console.log(`[${new Date().toISOString()}] 🛫 ${method} ${url} - Starting request`)

  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`[${new Date().toISOString()}] 🛬 ${method} ${url} - Finished (${res.statusCode}) in ${duration}ms`)
  })

  next()
})

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
)

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin or local/client origin
      if (!origin || origin === clientOrigin || origin.startsWith('http://localhost')) {
        callback(null, true)
      } else {
        callback(null, true)
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// Body parser middleware
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ limit: '5mb', extended: true }))

// Rate limiting (100 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
})
app.use(limiter)

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    service: 'Vivek Kumar Portfolio API',
  })
})

// ─── STATIC UPLOADS SERVING ──────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// ─── API ROUTES ──────────────────────────────────────────────────────────────
app.use('/api/settings', settingsRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/media', mediaRoutes)

// ─── 404 HANDLER ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  console.warn(`[404] Route not found: ${req.method} ${req.path}`)
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
  })
})

// ─── ERROR HANDLER ───────────────────────────────────────────────────────────
app.use(errorHandler)

// ─── LOCAL DEVELOPMENT SERVER ────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000
  const server = app.listen(PORT, () => {
    console.log(`✅ Backend server running on http://localhost:${PORT}`)
    console.log(`🌐 Frontend configured for: ${clientOrigin}`)
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`)
  })

  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...')
    server.close(() => {
      console.log('Server closed')
      process.exit(0)
    })
  })
}

export default app
