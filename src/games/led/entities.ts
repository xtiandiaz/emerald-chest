import {
  type Stage,
  Camera,
  Collider,
  Collision,
  ERandomness,
  RayCast,
  RigidBody,
  Screen,
} from '@emerald'
import type { LedComponents } from './components'
import { Graphics, Point, Sprite, Texture } from 'pixi.js'
import { LedCollisionLayer } from './types'

export function createPlayer(stage: Stage<LedComponents>) {
  const radius = 32

  return stage
    .createSimpleEntity({
      tag: 'player',
      position: { x: Screen.width, y: Screen.height / 2 },
      children: [
        new Sprite({
          texture: Texture.from('blob.png'),
          width: radius * 2 + 4,
          height: radius * 2 + 4,
          anchor: { x: 0.5, y: 0.5 },
        }),
      ],
    })
    .addComponents({
      'rigid-body': new RigidBody({ restitution: 0 }),
      collider: Collider.circle(radius, { layer: LedCollisionLayer.PLAYER }),
      'ray-cast': new RayCast([
        'is-grounded',
        Collision.ray(new Point(), { x: 0, y: 1 }, radius * 1.1, LedCollisionLayer.PLATFORMS),
      ]),
      camera: new Camera({
        offset: { x: 0, y: -Screen.height * 0.125 },
        speed: 5,
        zoom: 1,
      }),
    })
}

export interface ForestOptions {
  baseScale: number
  tint: number
}

export function createForest(stage: Stage<LedComponents>, options?: Partial<ForestOptions>) {
  const treeTexture = Texture.from('tree.png')
  const scale = () => (0.75 + Math.random() * 0.25) * (options?.baseScale ?? 1)
  const length = stage.boundsArea.width

  return stage.createSimpleEntity({
    tag: 'forest',
    position: { x: 0, y: stage.boundsArea.bottom },
    children: Array.from({ length: 3 }).map(
      () =>
        new Sprite({
          anchor: { x: 0.5, y: 1 },
          texture: treeTexture,
          position: { x: Math.random() * length, y: 0 },
          scale: scale(),
          tint: options?.tint,
        }),
    ),
  })
}
