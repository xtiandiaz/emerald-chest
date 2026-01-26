// import { Graphics, Rectangle, Point, Sprite, Texture, Container } from 'pixi.js'

// export class Card extends Container {
//   speed: number = 0

//   _sprite!: Sprite

//   initWithTexture(texture: Texture, size: number): void {
//     super.init()

//     this._sprite = (() => {
//       const sprite = new Sprite(texture)
//       if (texture.height > texture.width) {
//         sprite.setSize(size, (size * texture.height) / texture.width)
//       } else {
//         sprite.setSize((size * texture.width) / texture.height, size)
//       }
//       sprite.position = new Point(size - sprite.width, size - sprite.height)
//       return sprite
//     })()
//     this.addChild(this._sprite)

//     const mask = (() => {
//       const graphics = new Graphics()
//       graphics.roundRect(0, 0, size, size, 24)
//       graphics.fill(0x000000)
//       return graphics
//     })()

//     this.addChild(mask)
//     this._sprite.mask = mask

//     this.pivot.x = this.width / 2
//     this.pivot.y = this.height / 2

//     this.hitArea = new Rectangle(0, 0, size, size)
//     this.eventMode = 'dynamic'
//     this.cursor = 'pointer'
//   }

//   update(deltaTime: number): void {
//     this.rotation += 0.01 * deltaTime * this.speed
//   }
// }
