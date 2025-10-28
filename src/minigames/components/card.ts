import { Graphics, Rectangle, Sprite, Texture } from 'pixi.js'
import { Component } from '@/assets/emerald/core/component'

export class Card extends Component {
  speed: number = 0.1

  _texture: Texture
  _sprite!: Sprite

  constructor(texture: Texture, term: string) {
    super()
    this._texture = texture
  }

  init(): void {
    this._sprite = (() => {
      const sprite = new Sprite(this._texture)
      sprite.setSize(200, 200)
      return sprite
    })()
    this.addChild(this._sprite)

    const mask = (() => {
      const graphics = new Graphics()
      graphics.roundRect(0, 0, 200, 200, 24)
      graphics.fill(0x000000)
      return graphics
    })()

    this.addChild(mask)
    this._sprite.mask = mask

    this.pivot.x = this.width / 2
    this.pivot.y = this.height / 2

    this.hitArea = new Rectangle(0, 0, 200, 200)
    this.eventMode = 'dynamic'
    this.cursor = 'pointer'
  }

  update(deltaTime: number): void {
    this.rotation += 0.01 * deltaTime * this.speed
  }
}
