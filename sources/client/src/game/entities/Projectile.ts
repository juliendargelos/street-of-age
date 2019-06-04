import { SpriteConstructor } from '@/@types/game'
import { GameScene } from '@/game/scenes/GameScene'
import { PLAYER_DEPTH } from '@/constants'
import {
  STRENGHT_ABILITY_ID
} from '@/assets/characters'
import { ClientCharacterAsset } from '@/@types'

interface Constructor extends SpriteConstructor{
  angle: number,
  distance: number,
  character: ClientCharacterAsset
}

class Projectile extends Phaser.Physics.Arcade.Sprite {
  private readonly character: ClientCharacterAsset

  constructor (params: Constructor) {
    super(params.scene, params.x, params.y, params.texture, params.frame)
    this.character = params.character
    params.scene.physics.world.enable(this)
    params.scene.add.existing(this)
    const scene = params.scene as GameScene
    scene.physics.add.collider(scene.level.colliders, this, (go, other) => {
      go.destroy(true)
    })
    scene.physics.add.collider(scene.level.floors, this, (go, other) => {
      go.destroy(true)
    })
    this
      .setDepth(PLAYER_DEPTH)
      .setGravityY(0)
      .setBounce(0.3)
      .setDisplaySize(40, 40)
      .updateDisplayOrigin()
  }

  public update (): void {
  }

  public applyImpulseForce (force: Phaser.Math.Vector2, duration: number = 0.1) {
    this.setAcceleration(force.x, force.y)
    this.scene.time.delayedCall(
      duration * 1000,
      () => {
        if (this) {
          this.setAcceleration(0, 0)
        }
      },
      [],
      null
    )
  }

  public launch = (forceAmount: number, direction: Phaser.Types.Math.Vector2Like) => {
    this.setGravityY(400 * (1 + this.character.projectile.mass / 10))
    const scaleForce = ((forceAmount / 4) * (1 + (this.character.stats[STRENGHT_ABILITY_ID].level * 3))) / this.character.projectile.mass
    const force = new Phaser.Math.Vector2(direction)
    force.scale(scaleForce)

    this.applyImpulseForce(force)
  }
}

export default Projectile
