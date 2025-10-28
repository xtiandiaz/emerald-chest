import { Scene } from '@/assets/emerald/core/scene'
import { Card } from '../components/card'
import { Assets, Texture, type ApplicationOptions } from 'pixi.js'
import { Tweener, Ease } from '@/assets/emerald/core/tweener'
import { Color, ColorScheme, schemeColor } from '@/assets/design-tokens/palette'

export interface Options {
  speed: number
}

export class TestScene extends Scene {
  _imgPaths: string[] = ['/img/hummingbird.jpg']
  _cards: Card[] = []

  async init(options?: Partial<ApplicationOptions>): Promise<void> {
    await super.init({
      background: schemeColor(ColorScheme.Light, Color.Orange),
      ...options,
    })

    await Assets.load(this._imgPaths)

    for (const texturePath of this._imgPaths) {
      const texture = Texture.from(texturePath)
      const card = new Card(texture, '')
      card.init()

      this.addEntity(card)
      this._cards.push(card)
    }

    this._centerCards()
  }

  onResize(): void {
    this._centerCards()
  }

  async animateCards(): Promise<void> {
    for await (const card of this._cards) {
      await Tweener.shared.tween(card, 'rotation', card.rotation + Math.PI, 2, Ease.BackOut(1))
      this.destroyEntity(card.id)
    }
  }

  private _centerCards(): void {
    for (const card of this._cards) {
      card.position.x = this.screen.width / 2
      card.position.y = this.screen.height / 2
    }
  }
}
