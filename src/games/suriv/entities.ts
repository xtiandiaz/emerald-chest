import { Entity, Screen, Vector } from '@/assets/emerald/core'
import { Tapping, Dragging, Swiping, RigidBody, Collider } from '@/assets/emerald/components'
import { Graphics, Point, Rectangle, Sprite, SpritePipe, type RoundedPoint } from 'pixi.js'
import { Movement } from './components'
import { GestureTarget } from '@/assets/emerald/components/GestureTarget'
import { GestureKey } from '@/assets/emerald/input'

export function createBoundaries(): Entity[] {
  const thickness = 100
  const offset = 0
  return Array(4)
    .fill(null)
    .map((_, i) => {
      switch (i) {
        case 0: // top
          return new Rectangle(0, -thickness + offset, Screen.width, thickness)
        case 1: // right
          return new Rectangle(Screen.width - offset, 0, thickness, Screen.height)
        case 2: // bottom
          return new Rectangle(0, Screen.height - offset, Screen.width, thickness)
        case 3: // left
        default:
          return new Rectangle(-thickness + offset, 0, thickness, Screen.height)
      }
    })
    .map((r, i) => {
      const e = new Entity()
      e.label = 'wall'
      e.addChild(new Graphics().rect(0, 0, r.width, r.height).fill(0xff0000))
      e.position.set(r.x, r.y)

      return e
    })
}

export function createPlayer(): Entity {
  const e = new Entity()
  e.label = 'player'
  e.addChild(new Graphics().circle(0, 0, 20).fill(0xffffff))

  const rb = e.addComponent(new RigidBody(Screen.width / 2, Screen.height / 2))
  rb.gravity.set(0, 0)
  // rb.rotation = Math.PI / 12
  // e.addComponent(Collider.rectangle(-20, -20, 40, 40))
  e.addComponent(Collider.circle(0, 0, 20))
  // rb.velocity = new Vector(1, 0)
  // rb.force = new Vector(10, -20)

  e.addComponent(new GestureTarget([GestureKey.Drag]))
  // e.addComponent(new Movement(new Point(rb.position.x, rb.position.y)))
  // p.addComponent(new Swiping()).onGesture = (g) => {
  //   pc.applyForce(g.direction.multiplyScalar(0.1))
  // }

  return e
}

export function createCollectable(): Entity {
  const e = new Entity()
  e.label = 'collectable'
  e.addChild(new Graphics().circle(0, 0, 10).stroke({ width: 3, color: 0xffffff }))

  const padding = 50
  const rb = e.addComponent(
    new RigidBody(
      padding + Math.random() * (Screen.width - 2 * padding),
      padding + Math.random() * (Screen.height - 2 * padding),
    ),
  )
  rb.isStatic = true

  // e.addComponent(Collider.circle(0, 0, 10))
  e.addComponent(Collider.rectangle(-10, -10, 20, 20))
  return e
}

const eR = 25
const eM = { w: eR * 1.5, h: eR * 2 }
const enemySPs = (offset: Point = new Point()): RoundedPoint[] => {
  return [
    [0, -eM.h / 2],
    [eM.w / 2, eM.h / 2],
    [0, eM.h / 3],
    [-eM.w / 2, eM.h / 2],
  ].map(([x, y]) => ({ x: x! + offset.x, y: y! + offset.y, radius: 2 }))
}

export function createEnemy(): Entity {
  const e = new Entity()
  e.label = 'enemy'
  e.addChild(new Graphics().roundShape(enemySPs(), eR).fill(0x000000))

  const pc = e.addComponent(new RigidBody(200, 200))
  pc.isStatic = true
  e.addComponent(Collider.polygon(...enemySPs().flatMap((p) => [p.x, p.y])))
  return e
}
