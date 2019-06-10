import { CharacterMelee } from '@/assets/characters'
import { PLAYER_DEPTH } from '@/constants'
import { GameScene } from '@/game/scenes/GameScene'
import { Character } from '@/game/entities/Character'
import MeleeAnimation from '@/game/entities/MeleeAnimation'
import AudioManager from '@/game/manager/AudioManager'

interface Constructor {
  scene: Phaser.Scene
  x: number
  y: number
  modifiers: CharacterMelee,
  origin: Character,
  kind: string,
  scaleX: number
}

export default class MeleeAttack extends Phaser.Physics.Arcade.Sprite {
  private modifiers: CharacterMelee
  private kind: string
  private direction: number
  private origin: Character

  constructor (params: Constructor) {
    super(params.scene, params.x, params.y, 'melee')
    this.modifiers = params.modifiers
    this.kind = params.kind
    this.origin = params.origin
    this.direction = params.scaleX
    this
      .setAlpha(0)
      .setOrigin(this.direction < 0 ? 1 : 0, 0)
    const scene = params.scene as GameScene
    scene.time.delayedCall(this.modifiers.delay, () => {
      scene.physics.world.enable(this)
      scene.add.existing(this)
      const animation = new MeleeAnimation({
        scene: this.scene,
        x: this.x,
        y: this.y,
        kind: this.kind,
        offsetX: this.modifiers.offsetX,
        offsetY: this.modifiers.offsetY,
        scaleX: this.direction
      })

      AudioManager.playSfx('melee', { volume: 0.2 })
      scene.physics.add.overlap(this, scene.charactersArray, this.onCollide.bind(this))

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
      const player = other as Character
      if (player !== this.origin && !player.damaged) {
        player.takeDamage(this.modifiers.damage, 300 * this.modifiers.force, this.direction < 0 ? -2.8 : -0.5)
      }
    }
  }
}
