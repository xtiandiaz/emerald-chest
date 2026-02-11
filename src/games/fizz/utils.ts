import { TilingSprite, type PointData } from 'pixi.js'
import { Screen, BEZIER_CIRCLE_CP_LENGTH as CP_LEN } from '@emerald'
import { FizzColor } from './types'

export function createStaticGrid() {
  const tSprite = TilingSprite.from('grid')
  tSprite.tint = FizzColor.PLAYER
  tSprite.alpha = 0.1

  tSprite.width = Screen.width
  tSprite.height = Screen.height

  const vUnits = 5
  const tileSize = Screen.height / vUnits
  const tileScale = tileSize / tSprite.texture.height
  tSprite.tileScale = tileScale
  tSprite.tilePosition = {
    x: (Screen.width % tileSize) * 0.5,
    y: (Screen.height % tileSize) * 0.5,
  }

  return tSprite
}

export function createCircleBezierCurves(startPoint: PointData, radius: number) {
  return [
    {
      c0: { x: radius * CP_LEN, y: -radius },
      p: { x: radius, y: 0 },
      c1: { x: radius, y: -radius * CP_LEN },
    },
    {
      c0: { x: radius, y: radius * CP_LEN },
      p: { x: 0, y: radius },
      c1: { x: radius * CP_LEN, y: radius },
    },
    {
      c0: { x: -radius * CP_LEN, y: radius },
      p: { x: -radius, y: 0 },
      c1: { x: -radius, y: radius * CP_LEN },
    },
    {
      c0: { x: -radius, y: -radius * CP_LEN },
      p: startPoint,
      c1: { x: -radius * CP_LEN, y: -radius },
    },
  ]
}
