import { Module, VuexModule, Mutation, getModule } from 'vuex-module-decorators'
import { Room as RoomType } from '@/@types'
import store from '@/store'
import AppModule from '@/store/modules/app'

export interface RoomState {
  rooms: RoomType[]
}

@Module({ name: 'room', namespaced: true, dynamic: true, store })
class RoomStore extends VuexModule implements RoomState {
  public rooms: RoomType[] = []

  @Mutation public setRooms (rooms: RoomType[]) {
    this.rooms = rooms
    this.rooms = this.rooms.map(room => {
      room.players = room.players.map(player => {
        player.isLocal = player.id === AppModule.player.id
        return player
      })
      return room
    })
  }
}

const RoomModule = getModule(RoomStore)
export default RoomModule
