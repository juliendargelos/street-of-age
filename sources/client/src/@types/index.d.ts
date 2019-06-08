import { SerializedPlayer } from '@street-of-age/shared/entities/player'
import { RoomSettings } from '@street-of-age/shared/entities/room'
import { CharacterAsset } from '@/assets/characters'

export interface Player extends SerializedPlayer{
  isLocal: boolean,
}

export interface ClientCharacterAsset extends CharacterAsset {
  picture: {
    full: string,
    face: string
  },
}

export interface CharacterCardClickEvent {
  mouseEvent: MouseEvent,
  character: ClientCharacterAsset
}

export type ClientCharactersAsset = { [kind: string]: ClientCharacterAsset }

export interface Room {
  id: string,
  settings: RoomSettings,
  players: SerializedPlayer[]
}
