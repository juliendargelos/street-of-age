import { SpriteConstructor } from '@/@types/game'
import { CharacterKind } from '@/store/modules/app'

interface Constructor extends SpriteConstructor{
  kind: CharacterKind
}

class MeleeAttack extends Phaser.Physics.Arcade.Sprite {
  private kind: CharacterKind
  constructor (params: Constructor) {
    super(params.scene, params.x, params.y, 'main', `${params.kind}_melee`)
    this.kind = params.kind
    this.setAlpha(0)
    params.scene.physics.world.enable(this)
    params.scene.add.existing(this)
    // this.anims.play(`${params.kind}_melee`, true)
  }
}
