import { SpriteConstructor } from '@/@types/game'
import { GameScene } from '@/game/scenes/GameScene'
import { PLAYER_DEPTH } from '@/constants'
import {
  DISTANCE_ABILITY_ID
} from '@/assets/characters'
import { ClientCharacterAsset } from '@/@types'
import { Emitter } from '@/main'
import { GameEvents } from '@street-of-age/shared/game/events'

const BULLET_FORCE = 10000

interface Constructor {
  scene: Phaser.Scene,
  x: number,
  y: number
  angle: number,
  distance: number,
  character: ClientCharacterAsset
}

class Projectile extends Phaser.Physics.Arcade.Sprite {
  private readonly character: ClientCharacterAsset
  private bounces: number = 0

  constructor (params: Constructor) {
    super(params.scene, params.x, params.y, 'main', `main/weapons/${params.character.kind}`)
    this.character = params.character
    params.scene.physics.world.enable(this)
    params.scene.add.existing(this)
    const scene = params.scene as GameScene
    scene.physics.add.collider(scene.level.colliders, this, this.onCollide.bind(this))
    scene.physics.add.collider(scene.level.floors, this, this.onCollide.bind(this))
    this
      .setDepth(PLAYER_DEPTH)
      .setGravityY(0)
      .setDrag(this.character.projectile.bulletLike ? 0 : this.character.projectile.deceleration)
      .setAngularDrag(this.character.projectile.bulletLike ? 0 : this.character.projectile.deceleration)
      .setBounce(this.character.projectile.bounciness)
    this.body.setSize(20, 20)
  }

  public onCollide (go: Phaser.GameObjects.GameObject, other: Phaser.GameObjects.GameObject): void {
    if (this.character.projectile.bounceTtl && this.bounces >= this.character.projectile.bounceTtl) {
      this.onDestroy()
      return
    }
    this.bounces++
    if (this.character.projectile.bulletLike) {
      this.onDestroy()
    }
  }

  public onDestroy (): void {
    Emitter.emit(GameEvents.ProjectileExploded, { x: this.x, y: this.y, ...this.character.projectile })
    this.destroy()
  }

  public update (): void {
  }

  public applyImpulseForce (force: Phaser.Math.Vector2, duration: number = 0.1) {
    this.setAcceleration(force.x, force.y)
    this.setAngularAcceleration(force.x * 2)
    this.scene.time.delayedCall(
      duration * 1000,
      () => {
        try {
          this.setAcceleration(0, 0)
          this.setAngularAcceleration(0)
        } catch (e) {

        }
      },
      [],
      null
    )
  }

  public launch = (forceAmount: number, direction: Phaser.Types.Math.Vector2Like) => {
    // this.scene.cameras.main.startFollow(this, false, 0.1, 0.1)
    const gravityY = this.character.projectile.bulletLike ? 100 : 550
    this.setGravityY(gravityY * (1 + this.character.projectile.mass / 10))
    const force = this.character.projectile.bulletLike ? BULLET_FORCE : (((forceAmount / 4) * (1 + (this.character.stats[DISTANCE_ABILITY_ID].level * 3))) * 400) / this.character.projectile.mass
    if (!this.character.projectile.bulletLike) {
      this.setDragX((force / 10000) * this.character.projectile.deceleration)
    }
    this.applyImpulseForce(
      (new Phaser.Math.Vector2(direction).normalize())
        .scale(force)
    )
    if (this.character.projectile.ttl) {
      this.scene.time.delayedCall(
        this.character.projectile.ttl,
        () => {
          if (this) {
            this.onDestroy()
          }
        },
        [],
        null
      )
    }
  }
}

export default Projectile
