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
  team: PlayerTeam
  characterKind: CharacterKind
}

export class Player<Character extends BaseCharacter = BaseCharacter> implements Serializable<SerializedPlayer> {
  public readonly id: string
  public readonly team: PlayerTeam
  public readonly characterKind: CharacterKind
  public room: Room
  public characters: Character[] = []

  constructor(attributes: SerializedPlayer) {
    if (!PlayerTeamKinds[attributes.team].includes(attributes.characterKind)) {
      throw new Error(`Invalid character kind "${attributes.characterKind}" for given team "${attributes.team}"`)
    }

    this.id = attributes.id
    this.team = attributes.team
    this.characterKind = attributes.characterKind
  }

  public serialize(): SerializedPlayer {
    return {
      id: this.id,
      team: this.team,
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
