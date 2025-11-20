import { Entity } from '@/assets/emerald/core/entity'
import { Graphics, type Rectangle } from 'pixi.js'

export class Blob extends Entity {
  private color: number
  private graphics = new Graphics()

  constructor(color: number) {
    super()
    this.color = color
  }

  init(): void {
    super.init()

    this.addChild(this.graphics)
  }

  draw(bounds: Rectangle): void {
    super.draw(bounds)

    const g = this.graphics
    g.circle(0, 0, 20)
    g.fill(this.color)
  }
}
