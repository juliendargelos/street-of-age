import { CharacterMelee } from '@/assets/characters'
import { PLAYER_DEPTH } from '@/constants'
import { GameScene } from '@/game/scenes/GameScene'
import { Character } from '@/game/entities/Character'

interface Constructor {
  scene: Phaser.Scene
  x: number
  y: number
  modifiers: CharacterMelee,
  direction: number
}

export default class MeleeAttack extends Phaser.Physics.Arcade.Sprite {
  private modifiers: CharacterMelee
  private direction: number
  constructor (params: Constructor) {
    super(params.scene, params.x, params.y, 'main')
    this.modifiers = params.modifiers
    this.direction = params.direction
    console.log(this.modifiers)
    this
      .setAlpha(0)
      .setOrigin(this.direction < 0 ? 1 : 0, 0)
    const scene = params.scene as GameScene
    scene.time.delayedCall(this.modifiers.delay, () => {
      scene.physics.world.enable(this)
      scene.add.existing(this)
      scene.physics.add.overlap(this, scene.characters, this.onCollide.bind(this))
      this
        .setDisplaySize(this.modifiers.distance, 1)
        .setGravityY(0)
        .setDepth(PLAYER_DEPTH)
        .updateDisplayOrigin()
    }, [], null)
    scene.time.delayedCall(this.modifiers.delay + 500, () => {
      this.destroy()
    }, [], null)
  }

  private onCollide (go: Phaser.GameObjects.GameObject, other: Phaser.GameObjects.GameObject) {
    if (other.getData('tag') && other.getData('tag') === 'character') {
      console.log('punching char')
      const player = other as Character
      player.takeDamage(this.modifiers.damage, 180, this.direction < 0 ? 4.5 : -0.5)
    }
  }
}
