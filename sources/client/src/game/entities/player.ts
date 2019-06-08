import { CharacterKind, PlayerTeam } from '@/store/modules/app'
import { SerializedCharacter } from './Character'

export const PlayerTeamKinds: { [P in PlayerTeam]: Array<CharacterKind | string> } = {
  [PlayerTeam.Young]: [
    CharacterKind.Egocentric,
    CharacterKind.Geek,
    CharacterKind.Hippie,
    CharacterKind.Fattie
  ],
  [PlayerTeam.Old]: [
    CharacterKind.DotingGranny,
    CharacterKind.FustyGrandpa,
    CharacterKind.LapdogWoman,
    CharacterKind.MrMuscle
  ]
}

export interface SerializedPlayer extends Serialized {
  id: string
  teamKind: PlayerTeam
  ready: boolean
  characters: SerializedCharacter[]
  characterKinds: CharacterKind[]
}
