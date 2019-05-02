import {Socket} from "socket.io";
import {Serializable} from "../@types";
import {red} from "../services/Logger";
import {Room, RoomSerialized} from "./Room";

export interface PlayerSerialized {
  id: string,
  room: RoomSerialized | null
}

export class Player implements Serializable {

  public id: string
  public room: Room

  constructor(public readonly socket: Socket) {
    this.id = socket.id
  }

  get io() {
    return this.socket.server
  }

  public leaveRoom = (): void => {
    if (this.room) {
      this.room.removePlayer(this)
    }
  }

  public connectToRoom = (room: Room): void => {
    if (!this.isInRoom(room)) {
      room.addPlayer(this)
    }
  }

  public isInRoom = (room: Room): boolean => {
    return this.room ?
      this.room.id === room.id :
      false
  }

  public serialize = (): PlayerSerialized => {
    return {id: this.id, room: this.room ? this.room.serialize() : null}
  }

  public toString = (): string => {
    return `Player(id: ${red(this.id)})`
  }

}
