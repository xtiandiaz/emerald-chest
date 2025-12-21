import type { PointData, RoundedPoint } from 'pixi.js'
import { Component } from '@/assets/emerald/core'

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
}
