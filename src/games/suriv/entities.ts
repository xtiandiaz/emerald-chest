import { Graphics, Point, Rectangle, Sprite, SpritePipe, type RoundedPoint } from 'pixi.js'
import { Collider, Entity, GestureKey, GestureTarget, Screen, Tweener } from '@/assets/emerald'
import { CollisionLayer, Color } from './types'

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
  const r = 16
  e.addChild(
    new Graphics().roundRect(-r, -r, r * 2, r * 2, r).stroke({
      width: 5,
      color: Color.Energy,
    }),
  )
  e.position.set(Screen.width / 2, Screen.height / 2)

  // const rb = e.addComponent(new RigidBody(Screen.width / 2, Screen.height / 2))
  // rb.gravity.set(0, 0)
  // rb.rotation = Math.PI / 12
  // rb.velocity = new Vector(1, 0)
  // rb.force = new Vector(10, -20)
  // e.addComponent(Collider.rectangle(-20, -20, 40, 40))
  e.addComponent(Collider.circle(0, 0, r)).layer = CollisionLayer.Player
  e.addComponent(new GestureTarget([GestureKey.Drag]))

  return e
}

export function createCollectable(): Entity {
  const e = new Entity()
  e.label = 'collectable'
  e.addChild(new Graphics().roundPoly(0, 0, 12, 5, 2).stroke({ width: 3, color: Color.Energy }))
  const padding = 50
  e.position.set(
    padding + Math.random() * (Screen.width - 2 * padding),
    padding + Math.random() * (Screen.height - 2 * padding),
  )
  e.addComponent(Collider.circle(0, 0, 10)).layer = CollisionLayer.Collectable

  e.start = () => {
    Tweener.shared
      .timeline()
      .to(e, {
        pixi: { rotation: 45 },
        startAt: { pixi: { rotation: -45 } },
        ease: 'power3.inOut',
        duration: 1,
      })
      .to(e, { pixi: { rotation: -45 }, ease: 'power3.inOut', duration: 1 })
      .repeat(-1)
  }

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
  e.position.set(200, 200)

  // const pc = e.addComponent(new RigidBody(200, 200))
  // pc.gravity.set(0, 0)

  e.addComponent(Collider.polygon(...enemySPs().flatMap((p) => [p.x, p.y]))).layer =
    CollisionLayer.Enemy

  return e
}
