import { CharacterKind, PlayerTeam } from '@/store/modules/app'
import { SerializedPlayer } from '@street-of-age/shared/entities/player'

export interface Player extends SerializedPlayer{
  isLocal: boolean,
}

export interface CharacterAsset {
  name: string,
  picture: string,
  kind: CharacterKind,
  team: PlayerTeam,
  stats: Array<{
    ability: string,
    level: number
  }>
}

export interface CharacterCardClickEvent {
  mouseEvent: MouseEvent,
  character: CharacterAsset
}

export type CharactersAsset = { [P in CharacterKind]: CharacterAsset }

export interface Room {
  id: string,
  players: SerializedPlayer[]
}

export interface RoomSettings {
  name: string
  numberOfPlayers: 2 | 4 | 6
  mapSize: 'small' | 'medium' | 'large'
}
