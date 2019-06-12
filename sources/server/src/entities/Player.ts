import { observable, autorun, computed } from 'mobx'
import { computedFn } from '../utils'
import { Entity, Collection } from '../core'
import { CHARACTERS_PER_PLAYER } from '../constants'
import { Character, SerializedCharacter, CharacterKind } from './Character'
import { TeamKind } from './Team'

export interface SerializedPlayer extends SerializedObject {
  id: string
  teamKind: TeamKind
  ready: boolean
  color: string
  numberOfKills: number
  numberOfDeaths: number
  characters: SerializedCharacter[]
  characterKinds: CharacterKind[]
}

const all = new Collection<Player>()

export class Player extends Entity {
  public static all = all
  public static collection = all.collection

  @observable public teamKind?: TeamKind
  @observable public ready: boolean = false
  @observable public color: string = ''
  @observable public numberOfKills: number = 0
  @observable public numberOfDeaths: number = 0
  public readonly characters: Collection<Character> = Character.collection()
  private _characters: Character[] = []

  constructor(id: string) {
    super(id)

    autorun(() => {
      this.teamKind && this.characters.forEach(character => {
        if (!character.belongsTo(this.teamKind)) {
          throw new Error(`Invalid character "${character.kind}" for ${this}'s team "${this.teamKind}"`)
        }
      })
    })
  }

  @computed get lose(): boolean {
    return this.numberOfDeaths === CHARACTERS_PER_PLAYER
  }

  @computedFn public serialize(): SerializedPlayer {
    return {
      id: this.id,
      teamKind: this.teamKind,
      color: this.color,
      numberOfKills: this.numberOfKills,
      numberOfDeaths: this.numberOfDeaths,
      ready: this.ready,
      characters: this.characters.serialize() as SerializedCharacter[],
      characterKinds: this.characterKinds
    }
  }

  // @computed get ready(): boolean {
  //   return !!this.teamKind && this.characters.length === CHARACTERS_PER_PLAYER
  // }

  @computed get characterKinds(): CharacterKind[] {
    return this.characters.map(({ kind }) => kind)
  }

  saveCharacters() {
    this._characters = this.characters.array
  }

  restoreCharacters() {
    this.characters.set(this._characters)
    this._characters = []
  }

  clearCharacters() {
    this.characters.clear()
    this._characters = []
  }
}
