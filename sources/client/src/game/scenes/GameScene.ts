import BaseScene from '@/game/scenes/BaseScene'
import { Character, SerializedCharacter } from '@/game/entities/Character'
import { CharacterKind } from '@/store/modules/app'
import { PostProcessing } from '@/game/PostProcessing'
import { Socket } from 'socket.io'
import AppModule from '@/store/modules/app'
import AudioManager from '@/game/manager/AudioManager'
import { gameWait } from '@/utils/functions'
import { GameEvents } from '@street-of-age/shared/socket/events'
import { Socket } from 'socket.io'
import AppModule from '@/store/modules/app'

const HEIGHT_CAMERA_OFFSET = 800
export const WORLD_Y_LIMIT = 600

interface GameSceneListeners {
  created: () => void,
  characterMoved: (characer: SerializedCharacter) => void,
  characterDied: (characer: SerializedCharacter) => void,
}

export class GameScene extends BaseScene {
  private postprocessing!: PostProcessing
  public characters: Map<string, Character> = new Map()
  private controlledCharacter: Character | null = null

  constructor (private listeners: GameSceneListeners) {
    super({
      key: 'GAME_SCENE'
    })
  }

  public get charactersArray() {
    return [...this.characters].map(([_, character]) => character)
  }

  public create = () => {
    super.create()

    AudioManager.playBg()
    this.socket.on(GameEvents.GameUpdated, (game: { characters: SerializedCharacter[] }) => {
      this.setCharacters(game.characters)
    })

    this.socket.on(GameEvents.GameTurnChanged, (game: { currentCharacter: SerializedCharacter, currentPlayer: { id: string } }) => {
      const character = this.characters.get(game.currentCharacter.id) as Character
      this.setCurrentCharacter(character)

      if (game.currentPlayer.id === this.socket.id) this.enableControls(character)
      else this.disableControls()
    })

    this.socket.emit(GameEvents.GameUpdate)

    this.cameras.main.setRoundPixels(true)
    const { width } = this.level.bounds
    this.cameras.main.setBounds(0, -HEIGHT_CAMERA_OFFSET, width, window.innerHeight + HEIGHT_CAMERA_OFFSET)
    this.postprocessing = (this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline('PostProcessing', new PostProcessing(this.game)) as PostProcessing
    this.cameras.main.setRenderToTexture(this.postprocessing)
    this.listeners.created()
  }

  public setCurrentCharacter(character: Character) {
    this.cameras.main.stopFollow()
    this.cameras.main.startFollow(character, false, 0.1, 0.1)
  }

  public enableControls (character: Character) {
    this.disableControls()
    character.enableControls()
    this.controlledCharacter = character
  }

  public disableControls () {
    if (!this.controlledCharacter) return
    this.controlledCharacter.disableControls()
    this.controlledCharacter = null
  }

  public moveCharacter(attributes: SerializedCharacter) {
    const character = this.characters.get(attributes.id) as Character
    character.x = attributes.x as number
    character.y = attributes.y as number
    character.setVelocityX(attributes.velocityX as number)
    character.setVelocityY(attributes.velocityY as number)
  }

  public createCharacter(attributes: SerializedCharacter) {
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

    character.on('moved', this.listeners.characterMoved)

    return character
  }

  public removeCharacter(id: string) {
    const character = this.characters.get(id)

    if (character) {
      character.destroy()
      character.off('moved', this.listeners.characterMoved)
      this.characters.delete(id)
      this.listeners.characterDied(character)
    }
  }

  public resetVelocity() {
    this.characters.forEach(character => {
      character.setVelocityX(0)
      character.setVelocityY(0)
    })
  }

  public setCharacters(characters: SerializedCharacter[]) {
    this.characters.forEach((_, id) => this.removeCharacter(id))
    characters.forEach(character => this.createCharacter(character))
    // alert('ok')
    // console.log(this.characters)
  }

  public update = (time: number, delta: number) => {
    super.update(time, delta)
    this.postprocessing.update(time, delta)
    this.characters.forEach(character => character.update())
  }

  protected destroy (): void {
    Emitter.removeAllListeners(GameEvents.ProjectileExploded)
    super.destroy()
  }
}
