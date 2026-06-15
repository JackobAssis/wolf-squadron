import { Scene } from './SceneManager.js'
import { SHIP_TYPES } from '../entities/Player.js'

export class ShipSelectScene extends Scene {
  enter() {
    this.selectedIndex = 0
    this.ships = Object.entries(SHIP_TYPES).map(([id, cfg]) => ({ id, ...cfg }))
  }

  update(input) {
    if (input.justPressed('ArrowLeft') || input.justPressed('KeyA')) {
      this.selectedIndex = (this.selectedIndex - 1 + this.ships.length) % this.ships.length
    }
    if (input.justPressed('ArrowRight') || input.justPressed('KeyD')) {
      this.selectedIndex = (this.selectedIndex + 1) % this.ships.length
    }
    if (input.justPressed('Enter') || input.justPressed('Space')) {
      this.manager.gameState = { shipType: this.ships[this.selectedIndex].id }
      this.manager.switchTo('gameplay')
    }
    if (input.justPressed('Escape') || input.justPressed('KeyQ')) {
      this.manager.switchTo('menu')
    }
  }

  render(ctx, gw, gh) {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, gw, gh)

    ctx.fillStyle = '#00ff41'
    ctx.font = 'bold 20px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('SELECIONE SUA NAVE', gw / 2, 80)

    const ship = this.ships[this.selectedIndex]
    const cx = gw / 2
    const cy = gh / 2 - 30

    ctx.strokeStyle = '#00ff41'
    ctx.lineWidth = 2
    ctx.strokeRect(cx - 70, cy - 50, 140, 100)

    ctx.fillStyle = '#00ff41'
    ctx.font = 'bold 16px monospace'
    ctx.fillText(ship.label, cx, cy - 20)

    ctx.fillStyle = '#0d2b1d'
    ctx.font = '11px monospace'
    const stats = [
      `Velocidade: ${ship.speed}`,
      `HP: ${ship.hp}`,
      `Arma: ${ship.weapon}`,
    ]
    stats.forEach((s, i) => {
      ctx.fillText(s, cx, cy + 10 + i * 16)
    })

    ctx.fillStyle = '#0d2b1d'
    ctx.font = '10px monospace'
    ctx.fillText('◄  ←/A →/D  ►', gw / 2, cy + 80)
    ctx.fillText('ENTER para confirmar | ESC/Q voltar', gw / 2, gh - 60)
  }
}
