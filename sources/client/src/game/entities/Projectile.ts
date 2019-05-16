import { SpriteConstructor } from '@/@types/game'
import { GameScene } from '@/game/scenes/GameScene'
import { PLAYER_DEPTH } from '@/constants'

interface Constructor extends SpriteConstructor{
  angle: number,
  distance: number
}

class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor (params: Constructor) {
    super(params.scene, params.x, params.y, params.texture, params.frame)
    params.scene.physics.world.enable(this)
    params.scene.add.existing(this)
    const scene = params.scene as GameScene
    scene.physics.add.collider(scene.level.bodies, this)
    scene.physics.add.collider(scene.level.floors, this)
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
      () => this.setAcceleration(0, 0),
      [],
      null
    )
  }

  public launch = (forceAmount: number, direction: Phaser.Types.Math.Vector2Like) => {
    this.setGravityY(500)

    const force = new Phaser.Math.Vector2(direction)
    force.scale(forceAmount)

    this.applyImpulseForce(force)
  }
}

export default Projectile
