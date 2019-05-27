import { CharacterKind, PlayerTeam } from '@/store/modules/app'

export interface Player {
  id: string
  isLocal: boolean,
  character: {
    team: PlayerTeam
    kind: CharacterKind
  }
}

export interface Room {
  id: string,
  players: Player[]
}

export interface RoomSettings {
  name: string
  numberOfPlayers: 2 | 4 | 6
  mapSize: 'small' | 'medium' | 'large'
}
