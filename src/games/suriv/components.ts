import type { Graphics, PointData, RoundedPoint } from 'pixi.js'
import { Component } from '@/assets/emerald/core'
import { Color } from './types'

export class PlayerSkin extends Component {
  shapePoints: PointData[]
  tailPoint: RoundedPoint

  constructor(public readonly radius: number) {
    super()

    this.shapePoints = [
      { x: 0, y: -radius },
      { x: radius, y: 0 },
      { x: 0, y: radius },
      { x: -radius, y: 0 },
    ]
    this.tailPoint = this.shapePoints[3]!
  }

  draw(g: Graphics) {
    g.roundShape(this.shapePoints, this.radius, true, 0)
      // .fill({ color: Color.Energy })
      .stroke({ width: 5, color: Color.Energy })
  }
}
