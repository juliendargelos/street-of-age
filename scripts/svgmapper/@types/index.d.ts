type Color = string

type Sprites = { [layer: string]: Sprite[] }

export interface Sprite {
  id?: string
  x: number,
  y: number,
  width: number,
  height: number,
  sprite: string
}

export interface Body {
  x: number,
  y: number,
  width: number,
  height: number,
  sprite: string
}

export interface Level {
  title: string,
  background: {
    from: Color,
    to: Color
  },
  sprites: Sprites,
  bodies: Body[]
}