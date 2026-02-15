import { Graphics, Rectangle, type PointData, type Size } from 'pixi.js'
import { Collider, RigidBody, Stage, type Components } from '@emerald'

export interface BoundWallOptions extends RigidBody.Options {
  layer: number
  color: number
  thickness: number
}

export function createBounds<C extends Components>(
  bounds: Rectangle,
  stage: Stage<C>,
  options?: Partial<BoundWallOptions>,
) {
  const thickness = options?.thickness ?? 100
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
  positionAndSizes.forEach(([pos, size]) => createBoundWall(pos, size, stage, options))
}

export function createBoundWall<C extends Components>(
  position: PointData,
  size: Size,
  stage: Stage<C>,
  options?: Partial<BoundWallOptions>,
) {
  stage
    .createSimpleEntity({
      tag: 'bound',
      position,
      children: [
        new Graphics()
          .rect(-size.width / 2, -size.height / 2, size.width, size.height)
          .fill({ color: options?.color ?? 0xffffff }),
      ],
    })
    .addComponents({
      collider: Collider.rectangle(size.width, size.height, {
        layer: options?.layer ?? 1,
      }),
      'rigid-body': new RigidBody({
        isStatic: true,
        ...options,
      }),
    } as Partial<C>)
}
