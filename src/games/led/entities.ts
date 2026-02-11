import { type Stage, Collider, Collision, RayCast, RigidBody, Screen } from '@emerald'
import type { LedComponents } from './components'
import { Graphics, Point } from 'pixi.js'
import { LedCollisionLayer } from './types'

export function createPlayer(stage: Stage<LedComponents>) {
  const radius = 32
  return stage
    .createSimpleEntity({
      tag: 'player',
      position: { x: Screen.width / 2, y: Screen.height / 2 },
      children: [new Graphics().circle(0, 0, radius).fill({ color: 0xffffff })],
    })
    .addComponents({
      'rigid-body': new RigidBody({ restitution: 0 }),
      collider: Collider.circle(radius, { layer: LedCollisionLayer.PLAYER }),
      'ray-cast': new RayCast([
        'is-grounded',
        Collision.ray(new Point(), { x: 0, y: 1 }, radius * 1.5, LedCollisionLayer.PLATFORMS),
      ]),
    })
}
