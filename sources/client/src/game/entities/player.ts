import { CharacterKind, PlayerTeam } from '@/store/modules/app'

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
