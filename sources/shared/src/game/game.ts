import Phaser from './phaser'
import { Room } from '../entities/room'
import { Character, SerializedCharacter } from './character'

export const GRAVITY = 900
export const CHARACTERS_PER_PLAYER = 3

export interface SerializedGame extends Serialized {
  characters: SerializedCharacter[]
}

export class Game extends Phaser.Game implements Serializable<SerializedGame> {
  private characters: Character[]

  constructor(attributes: SerializedGame) {
    super()

    this.characters = attributes.characters.map(character => (
      new Character(this.mainScene, character)
    ))
  }

  get mainScene(): Phaser.Scene {
    return this.scene.getAt(0)
  }

  serialize(): SerializedGame {
    return {
      characters: this.characters.map(character => character.serialize())
    }
  }
}
