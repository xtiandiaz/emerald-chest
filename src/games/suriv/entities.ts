import { Graphics, Point, Rectangle, type RoundedPoint } from 'pixi.js'
import { Collider, Entity, GestureKey, GestureTarget, Screen, Tweener } from '@/assets/emerald'
import { CollisionLayer, Color } from './types'
import { PlayerSkin } from './components'

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
  e.position.set(200, 200)

  // const pc = e.addComponent(new RigidBody(200, 200))
  // pc.gravity.set(0, 0)

  e.addComponent(Collider.polygon(...enemySPs().flatMap((p) => [p.x, p.y]))).layer =
    CollisionLayer.Enemy

  return e
}
