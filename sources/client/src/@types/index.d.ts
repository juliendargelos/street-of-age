export interface Player {
  id: string
  isLocal: boolean
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
