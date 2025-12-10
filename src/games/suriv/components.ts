import { Component, Vector } from '@/assets/emerald/core'
import type { Point } from 'pixi.js'

export class Movement extends Component {
  pos: Point

  constructor(public startPos: Point) {
    super()

    this.pos = startPos
  }
}
