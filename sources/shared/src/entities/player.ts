import { Room } from './room'
import { Character as BaseCharacter, CharacterKind } from '../game/character'

export enum PlayerTeam {
  Young = 'young',
  Old = 'old'
}

export const PlayerTeamKinds: { [P in PlayerTeam]: CharacterKind[] } = {
  [PlayerTeam.Young]: [
    CharacterKind.Egocentric,
    CharacterKind.Geek,
    CharacterKind.Hippie,
    CharacterKind.Fattie,
  ],
  [PlayerTeam.Old]: [
    CharacterKind.DotingGranny,
    CharacterKind.FustyGrandpa,
    CharacterKind.LapdogWoman,
    CharacterKind.MrMuscle,
  ]
}

export interface SerializedPlayer extends Serialized {
  id: string,
  ready: boolean,
  color: PlayerColor
  team: PlayerTeam | string | null
  characterKinds: CharacterKind[] | string[]
}

export type PlayerColor = '#f64afe' | '#0be5fe' | '#50fbd7' | '#e6ff5d' | '#ff4f73' | '#ff3dad' | ''

export class Player<Character extends BaseCharacter = BaseCharacter> implements Serializable<SerializedPlayer> {
  public readonly id: string
  public team: PlayerTeam | string | null
  public ready: boolean
  public characterKinds: CharacterKind[] | string[]
  public room: Room
  public characters: Character[] = []
  public color: PlayerColor


  constructor(attributes: SerializedPlayer) {
    this.id = attributes.id
    this.team = attributes.team
    this.characterKinds = attributes.characterKinds
    this.ready = attributes.ready
  }

  public serialize(): SerializedPlayer {
    return {
      id: this.id,
      team: this.team,
      ready: this.ready,
      color: this.color,
      characterKinds: this.characterKinds
    }
  }

  public async leaveRoom(): Promise<Room> {
    const room = this.room
    room && await room.removePlayer(this)
    return room
  }

  public async joinRoom(room: Room): Promise<Room> {
    !this.isInRoom(room) && await room.addPlayer(this)
    return room
  }

  public isInRoom(room: Room): boolean {
    return this.room
      ? this.room.id === room.id
      : false
  }
}
