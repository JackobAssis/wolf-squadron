import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { scoreRoutes } from './routes/scores.js'
import { healthRoutes } from './routes/health.js'
import { statsRoutes } from './routes/stats.js'
import { errorHandler } from './middlewares/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
}))
app.use(express.json())

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: true, message: 'Too many requests', code: 'RATE_LIMITED' },
})
app.use('/api/', limiter)

app.use('/api/v1', healthRoutes)
app.use('/api/v1', scoreRoutes)
app.use('/api/v1', statsRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Wolf Squadron API running on port ${PORT}`)
})
