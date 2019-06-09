import BaseScene from '@/game/scenes/BaseScene'
import { Character } from '@/game/entities/Character'
import { CharacterKind } from '@/store/modules/app'
import { PostProcessing } from '@/game/PostProcessing'
import { Emitter } from '@/main'
import { GameEvents } from '@street-of-age/shared/game/events'
import { CharacterProjectile } from '@/assets/characters'
import AudioManager from '@/game/manager/AudioManager'

const HEIGHT_CAMERA_OFFSET = 800

export class GameScene extends BaseScene {
  private postprocessing!: PostProcessing

  constructor () {
    super({
      key: 'GAME_SCENE'
    })
  }

  private onProjectileExploded = (projectile: CharacterProjectile & { x: number, y: number }) => {
    try {
      const area = new Phaser.Geom.Circle(projectile.x, projectile.y, projectile.radiusDamage)
      AudioManager.playSfx('explosion', { volume: 0.2 })
      if (this.characters) {
        this.characters
          .filter(character => Phaser.Geom.Circle.Contains(area, character.x, character.y))
          .forEach(character => {
            const a = character.x - projectile.x
            const b = character.y - projectile.y
            const angle = Math.atan2(character.y - projectile.y, character.x - projectile.x)
            const force = (area.radius - Math.sqrt(a * a + b * b)) * 2 * projectile.explosionMultiplier
            character.takeDamage(projectile.damage, force, angle)
          })
      }
    } catch (e) {

    }
  }

  public create = () => {
    super.create()
    AudioManager.playBg()
    this.characters = [
      new Character({
        scene: this,
        kind: CharacterKind.FustyGrandpa,
        x: 250,
        y: -500,
        local: true
      }),

      new Character({
        scene: this,
        kind: CharacterKind.FustyGrandpa,
        x: 300,
        y: -500
      }),

      new Character({
        scene: this,
        kind: CharacterKind.Egocentric,
        x: 350,
        y: -500
      }),

      new Character({
        scene: this,
        kind: CharacterKind.DotingGranny,
        x: 400,
        y: -500
      })
    ]
    Emitter.on(GameEvents.ProjectileExploded, this.onProjectileExploded)
    this.physics.add.collider(this.characters, this.level.floors)
    this.physics.add.collider(this.characters, this.level.colliders)
    this.cameras.main.setRoundPixels(true)
    const { width } = this.level.bounds
    this.cameras.main.setBounds(0, -HEIGHT_CAMERA_OFFSET, width, window.innerHeight + HEIGHT_CAMERA_OFFSET)
    this.cameras.main.startFollow(this.characters[0], false, 0.1, 0.1)
    this.postprocessing = (this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline('PostProcessing', new PostProcessing(this.game)) as PostProcessing
    this.cameras.main.setRenderToTexture(this.postprocessing)
  }

  public update = (time: number, delta: number) => {
    super.update(time, delta)
    this.postprocessing.update(time, delta)
    this.characters.forEach(character => {
      character.update()
    })
  }

  protected destroy (): void {
    Emitter.removeAllListeners(GameEvents.ProjectileExploded)
    super.destroy()
  }
}
