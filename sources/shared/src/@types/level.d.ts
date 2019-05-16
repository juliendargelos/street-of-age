import { Layers } from './sprite'

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type Color = string

export type LevelBackground = {
  from: Color,
  to: Color
}

export interface Floor extends Omit<Body, 'texture'> {
  color: number
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
  width: number,
  height: number,
  background: LevelBackground,
  layers: Layers,
  bodies: Body[],
  floors: Floor[],
}
