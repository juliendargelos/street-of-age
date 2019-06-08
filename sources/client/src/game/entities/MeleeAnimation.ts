import { SpriteConstructor } from '@/@types/game'
import { PLAYER_DEPTH } from '@/constants'

interface Constructor {
  scene: Phaser.Scene,
  x: number,
  y: number,
  kind: string,
  offsetY?: number
  offsetX?: number,
  scaleX: number,
}

export default class MeleeAnimation extends Phaser.GameObjects.Sprite {
  constructor (params: Constructor) {
    super(params.scene, params.x, params.y, 'explosions')
    params.scene.add.existing(this)
    try {
      this
        .setOrigin((params.offsetX ? params.offsetX : 0), 0.5 + (params.offsetY ? params.offsetY : 0))
        .setDepth(PLAYER_DEPTH)
      this.scaleX = params.scaleX
      this.anims.play(`${params.kind}_melee_attack`).once('animationcomplete', () => {
        this.destroy()
      })
    } catch (e) {
      this.destroy()
    }
  }
}
