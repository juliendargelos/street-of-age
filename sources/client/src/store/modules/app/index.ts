import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import { Player } from '@/@types'

export enum PlayerTeam {
  Young = 'young',
  Old = 'old'
}

export enum CharacterKind {
  Egocentric = 'egocentric',
  Geek = 'geek',
  Hippie = 'hippie',
  // DotingGranny = 'doting-granny',
  FustyGrandpa = 'fusty-grandpa',
  LapdogWoman = 'lapdog-woman',
  MrMuscle = 'mr-muscle',
  Fattie = 'fattie',
}

export interface AppState {
  hasPlayedIntroduction: boolean,
  player: Player
}

@Module({ name: 'app', namespaced: true, dynamic: true, store })
class AppStore extends VuexModule implements AppState {
  public hasPlayedIntroduction: boolean = false
  public player: Player = { id: '', isLocal: true, characterKind: null, team: null, ready: false }

  @Mutation public setHasPlayedIntroduction (hasPlayedIntroduction: boolean) {
    this.hasPlayedIntroduction = hasPlayedIntroduction
  }

  @Mutation public setPlayerId (playerId: string) {
    this.player.id = playerId
  }

  @Mutation public changePlayerCharacterTeam (team: PlayerTeam | string | null) {
    this.player.team = team
  }

  @Mutation public changePlayerCharacterKind (kind: CharacterKind | string | null) {
    this.player.characterKind = kind
  }

  @Mutation public changePlayerCharacterReady (ready: boolean) {
    this.player.ready = ready
  }
}

const AppModule = getModule(AppStore)
export default AppModule
