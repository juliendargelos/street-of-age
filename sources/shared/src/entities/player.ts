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
  id: string
  ready: boolean
  color: PlayerColor
  numberOfKills: number
  numberOfDeaths: number
  teamKind: PlayerTeam | string | null
  characterKinds: CharacterKind[] | string[]
}

export type PlayerColor = '#f64afe' | '#0be5fe' | '#50fbd7' | '#e6ff5d' | '#ff4f73' | '#ff3dad' | ''

export class Player<Character extends BaseCharacter = BaseCharacter> implements Serializable<SerializedPlayer> {
  public readonly id: string
  public teamKind: PlayerTeam | string | null
  public ready: boolean
  public characterKinds: CharacterKind[] | string[]
  public room: Room
  public color: PlayerColor
  public numberOfKills: number


  constructor(attributes: SerializedPlayer) {
    this.id = attributes.id
    this.teamKind = attributes.teamKind
    this.characterKinds = attributes.characterKinds
    this.ready = attributes.ready
    this.numberOfKills = attributes.numberOfKills
  }

  public serialize(): SerializedPlayer {
    return {
      id: this.id,
      teamKind: this.teamKind,
      ready: this.ready,
      color: this.color,
      numberOfKills: this.numberOfKills,
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
