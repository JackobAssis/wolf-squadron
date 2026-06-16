import { Scene } from './SceneManager.js'

const VALID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'

export class NameInputScene extends Scene {
  enter() {
    this.playerName = ''
    this.confirmed = false
    this.maxLength = 12
    this.flashTimer = 0

    this._onKeyDown = (e) => {
      if (this.confirmed) return
      const key = e.key.toUpperCase()
      if (e.key === 'Enter') {
        this.confirmed = true
        this._finish()
        return
      }
      if (e.key === 'Backspace') {
        this.playerName = this.playerName.slice(0, -1)
        e.preventDefault()
        return
      }
      if (e.key === 'Escape') {
        this.playerName = ''
        this.confirmed = true
        this._finish()
        return
      }
      if (this.playerName.length >= this.maxLength) return
      if (VALID_CHARS.includes(key)) {
        this.playerName += key
      }
    }

    window.addEventListener('keydown', this._onKeyDown)
  }

  exit() {
    window.removeEventListener('keydown', this._onKeyDown)
    if (this._input) {
      document.body.removeChild(this._input)
      this._input = null
    }
  }

  _finish() {
    const name = this.playerName.trim() || 'ACE_WOLF'
    const gameState = this.manager.gameState || {}
    if (gameState._pendingScore) {
      const s = gameState._pendingScore
      s.scoreSystem.saveScore(name, s.waves, s.shipType, s.bossesDefeated, s.upgradesSelected)
    }
    this.manager.switchTo('ranking')
  }

  update(input, dt) {
    this.flashTimer += dt
  }

  render(ctx, gw, gh) {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, gw, gh)

    ctx.fillStyle = '#00ff41'
    ctx.font = 'bold 20px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('ENTER YOUR CALLSIGN', gw / 2, 160)

    ctx.fillStyle = '#0d2b1d'
    ctx.font = '11px monospace'
    ctx.fillText('Max 12 caracteres | ENTER confirmar | ESC pular', gw / 2, 190)

    const display = this.playerName.padEnd(this.maxLength, '_')
    const prefix = this.playerName.length < this.maxLength && Math.floor(this.flashTimer * 4) % 2 === 0
      ? display.slice(0, this.playerName.length) + '█' + display.slice(this.playerName.length + 1)
      : display

    ctx.fillStyle = '#00ff41'
    ctx.font = 'bold 32px monospace'
    ctx.fillText(prefix, gw / 2, 300)

    ctx.fillStyle = '#0d2b1d'
    ctx.font = '10px monospace'
    ctx.fillText('Use o teclado para digitar seu nome', gw / 2, 380)

    ctx.fillStyle = '#0d2b1d'
    ctx.font = '12px monospace'
    ctx.fillText('Pressione ENTER para continuar', gw / 2, gh - 60)
  }
}
