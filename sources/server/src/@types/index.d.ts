import {Player} from "../entities/Player";

export type Some = { [key: string]: Some } | object | string | boolean | symbol | number | null;

export type OnRoomJoined = (player: Player) => void;

export interface Serializable {
  serialize: Some
}
