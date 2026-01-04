import type { PointData } from 'pixi.js'
import { BEZIER_CIRCLE_CP_LENGTH as CP_LEN } from '@/assets/emerald'

export function createCircleBezierCurves(startPoint: PointData, radius: number) {
  return [
    {
      c0: { x: radius * CP_LEN, y: -radius },
      p: { x: radius, y: 0 },
      c1: { x: radius, y: -radius * CP_LEN },
    },
    {
      c0: { x: radius, y: radius * CP_LEN },
      p: { x: 0, y: radius },
      c1: { x: radius * CP_LEN, y: radius },
    },
    {
      c0: { x: -radius * CP_LEN, y: radius },
      p: { x: -radius, y: 0 },
      c1: { x: -radius, y: radius * CP_LEN },
    },
    {
      c0: { x: -radius, y: -radius * CP_LEN },
      p: startPoint,
      c1: { x: -radius * CP_LEN, y: -radius },
    },
  ]
}
