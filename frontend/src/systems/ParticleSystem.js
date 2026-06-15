export class ParticleSystem {
  constructor(poolSize = 300) {
    this.pool = []
    for (let i = 0; i < poolSize; i++) {
      this.pool.push({
        x: 0, y: 0, vx: 0, vy: 0,
        life: 0, maxLife: 0,
        radius: 2, color: '#00ff41',
        active: false,
      })
    }
  }

  emit(x, y, count = 8, color = '#00ff41', speed = 120, life = 0.4) {
    let spawned = 0
    for (const p of this.pool) {
      if (!p.active && spawned < count) {
        const angle = (Math.PI * 2 / count) * spawned + Math.random() * 0.5
        p.x = x
        p.y = y
        p.vx = Math.cos(angle) * speed * (0.5 + Math.random() * 0.5)
        p.vy = Math.sin(angle) * speed * (0.5 + Math.random() * 0.5)
        p.life = life * (0.5 + Math.random() * 0.5)
        p.maxLife = p.life
        p.radius = 1.5 + Math.random() * 2
        p.color = color
        p.active = true
        spawned++
      }
    }
  }

  emitExplosion(x, y, color = '#ff8800') {
    this.emit(x, y, 16, color, 200, 0.5)
    this.emit(x, y, 8, '#ffff00', 150, 0.3)
  }

  update(dt) {
    for (const p of this.pool) {
      if (!p.active) continue
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.life -= dt
      p.radius *= 0.97
      if (p.life <= 0) {
        p.active = false
      }
    }
  }

  render(ctx) {
    for (const p of this.pool) {
      if (!p.active) continue
      const alpha = p.life / p.maxLife
      ctx.globalAlpha = alpha
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }
}
