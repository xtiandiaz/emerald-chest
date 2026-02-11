import { Graphics, Point, type PointData, type Size } from 'pixi.js'
import { Collider, RigidBody, Stage, Screen, type Components } from '@emerald'
import type { Bound } from './types.shared'

export function createBound<C extends Components>(
  stage: Stage<C>,
  bound: Bound,
  layer: number,
  rigidBodyOptions?: Partial<RigidBody.Options>,
) {
  const thickness = 100
  const [position, size] = ((): [PointData, Size] => {
    switch (bound) {
      case 'top':
        return [
          new Point(Screen.width / 2, -thickness / 2),
          { width: Screen.width + thickness * 2, height: thickness },
        ]
      case 'right':
        return [
          new Point(Screen.width + thickness / 2, Screen.height / 2),
          { width: thickness, height: Screen.height },
        ]
      case 'bottom':
        return [
          new Point(Screen.width / 2, Screen.height + thickness / 2),
          { width: Screen.width + thickness * 2, height: thickness },
        ]
      case 'left':
        return [
          new Point(-thickness / 2, Screen.height / 2),
          { width: thickness, height: Screen.height },
        ]
    }
  })()

  stage
    .createSimpleEntity({
      tag: 'bound',
      position,
      children: [
        new Graphics()
          .rect(
            position.x + -size.width / 2,
            position.y + -size.height / 2,
            size.width,
            size.height,
          )
          .fill({ color: 0xffffff }),
      ],
    })
    .addComponents({
      collider: Collider.rectangle(size.width, size.height, {
        layer,
      }),
      'rigid-body': new RigidBody({
        isStatic: true,
        ...rigidBodyOptions,
      }),
    } as Partial<C>)
}
