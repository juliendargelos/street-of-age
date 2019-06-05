import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import { Player } from '@/@types'
import { PlayerColor } from '@street-of-age/shared/entities/player'

export enum PlayerTeam {
  Young = 'young',
  Old = 'old'
}

export enum CharacterKind {
  Egocentric = 'egocentric',
  Geek = 'geek',
  Hippie = 'hippie',
  DotingGranny = 'doting-granny',
  FustyGrandpa = 'fusty-grandpa',
  LapdogWoman = 'lapdog-woman',
  MrMuscle = 'mr-muscle',
  Fattie = 'fattie',
}

export interface AppState {
  hasPlayedIntroduction: boolean,
  isPlaying: boolean,
  player: Player
}

@Module({ name: 'app', namespaced: true, dynamic: true, store })
class AppStore extends VuexModule implements AppState {
  public hasPlayedIntroduction: boolean = false
  public isPlaying: boolean = false
  public player: Player = { id: '', color: '', isLocal: true, characterKinds: [], team: null, ready: false }

  @Mutation public setIsPlaying (isPlaying: boolean) {
    this.isPlaying = isPlaying
  }

  @Mutation public setHasPlayedIntroduction (hasPlayedIntroduction: boolean) {
    this.hasPlayedIntroduction = hasPlayedIntroduction
  }

  @Mutation public setPlayerId (playerId: string) {
    this.player.id = playerId
  }

  @Mutation public changePlayerCharacterTeam (team: PlayerTeam | string | null) {
    this.player.team = team
  }

  @Mutation public setPlayerCharacterColor (color: PlayerColor) {
    this.player.color = color
  }

  @Mutation public clearPlayerCharacterKinds () {
    this.player.characterKinds = []
  }

  @Mutation public removePlayerCharacterKind (kind: CharacterKind | string) {
    this.player.characterKinds = this.player.characterKinds
      .filter(k => k !== kind)
  }

  @Mutation public addPlayerCharacterKind (kind: CharacterKind | string) {
    if (!this.player.characterKinds.includes(kind as CharacterKind)) {
      this.player.characterKinds.push(kind as CharacterKind)
    }
  }

  @Mutation public changePlayerCharacterReady (ready: boolean) {
    this.player.ready = ready
  }
}

const AppModule = getModule(AppStore)
export default AppModule
