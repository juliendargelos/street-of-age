export interface Player {
  id: string
  isLocal: boolean
}

export interface Room {
  id: string,
  players: Player[]
}
