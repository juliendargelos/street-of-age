import Vue from 'vue'
import Vuex from 'vuex'
import { RoomState } from './modules/room'
import { AppState } from '@/store/modules/app'

Vue.use(Vuex)

export interface RootState {
  app: AppState
  room: RoomState,
}

export default new Vuex.Store<RootState>({})
