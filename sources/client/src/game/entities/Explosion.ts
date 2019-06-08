import { SpriteConstructor } from '@/@types/game'
import {PLAYER_DEPTH} from '@/constants'

export default class Explosion extends Phaser.GameObjects.Sprite {
  constructor (params: SpriteConstructor) {
    super(params.scene, params.x, params.y, params.texture, params.frame)
    params.scene.add.existing(this)
    this.setDepth(PLAYER_DEPTH)
    this.anims.play('explosions_first').once('animationcomplete', () => {
      this.destroy()
    })
  }
}
