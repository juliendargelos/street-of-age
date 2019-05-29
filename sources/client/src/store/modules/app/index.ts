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
  LapdogWoman = 'lapdgog-woman',
  MrMuscle = 'mr-muscle',
  Fattie = 'fattie',
}

export interface AppState {
  player: Player
}

@Module({ name: 'app', namespaced: true, dynamic: true, store })
class AppStore extends VuexModule implements AppState {
  public player: Player = { id: '', isLocal: true, characterKind: null, team: null }

  @Mutation public setPlayerId (playerId: string) {
    this.player.id = playerId
  }

  @Mutation public changePlayerCharacterTeam (team: PlayerTeam | null) {
    this.player.team = team
  }

  @Mutation public changePlayerCharacterKind (kind: CharacterKind | null) {
    this.player.characterKind = kind
  }
}

const AppModule = getModule(AppStore)
export default AppModule
