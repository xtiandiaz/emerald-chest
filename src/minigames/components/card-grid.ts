import { Component } from '@/assets/emerald/core/component'
import { Graphics, Point, Rectangle } from 'pixi.js'

export interface CardLayout {
  cardSize: number
  spacing: number
}

export class CardGrid extends Component {
  private _g = new Graphics()
  private _layout: CardLayout
  private _cols = 0

  constructor(layout: CardLayout) {
    super()

    this._layout = layout
  }

  get cols() {
    return this._cols
  }

  get rows() {
    return this._cols
  }

  init() {
    this.addChild(this._g)
  }

  draw(rect: Rectangle): void {
    const extent = Math.min(rect.width, rect.height)
    const cSize = this._layout.cardSize
    const cExtent = cSize + this._layout.spacing
    this._cols = Math.floor((extent + this._layout.spacing) / cExtent)

    const g = this._g
    g.clear()

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.cols; j++) {
        g.roundRect(rect.x + i * cExtent, rect.y + j * cExtent, cSize, cSize, 24)
      }
      g.fill({ color: 0x000000, alpha: 0.25 })
    }
  }

  getGlobalCellPosition(col: number, row: number): Point {
    const cSize = this._layout.cardSize
    const spc = this._layout.spacing

    return this.toGlobal(
      new Point(
        Math.floor(col) * (cSize + spc) + cSize / 2,
        Math.floor(row) * (cSize + spc) + cSize / 2,
      ),
    )
  }
}
