import BaseScene from '@/game/scenes/BaseScene'
import {Character, SerializedCharacter, WeaponType} from '@/game/entities/Character'
import {PostProcessing} from '@/game/PostProcessing'
import {Emitter} from '@/main'
import {GameEvents} from '@street-of-age/shared/game/events'
import {CharacterProjectile} from '@/assets/characters'
import AudioManager from '@/game/manager/AudioManager'

const HEIGHT_CAMERA_OFFSET = 800
export const WORLD_Y_LIMIT = 600

export interface Shoot {
  id: string
  weaponType: WeaponType
  characterX: number
  characterY: number
  scaleX: number
  distance?: number
  angle?: number
  x?: number
  y?: number
}

interface GameSceneListeners {
  created?: () => void
  characterMoved?: (character: SerializedCharacter) => void
  characterDied?: (character: SerializedCharacter) => void
  characterShooted?: (shoot: Shoot) => void
  characterTookDamage?: (damage: { id: string, damage: number }) => void
}

// this.weaponType WeaponType.Distance WeaponType.Melee

// {
//   detail: {
//     distance: '',
//     angle: '',
//     position: ''
//   }
// }

export class GameScene extends BaseScene {
  private postprocessing!: PostProcessing
  public characters: Map<string, Character> = new Map()
  public controlledCharacter: Character | null = null

  constructor (private listeners: GameSceneListeners) {
    super({
      key: 'GAME_SCENE'
    })
  }

  public get charactersArray () {
    return [...this.characters].map(([_, character]) => character)
  }

  public create = () => {
    super.create()

    AudioManager.playBg()
    this.cameras.main.setRoundPixels(true)
    const { width, height } = this.level.bounds
    this.cameras.main.setBounds(0, -window.innerHeight - 375, width, height)
    this.postprocessing = (this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline('PostProcessing', new PostProcessing(this.game)) as PostProcessing
    this.cameras.main.setRenderToTexture(this.postprocessing)
    Emitter.on(GameEvents.ProjectileExploded, this.onProjectileExploded)
    this.listeners.created && this.listeners.created()
  }

  public setCurrentCharacter (character: Character) {
    this.cameras.main.stopFollow()
    if (character) this.cameras.main.startFollow(character, false, 0.1, 0.1)
  }

  public enableControls (character: Character) {
    this.disableControls()
    if (character) {
      character.enableControls()
      this.controlledCharacter = character
    } else {
      this.controlledCharacter = null
    }
  }

  public disableControls () {
    if (!this.controlledCharacter) return
    this.controlledCharacter.disableControls()
    this.controlledCharacter = null
  }

  public moveCharacter (attributes: SerializedCharacter) {
    const character = this.characters.get(attributes.id) as Character
    if (!character) return
    character.x = attributes.x as number
    character.y = attributes.y as number
    character.setVelocityX(attributes.velocityX as number)
    character.setVelocityY(attributes.velocityY as number)
  }

  public createCharacter (attributes: SerializedCharacter) {
    const character = new Character({
      id: attributes.id,
      scene: this,
      kind: attributes.kind,
      x: attributes.x || 0,
      y: attributes.y || 0,
      velocityX: attributes.velocityX || 0,
      velocityY: attributes.velocityY || 0
    })

    this.physics.add.collider(character, this.level.floors)
    this.physics.add.collider(character, this.level.colliders)

    this.characters.set(attributes.id, character)

    this.listeners.characterMoved && character.on('moved', this.listeners.characterMoved)
    this.listeners.characterShooted && character.on('shooted', this.listeners.characterShooted)
    this.listeners.characterTookDamage && character.on('tookDamage', this.listeners.characterTookDamage)

    return character
  }

  public removeCharacter (id: string) {
    const character = this.characters.get(id)

    if (character) {
      character.destroy()
      this.listeners.characterMoved && character.off('moved', this.listeners.characterMoved)
      this.listeners.characterShooted && character.off('shooted', this.listeners.characterShooted)
      this.characters.delete(id)
      this.listeners.characterDied && this.listeners.characterDied(character)
    }
  }

  public resetVelocity () {
    this.characters.forEach(character => {
      character.setVelocityX(0)
      character.setVelocityY(0)
    })
  }

  public setCharacters (characters: SerializedCharacter[]) {
    this.characters.forEach((_, id) => this.removeCharacter(id))
    characters.forEach(character => this.createCharacter(character))
    // alert('ok')
    // console.log(this.characters)
  }

  public shoot (shoot: Shoot) {
    const character = this.characters.get(shoot.id) as Character
    character.launchProjectile(shoot)
  }

  public update = (time: number, delta: number) => {
    super.update(time, delta)
    this.postprocessing.update(time, delta)
    this.characters.forEach(character => character.update())
  }

  public destroy = () => {
    Emitter.removeAllListeners(GameEvents.ProjectileExploded)
    super.destroy()
  }

  private onProjectileExploded = (projectile: CharacterProjectile & { x: number, y: number }) => {
    try {
      this.postprocessing.glitch()
      const area = new Phaser.Geom.Circle(projectile.x, projectile.y, projectile.radiusDamage)
      this.characters.forEach(character => {
        if (!Phaser.Geom.Circle.Contains(area, character.x, character.y)) return
        const a = character.x - projectile.x
        const b = character.y - projectile.y
        const angle = Math.atan2(character.y - projectile.y, character.x - projectile.x)
        const force = (area.radius - Math.sqrt(a * a + b * b)) * 2 * projectile.explosionMultiplier
        character.takeDamage(projectile.damage, force, angle)
        return true
      })
    } catch (e) {

    }
  }
}
