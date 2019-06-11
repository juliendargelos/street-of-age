import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { SerializedPlayer } from '@street-of-age/shared/entities/player'
import store from '@/store'

export interface GameSettings {
  volume: {
    music: number,
    sfx: number
  },
  vibrations: boolean
}

export interface GameState {
  settings: GameSettings
  data: { players: SerializedPlayer[] }
}

@Module({ name: 'game', namespaced: true, dynamic: true, store })
class GameStore extends VuexModule implements GameState {
  public settings: GameSettings = { vibrations: false, volume: { music: 0.5, sfx: 0.5 } }
  public data: { players: SerializedPlayer[] } = { players: [] }

  @Mutation public setVibrations (vibrations: boolean) {
    this.settings.vibrations = vibrations
  }

  @Mutation public setVolumeMusic (volume: number) {
    this.settings.volume.music = volume
  }

  @Mutation public setVolumeMusicSfx (volume: number) {
    this.settings.volume.sfx = volume
  }

  @Mutation public setData (data: { players: SerializedPlayer[] }) {
    this.data = data
  }
}

const GameModule = getModule(GameStore)
export default GameModule
