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
  StartGame = 'room:start:game',
}

export enum PlayerEvents {
  PlayerConnected = 'player:connected'
}

export enum CharacterEvents {
  CharacterChangeTeam = 'character:change:team',
  CharacterAddedKind = 'character:added:kind',
  CharacterClearedKinds = 'character:cleared:kinds',
  CharacterRemovedKind = 'character:removed:kind',
  CharacterChangeReady = 'character:change:ready',
}
