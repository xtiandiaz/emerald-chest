import { Scene } from '../core/scene'
import { Card } from '../components/card'
import { Color, ColorScheme, schemeColor } from '@/assets/design-tokens/palette'

export interface Options {
  speed: number
}

export class TestScene extends Scene<Options> {
  _cards: Card[] = [new Card('/img/hummingbird.jpg', 'Hummingbird')]

  async init(): Promise<void> {
    await super.init({
      background: schemeColor(ColorScheme.Light, Color.Mint),
    })

    for await (const card of this._cards) {
      await card.init()

      card.container.position.x = this.screen.width / 2
      card.container.position.y = this.screen.height / 2
      this.add(card)
    }
  }

  start(): void {
    super.start()
    this._cards.forEach((c) => c.start())
  }

  hastenCards(): void {
    this._cards.forEach((c) => c.speed++)
  }

  update(deltaTime: number): void {
    super.update(deltaTime)
  }
}
