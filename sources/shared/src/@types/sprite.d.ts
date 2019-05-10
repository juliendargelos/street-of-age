export type Sprites = { [layer: string]: Sprite[] }

export interface Sprite {
  id?: string
  x: number,
  y: number,
  width: number,
  height: number,
  texture: string,
  frame?: string
}
