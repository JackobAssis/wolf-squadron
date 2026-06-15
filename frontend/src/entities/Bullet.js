export class BulletPool {
  constructor(poolSize = 200) {
    this.pool = []
    for (let i = 0; i < poolSize; i++) {
      this.pool.push(this._create())
    }
    this.activeCount = 0
  }

  _create() {
    return {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      speed: 500,
      damage: 10,
      radius: 3,
      active: false,
      type: 'laser',
    }
  }

  fire(x, y, vx, vy, type = 'laser', extra = {}) {
    for (const b of this.pool) {
      if (!b.active) {
        b.x = x
        b.y = y
        b.vx = vx
        b.vy = vy
        b.speed = extra.speed || 500
        b.damage = extra.damage || 10
        b.radius = extra.radius || 3
        b.type = type
        b.active = true
        this.activeCount++
        return b
      }
    }
    return null
  }

  firePlayer(x, y, type = 'laser', damage = 10, extraCount = 0) {
    const spread = 0.15
    const count = 1 + extraCount

    for (let i = 0; i < count; i++) {
      const offset = (i - (count - 1) / 2) * spread
      this.fire(x, y - 15, offset, -1, type, {
        speed: 500,
        damage,
        radius: 3,
      })
    }
  }

  update(dt, gameWidth, gameHeight) {
    for (const b of this.pool) {
      if (!b.active) continue
      b.x += b.vx * b.speed * dt
      b.y += b.vy * b.speed * dt
      if (b.y < -20 || b.y > gameHeight + 20 || b.x < -20 || b.x > gameWidth + 20) {
        b.active = false
        this.activeCount--
      }
    }
  }

  getActive() {
    return this.pool.filter(b => b.active)
  }

  render(ctx) {
    for (const b of this.pool) {
      if (!b.active) continue
      ctx.fillStyle = '#00ff41'
      ctx.beginPath()
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}
