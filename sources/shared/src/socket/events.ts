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
  RoomReady = 'room:ready',
  RoomPlayerReady = 'room:player-ready',
  RoomAllPlayersReady = 'room:all-players-ready',
  StartGame = 'room:start:game',
}

export enum PlayerEvents {
  PlayerConnected = 'player:connected'
}

export enum GameEvents {
  GameCreate = "game:create",
  GameCreated = "game:created",
  GameUpdate = "game:update",
  GameUpdated = "game:updated",
  GameTurnChanged = "game:turn:changed",
  GameCharacterMoved = "game:character:moved",
  GameCharacterJumped = "game:character:jumped",
  GameCharacterShooted = "game:character:shooted",
  GameCharacterDied = "game:character:died",
  GameEnded = "game:ended"
}

export enum CharacterEvents {
  CharacterChangeTeam = 'character:change:team',
  CharacterAddedKind = 'character:added:kind',
  CharacterClearedKinds = 'character:cleared:kinds',
  CharacterRemovedKind = 'character:removed:kind',
  CharacterChangeReady = 'character:change:ready',
}
