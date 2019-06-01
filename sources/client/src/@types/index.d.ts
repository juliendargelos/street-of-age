import { CharacterKind, PlayerTeam } from '@/store/modules/app'
import { SerializedPlayer } from '@street-of-age/shared/entities/player'
import { RoomSettings } from '@street-of-age/shared/entities/room'

export interface Player extends SerializedPlayer{
  isLocal: boolean,
}

interface CharacterStat {
  id: string,
  name: string,
  level: number
}

export type CharacterStats = {
  [stat: string]: CharacterStat
}

export interface CharacterAsset {
  name: string,
  picture: {
    full: string,
    face: string
  },
  kind: CharacterKind,
  team: PlayerTeam,
  stats: CharacterStats
}

export interface CharacterCardClickEvent {
  mouseEvent: MouseEvent,
  character: CharacterAsset
}

export type CharactersAsset = { [P in CharacterKind]: CharacterAsset }

export interface Room {
  id: string,
  settings: RoomSettings,
  players: SerializedPlayer[]
}
