export enum SocketEvents {
  Connect = 'connect',
  Connection = 'connection',
  Disconnect = 'disconnect',
}

export enum RoomEvents {
  RoomCreate = 'room:create',
  RoomCreated = 'room:created',
  RoomRetrieve = 'room:retrieve',
  RoomRefresh = 'room:refresh',
  RoomDeleted = 'room:deleted',
  RoomVerify = 'room:verify',
  RoomUndefined = 'room:undefined',
  RoomDefined = 'room:defined',
  RoomJoined = 'room:joined',
  RoomLeave = 'room:leave',
  RoomLeft = 'room:left',
  RoomPlayerReady = 'room:player-ready',
  RoomAllPlayersReady = 'room:all-players-ready',
}

export enum PlayerEvents {
  PlayerConnected = 'player:connected'
}

export enum CharacterEvents {
  CharacterChangeTeam = 'character:change:team',
  CharacterChangeKind = 'character:change:kind',
  CharacterChangeReady = 'character:change:ready',
}
