import {Collider} from '../@types/level'

interface Layer {
  options: {
    speed: number,
    depth: number
  }
  sprites: Sprite[],
  colliders: Collider[],
}

export type Layers = {
  [layer: string]: Layer
}

export interface Sprite {
  id?: string
  x: number,
  y: number,
  width: number,
  height: number,
  texture: string,
  frame?: string,
  pivot: {
    x: number,
    y: number
  }
}
