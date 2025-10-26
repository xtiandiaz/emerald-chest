import { Scene } from '@/assets/emerald/core/scene'
import { Card } from '../components/card'
import { Color, ColorScheme, schemeColor } from '@/assets/design-tokens/palette'
import { Assets, Texture } from 'pixi.js'
import { Ease } from '@/assets/emerald/core/tweener'

export interface Options {
  speed: number
}

export class TestScene extends Scene<Options> {
  _imgPaths: string[] = ['/img/hummingbird.jpg']
  _cards: Card[] = []

  async init(): Promise<void> {
    await super.init({
      background: schemeColor(ColorScheme.Light, Color.Mint),
    })

    await Assets.load(this._imgPaths)

    for await (const texturePath of this._imgPaths) {
      const texture = Texture.from(texturePath)
      const card = new Card(texture, '')
      card.init()

      this._cards.push(card)
      this.add(card)
    }

    this.centerCards()
  }

  start(): void {
    super.start()
    this._cards.forEach((c) => c.start())
  }

  async animateCards(): Promise<void> {
    for await (const card of this._cards) {
      await this.tweener.tween(card, 'rotation', card.rotation + Math.PI, 2, Ease.BackOut(1))
      this.destroy(card.id!)
    }
  }

  centerCards(): void {
    for (const card of this._cards) {
      card.position.x = this.screen.width / 2
      card.position.y = this.screen.height / 2
    }
  }

  update(deltaTime: number): void {
    super.update(deltaTime)
  }

  onResize(): void {
    this.centerCards()
  }
}
