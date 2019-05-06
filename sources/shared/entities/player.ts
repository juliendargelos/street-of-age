import { Room, SerializedRoom } from './room'
import { CharacterKind } from '../game/character'

export enum PlayerTeam {
  Young = 'young',
  Old = 'old'
}

export const PlayerTeamKinds: { [P in PlayerTeam]: CharacterKind[] } = {
  [PlayerTeam.Young]: [
    CharacterKind.Egocentric,
    CharacterKind.Geek,
    CharacterKind.Hippie
  ],
  [PlayerTeam.Old]: [
    CharacterKind.DotingGranny,
    CharacterKind.FustyGrandpa,
    CharacterKind.LapdogWoman
  ]
}

export interface SerializedPlayer extends Serialized {
  id: string
  team: PlayerTeam
  characterKind: CharacterKind
}

export class Player implements Serializable<SerializedPlayer> {
  public readonly id: string
  public readonly team: PlayerTeam
  public readonly characterKind: CharacterKind

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
}
