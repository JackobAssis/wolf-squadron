import { Router } from 'express'
import { store } from '../store.js'

export const statsRoutes = Router()

statsRoutes.get('/stats', (_req, res) => {
  try {
    res.json(store.getStats())
  } catch (err) {
    console.error('Error fetching stats:', err)
    res.status(500).json({ error: true, message: 'Failed to fetch stats', code: 'INTERNAL_ERROR' })
  }
})
