import { Sprites } from './sprite'

export type Color = string

export type LevelBackground = {
  from: Color,
  to: Color
}

export interface Body {
  x: number,
  y: number,
  width: number,
  height: number,
  texture?: string,
  pivot: {
    x: number,
    y: number
  }
}

export interface Level {
  title: string,
  background: LevelBackground,
  sprites: Sprites,
  bodies: Body[]
}
