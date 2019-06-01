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
    // CharacterKind.DotingGranny,
    CharacterKind.FustyGrandpa,
    CharacterKind.LapdogWoman,
    CharacterKind.MrMuscle,
  ]
}

export interface SerializedPlayer extends Serialized {
  id: string,
  ready: boolean,
  team: PlayerTeam | string | null
  characterKind: CharacterKind | string | null
}

export class Player<Character extends BaseCharacter = BaseCharacter> implements Serializable<SerializedPlayer> {
  public readonly id: string
  public team: PlayerTeam | string | null
  public ready: boolean
  public characterKind: CharacterKind | string | null
  public room: Room
  public characters: Character[] = []

  constructor(attributes: SerializedPlayer) {
    this.id = attributes.id
    this.team = attributes.team
    this.characterKind = attributes.characterKind
    this.ready = attributes.ready
  }

  public serialize(): SerializedPlayer {
    return {
      id: this.id,
      team: this.team,
      ready: this.ready,
      characterKind: this.characterKind
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
