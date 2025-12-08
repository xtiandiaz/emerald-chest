import { Entity, Screen } from '@/assets/emerald/core'
import { PhysicsComponent, GestureTargetComponent } from '@/assets/emerald/components'
import { Graphics, Rectangle, Point, Sprite } from 'pixi.js'
import { Bodies } from 'matter-js'
import { PlayerComponent } from './components'
import { GestureKey } from '@/assets/emerald/input'

export function createBoundaries(): Entity[] {
  const thickness = 100
  const offset = 10
  return Array(4)
    .fill(null)
    .map((_, i) => {
      switch (i) {
        case 0: // top
          return new Rectangle(Screen.width / 2, -thickness / 2 + offset, Screen.width, thickness)
        case 1: // right
          return new Rectangle(
            Screen.width + thickness / 2 - offset,
            Screen.height / 2,
            thickness,
            Screen.height,
          )
        case 2: // bottom
          return new Rectangle(
            Screen.width / 2,
            Screen.height + thickness / 2 - offset,
            Screen.width,
            thickness,
          )
        case 3: // left
          return new Rectangle(-thickness / 2 + offset, Screen.height / 2, thickness, Screen.height)
      }
    })
    .map((r, i) => {
      const e = new Entity()
      e.label = 'wall' + i

      e.addChild(
        new Graphics().rect(-r!.width / 2, -r!.height / 2, r!.width, r!.height).fill(0xff0000),
      )
      e.addComponent(
        PhysicsComponent,
        Bodies.rectangle(r!.x, r!.y, r!.width, r!.height, {
          isStatic: true,
          label: e.label,
        }),
      )
      return e
    })
}

export function createPlayer(): Entity {
  const p = new Entity('player')
  p.hitArea = new Rectangle(-20, -20, 40, 40)

  p.addChild(new Graphics().circle(0, 0, 20).fill(0xffffff))
  p.addComponent(GestureTargetComponent, [GestureKey.Tap, GestureKey.Drag])
  p.addComponent(PlayerComponent)
  p.addComponent(
    PhysicsComponent,
    Bodies.circle(Screen.width / 2, Screen.height / 2, 20, {
      restitution: 0.25,
      label: p.label,
    }),
  )

  return p
}

// update(_: number): void {
// let bodyPos = new Point().copyFrom(this.body!.position)
// bodyPos = bodyPos.add(this.controls.nextPos.subtract(this.body!.position).multiplyScalar(1 / 7))
// Body.setPosition(this.body!, bodyPos)
// }
