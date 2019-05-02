export interface ContainerConstructor {
  scene: Phaser.Scene
  x?: number
  y?: number
  children?: Phaser.GameObjects.GameObject[]
}

export interface SpriteConstructor {
  scene: Phaser.Scene
  x: number
  y: number
  texture: string
  frame?: string | integer
}
