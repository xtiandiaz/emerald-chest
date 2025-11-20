import { RenderableComponent, type Component } from '@/assets/emerald/core/component'
import type { Container, Rectangle } from 'pixi.js'
import { Graphics, Point } from 'pixi.js'
import 'pixi.js/math-extras'

export class Movement /* extends RenderableComponent */ {
  destination = new Point()

  private g = new Graphics()

  init() {
    // this.addChild(this.g)
  }

  start(): void {}

  // draw(bounds: Rectangle): void {
  //   this.g.rect(bounds.x, bounds.y, bounds.width, bounds.height)
  //   this.g.fill(0x000000)
  // }

  // resize(bounds: Rectangle): void {
  //   this.g.setSize(bounds.width, bounds.height)
  // }

  update(container: Container, _: number): void {
    container.position = container.position.add(
      this.destination.subtract(container.position).multiplyScalar(1 / 7),
    )
  }
}
