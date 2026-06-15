export class CollisionSystem {
  static circleCircle(a, b) {
    const dx = a.x - b.x
    const dy = a.y - b.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    return dist < a.radius + b.radius
  }

  static rectCircle(rect, circle) {
    const cx = Math.max(rect.x, Math.min(circle.x, rect.x + rect.w))
    const cy = Math.max(rect.y, Math.min(circle.y, rect.y + rect.h))
    const dx = circle.x - cx
    const dy = circle.y - cy
    return (dx * dx + dy * dy) < (circle.radius * circle.radius)
  }

  static checkBulletsEnemies(bullets, enemies) {
    const hits = []
    for (const b of bullets) {
      if (!b.active) continue
      for (const e of enemies) {
        if (!e.alive) continue
        if (CollisionSystem.circleCircle(b, e)) {
          hits.push({ bullet: b, enemy: e })
        }
      }
    }
    return hits
  }

  static checkPlayerEnemies(player, enemies) {
    if (!player.alive || player.invulnerable > 0) return []
    const hits = []
    for (const e of enemies) {
      if (!e.alive) continue
      if (CollisionSystem.circleCircle(player, e)) {
        hits.push(e)
      }
    }
    return hits
  }
}
