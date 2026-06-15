const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : 'http://localhost:3001/api/v1'

export const api = {
  async submitScore(scoreData) {
    try {
      const res = await fetch(`${API_BASE}/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scoreData),
      })
      return await res.json()
    } catch {
      return { error: true, message: 'Failed to connect to server' }
    }
  },

  async getLeaderboard(limit = 10, offset = 0) {
    try {
      const res = await fetch(`${API_BASE}/scores?limit=${limit}&offset=${offset}`)
      return await res.json()
    } catch {
      return { scores: [], total: 0 }
    }
  },

  async getTopPlayers(limit = 10) {
    try {
      const res = await fetch(`${API_BASE}/leaderboard/top/${limit}`)
      return await res.json()
    } catch {
      return []
    }
  },

  async getStats() {
    try {
      const res = await fetch(`${API_BASE}/stats`)
      return await res.json()
    } catch {
      return {}
    }
  },

  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`)
      return await res.json()
    } catch {
      return { status: 'offline' }
    }
  },
}
