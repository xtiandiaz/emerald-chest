import { Assets, Container, Graphics, Rectangle, RoundedRectangle, Sprite, Texture } from 'pixi.js'
import { Component } from '../core/component'

export class Card extends Component {
  speed: number = 0

  _frontImgPath: string
  _sprite!: Sprite

  constructor(frontImgPath: string, term: string) {
    super()
    this._frontImgPath = frontImgPath
  }

  async init(): Promise<void> {
    const texture = await Assets.load(this._frontImgPath)

    this._sprite = (() => {
      const sprite = new Sprite(texture)
      sprite.setSize(200, 200)
      return sprite
    })()
    this.container.addChild(this._sprite)

    const mask = (() => {
      const graphics = new Graphics()
      graphics.roundRect(0, 0, 200, 200, 24)
      graphics.fill(0x000000)
      return graphics
    })()

    this.container.addChild(mask)
    this._sprite.mask = mask

    this.container.pivot.x = this.container.width / 2
    this.container.pivot.y = this.container.height / 2

    this.container.hitArea = new Rectangle(0, 0, 200, 200)
    this.container.eventMode = 'dynamic'
    this.container.cursor = 'pointer'
  }

  start(): void {
    this.container.onclick = () => {
      this.speed++
    }
  }

  update(deltaTime: number): void {
    this.container.rotation += 0.01 * deltaTime * this.speed
  }
}
