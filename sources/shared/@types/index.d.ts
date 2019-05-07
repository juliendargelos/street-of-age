export type Color = string

export type LevelBackground = {
  from: Color,
  to: Color
}

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

export interface Body {
  x: number,
  y: number,
  width: number,
  height: number,
  texture?: string
}

export interface Level {
  title: string,
  background: LevelBackground,
  sprites: Sprites,
  bodies: Body[]
}
