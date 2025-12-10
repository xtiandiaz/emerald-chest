import { Entity, Screen, Vector } from '@/assets/emerald/core'
import { Physics, Tapping, Dragging, Swiping } from '@/assets/emerald/components'
import { Graphics, Point, Rectangle } from 'pixi.js'
import { Bodies } from 'matter-js'
import { Movement } from './components'

export function createBoundaries(): Entity[] {
  const thickness = 100
  const offset = 0
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
      e.label = 'wall'

      e.addChild(
        new Graphics().rect(-r!.width / 2, -r!.height / 2, r!.width, r!.height).fill(0xff0000),
      )
      e.addComponent(
        new Physics(
          Bodies.rectangle(r!.x, r!.y, r!.width, r!.height, {
            isStatic: true,
            label: e.label,
          }),
        ),
      )

      return e
    })
}

export function createPlayer(): Entity {
  const p = new Entity()
  p.label = 'player'
  p.addChild(new Graphics().circle(0, 0, 20).fill(0xffffff))

  const pc = p
    .addComponent(
      new Physics(
        Bodies.circle(Screen.width / 2, Screen.height / 2, 20, {
          restitution: 0.25,
          label: p.label,
        }),
      ),
    )
    .setGravity(0, 0)

  p.addComponent(new Movement(new Point(pc.position.x, pc.position.y)))
  // p.addComponent(new Swiping()).onGesture = (g) => {
  //   pc.applyForce(g.direction.multiplyScalar(0.1))
  // }

  return p
}

export function createCollectable(): Entity {
  const c = new Entity()
  c.label = 'collectable'
  c.addChild(new Graphics().circle(0, 0, 10).stroke({ width: 3, color: 0xffffff }))
  const padding = 50
  c.addComponent(
    new Physics(
      Bodies.circle(
        padding + Math.random() * (Screen.width - 2 * padding),
        padding + Math.random() * (Screen.height - 2 * padding),
        10,
        {
          isStatic: true,
          isSensor: true,
        },
      ),
    ),
  )
  return c
}

// update(_: number): void {
// let bodyPos = new Point().copyFrom(this.body!.position)
// bodyPos = bodyPos.add(this.controls.nextPos.subtract(this.body!.position).multiplyScalar(1 / 7))
// Body.setPosition(this.body!, bodyPos)
// }
