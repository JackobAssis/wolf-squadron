export class InputSystem {
  constructor(canvas, gameWidth = 480, gameHeight = 720) {
    this.canvas = canvas
    this.gameWidth = gameWidth
    this.gameHeight = gameHeight
    this.DEADZONE = 15
    this.JOYSTICK_RADIUS = 60
    this.keys = {}
    this.keysJustPressed = {}
    this.touch = {
      active: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      deltaX: 0,
      deltaY: 0,
      firing: false,
    }
    this._touchTapQueued = false
    this._touchSwipeUp = false
    this._touchSwipeDown = false
    this._touchSwipeLeft = false
    this._touchSwipeRight = false
    this._touchStartTime = 0

    this._onKeyDown = (e) => {
      if (!this.keys[e.code]) {
        this.keysJustPressed[e.code] = true
      }
      this.keys[e.code] = true
    }

    this._onKeyUp = (e) => {
      this.keys[e.code] = false
    }

    this._touchToGame = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect()
      return {
        x: (clientX - rect.left) * (this.gameWidth / rect.width),
        y: (clientY - rect.top) * (this.gameHeight / rect.height),
      }
    }

    this._onTouchStart = (e) => {
      e.preventDefault()
      const touch = e.touches[0]
      const pos = this._touchToGame(touch.clientX, touch.clientY)
      this.touch.active = true
      this.touch.startX = pos.x
      this.touch.startY = pos.y
      this.touch.currentX = pos.x
      this.touch.currentY = pos.y
      this.touch.deltaX = 0
      this.touch.deltaY = 0
      this._touchStartTime = Date.now()

      if (e.touches.length === 2) {
        this.touch.firing = true
      }
    }

    this._onTouchMove = (e) => {
      e.preventDefault()
      if (!this.touch.active) return
      const touch = e.touches[0]
      const pos = this._touchToGame(touch.clientX, touch.clientY)
      this.touch.currentX = pos.x
      this.touch.currentY = pos.y
      this.touch.deltaX = pos.x - this.touch.startX
      this.touch.deltaY = pos.y - this.touch.startY
    }

    this._onTouchEnd = (e) => {
      e.preventDefault()
      const elapsed = Date.now() - this._touchStartTime
      const dx = this.touch.deltaX
      const dy = this.touch.deltaY
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (elapsed < 300 && dist < 20) {
        this._touchTapQueued = true
      }

      if (elapsed < 500 && dist > 30) {
        if (Math.abs(dx) < Math.abs(dy)) {
          if (dy < 0) this._touchSwipeUp = true
          else this._touchSwipeDown = true
        } else {
          if (dx < 0) this._touchSwipeLeft = true
          else this._touchSwipeRight = true
        }
      }

      this.touch.active = false
      this.touch.deltaX = 0
      this.touch.deltaY = 0
      this.touch.firing = false
    }

    window.addEventListener('keydown', this._onKeyDown)
    window.addEventListener('keyup', this._onKeyUp)
    this.canvas.addEventListener('touchstart', this._onTouchStart, { passive: false })
    this.canvas.addEventListener('touchmove', this._onTouchMove, { passive: false })
    this.canvas.addEventListener('touchend', this._onTouchEnd, { passive: false })
    this.canvas.addEventListener('touchcancel', this._onTouchEnd, { passive: false })
  }

  isDown(code) {
    return !!this.keys[code]
  }

  justPressed(code) {
    return !!this.keysJustPressed[code]
  }

  clearJustPressed() {
    this.keysJustPressed = {}
    if (this._touchTapQueued) {
      this.keysJustPressed['Enter'] = true
      this._touchTapQueued = false
    }
    if (this._touchSwipeUp) {
      this.keysJustPressed['ArrowUp'] = true
      this._touchSwipeUp = false
    }
    if (this._touchSwipeDown) {
      this.keysJustPressed['ArrowDown'] = true
      this._touchSwipeDown = false
    }
    if (this._touchSwipeLeft) {
      this.keysJustPressed['ArrowLeft'] = true
      this._touchSwipeLeft = false
    }
    if (this._touchSwipeRight) {
      this.keysJustPressed['ArrowRight'] = true
      this._touchSwipeRight = false
    }
  }

  get horizontal() {
    if (this.touch.active) {
      const dx = this.touch.currentX - this.touch.startX
      const absDx = Math.abs(dx)
      if (absDx < this.DEADZONE) return 0
      const normalized = (absDx - this.DEADZONE) / (this.JOYSTICK_RADIUS - this.DEADZONE)
      return Math.sign(dx) * Math.min(1, normalized)
    }
    if (this.isDown('ArrowRight') || this.isDown('KeyD')) return 1
    if (this.isDown('ArrowLeft') || this.isDown('KeyA')) return -1
    return 0
  }

  get vertical() {
    if (this.touch.active) {
      const dy = this.touch.currentY - this.touch.startY
      const absDy = Math.abs(dy)
      if (absDy < this.DEADZONE) return 0
      const normalized = (absDy - this.DEADZONE) / (this.JOYSTICK_RADIUS - this.DEADZONE)
      return Math.sign(dy) * Math.min(1, normalized)
    }
    if (this.isDown('ArrowDown') || this.isDown('KeyS')) return 1
    if (this.isDown('ArrowUp') || this.isDown('KeyW')) return -1
    return 0
  }

  get firing() {
    if (this.touch.active) return this.touch.firing
    return this.isDown('Space')
  }

  destroy() {
    window.removeEventListener('keydown', this._onKeyDown)
    window.removeEventListener('keyup', this._onKeyUp)
    this.canvas.removeEventListener('touchstart', this._onTouchStart)
    this.canvas.removeEventListener('touchmove', this._onTouchMove)
    this.canvas.removeEventListener('touchend', this._onTouchEnd)
    this.canvas.removeEventListener('touchcancel', this._onTouchEnd)
  }
}
