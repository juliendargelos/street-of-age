export enum SocketEvents {
  Connect = "connect",
  Connection = "connection",
  Disconnect = "disconnect"
}

export enum RoomEvents {
  RoomCreate = "room:create",
  RoomCreated = "room:created",
  RoomRetrieve = "room:retrieve",
  RoomRefresh = "room:refresh",
  RoomDeleted = "room:deleted",
  RoomVerify = "room:verify",
  RoomUndefined = "room:undefined",
  RoomDefined = "room:defined",
  RoomJoined = "room:joined",
  RoomLeave = "room:leave",
  RoomLeft = "room:left",
  RoomReady = "room:ready",
  RoomPlayerReady = "room:player-ready",
  RoomAllPlayersReady = "room:all-players-ready"
}

export enum GameEvents {
  GameCreate = "game:create",
  GameCreated = "game:created",
  GameUpdate = "game:update",
  GameUpdated = "game:updated",
  GameTurnChanged = "game:turn:changed",
  GameCharacterMove = "game:character:move",
  GameCharacterMoved = "game:character:moved",
  GameCharacterJump = "game:character:jump",
  GameCharacterJumped = "game:character:jumped",
  GameCharacterShoot = "game:character:shoot",
  GameCharacterShooted = "game:character:shooted",
  GameCharacterDie = "game:character:die",
  GameCharacterDied = "game:character:died",
  GameCharacterTakeDamage = "game:character:takedamage",
  GameCharacterTookDamage = "game:character:tookdamage",
  GameEnded = "game:ended"
}

export enum PlayerEvents {
  PlayerConnected = "player:connected"
}

export enum CharacterEvents {
  CharacterChangeTeam = "character:change:team",
  CharacterAddedKind = "character:added:kind",
  CharacterClearedKinds = "character:cleared:kinds",
  CharacterRemovedKind = "character:removed:kind",
  CharacterChangeReady = "character:change:ready"
}
