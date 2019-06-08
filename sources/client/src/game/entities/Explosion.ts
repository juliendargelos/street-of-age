import { PLAYER_DEPTH } from '@/constants'

interface Constructor {
  scene: Phaser.Scene,
  x: number,
  y: number,
  explosion: string
}

export default class Explosion extends Phaser.GameObjects.Sprite {
  constructor (params: Constructor) {
    super(params.scene, params.x, params.y, 'explosions')
    params.scene.add.existing(this)
    this.setDepth(PLAYER_DEPTH)
    this.anims.play(params.explosion).once('animationcomplete', () => {
      this.destroy()
    })
  }
}
