import { Module, VuexModule, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface AppState {
  playerId?: string | null
}

@Module({ name: 'app', namespaced: true, dynamic: true, store })
class AppStore extends VuexModule implements AppState {
  public playerId: string = ''

  @Mutation public setPlayerId (playerId: string) {
    this.playerId = playerId
  }
}

const AppModule = getModule(AppStore)
export default AppModule
