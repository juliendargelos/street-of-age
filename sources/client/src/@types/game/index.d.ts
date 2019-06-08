import { CharacterKind } from '@/store/modules/app'

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

export interface CharacterConstructor {
  scene: Phaser.Scene
  kind: CharacterKind
  x: number
  y: number
  velocityX: number
  velocityY: number
}
