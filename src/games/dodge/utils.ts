import { TilingSprite } from 'pixi.js'
import { Screen } from '@emerald'
import { DodgeColor } from './types'

export function createStaticGrid() {
  const tSprite = TilingSprite.from('grid')
  tSprite.tint = DodgeColor.PLAYER
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
