import { Component } from '@/assets/emerald/core/component'
import { Graphics, type Rectangle } from 'pixi.js'

export class Blob extends Component {
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

  draw(rect: Rectangle): void {
    const g = this.graphics
    g.circle(0, 0, 20)
    g.fill(this.color)
  }
}
