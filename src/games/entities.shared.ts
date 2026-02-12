import { Graphics, Point, Rectangle, type PointData, type Size } from 'pixi.js'
import { Collider, RigidBody, Stage, Screen, type Components } from '@emerald'

export function createBounds<C extends Components>(
  bounds: Rectangle,
  layer: number,
  stage: Stage<C>,
  rigidBodyOptions?: Partial<RigidBody.Options>,
) {
  const thickness = 100
  const positionAndSizes: [PointData, Size][] = [
    [
      { x: bounds.left + bounds.width / 2, y: bounds.top - thickness / 2 },
      { width: bounds.width + thickness * 2, height: thickness },
    ],
    [
      { x: bounds.right + thickness / 2, y: bounds.height / 2 },
      { width: thickness, height: bounds.height },
    ],
    [
      { x: bounds.left + bounds.width / 2, y: bounds.bottom + thickness / 2 },
      { width: bounds.width + thickness * 2, height: thickness },
    ],
    [
      { x: bounds.left - thickness / 2, y: bounds.height / 2 },
      { width: thickness, height: bounds.height },
    ],
  ]
  positionAndSizes.forEach(([pos, size]) => createBound(pos, size, layer, stage, rigidBodyOptions))
}

export function createBound<C extends Components>(
  position: PointData,
  size: Size,
  layer: number,
  stage: Stage<C>,
  rigidBodyOptions?: Partial<RigidBody.Options>,
) {
  stage
    .createSimpleEntity({
      tag: 'bound',
      position,
      children: [
        new Graphics()
          .rect(-size.width / 2, -size.height / 2, size.width, size.height)
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
