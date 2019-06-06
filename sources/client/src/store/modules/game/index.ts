import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'

export interface GameSettings {
  volume: {
    music: number,
    sfx: number
  },
  vibrations: boolean,
}

export interface GameState {
  settings: GameSettings
}

@Module({ name: 'game', namespaced: true, dynamic: true, store })
class GameStore extends VuexModule implements GameState {
  public settings: GameSettings = { vibrations: false, volume: { music: 0.5, sfx: 0.5 } }

  @Mutation public setVibrations (vibrations: boolean) {
    this.settings.vibrations = vibrations
  }

  @Mutation public setVolumeMusic (volume: number) {
    this.settings.volume.music = volume
  }

  @Mutation public setVolumeMusicSfx (volume: number) {
    this.settings.volume.sfx = volume
  }

}

const GameModule = getModule(GameStore)
export default GameModule
