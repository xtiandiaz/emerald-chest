export type Face = 'top' | 'right' | 'bottom' | 'left'

export enum FizzCollisionLayer {
  PLAYER = 1 << 0,
  COLLECTIBLE = 1 << 1,
  FOE = 1 << 2,
  BULLET = 1 << 3,
  BOUND = 1 << 4,
}

export enum FizzColor {
  PLAYER = 0x00ff96,
  FOE = 0xff0055,
}
