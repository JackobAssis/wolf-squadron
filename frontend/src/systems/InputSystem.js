export class InputSystem {
  constructor(canvas) {
    this.canvas = canvas
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

    this._onKeyDown = (e) => {
      if (!this.keys[e.code]) {
        this.keysJustPressed[e.code] = true
      }
      this.keys[e.code] = true
    }

    this._onKeyUp = (e) => {
      this.keys[e.code] = false
    }

    this._onTouchStart = (e) => {
      e.preventDefault()
      const touch = e.touches[0]
      const rect = this.canvas.getBoundingClientRect()
      this.touch.active = true
      this.touch.startX = touch.clientX - rect.left
      this.touch.startY = touch.clientY - rect.top
      this.touch.currentX = this.touch.startX
      this.touch.currentY = this.touch.startY
      this.touch.deltaX = 0
      this.touch.deltaY = 0

      if (e.touches.length === 2) {
        this.touch.firing = true
      }
    }

    this._onTouchMove = (e) => {
      e.preventDefault()
      if (!this.touch.active) return
      const touch = e.touches[0]
      const rect = this.canvas.getBoundingClientRect()
      this.touch.currentX = touch.clientX - rect.left
      this.touch.currentY = touch.clientY - rect.top
      this.touch.deltaX = this.touch.currentX - this.touch.startX
      this.touch.deltaY = this.touch.currentY - this.touch.startY
    }

    this._onTouchEnd = (e) => {
      e.preventDefault()
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
  }

  get horizontal() {
    if (this.touch.active) {
      return Math.sign(this.touch.deltaX)
    }
    if (this.isDown('ArrowRight') || this.isDown('KeyD')) return 1
    if (this.isDown('ArrowLeft') || this.isDown('KeyA')) return -1
    return 0
  }

  get vertical() {
    if (this.touch.active) {
      return Math.sign(this.touch.deltaY)
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
