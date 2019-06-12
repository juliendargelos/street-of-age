import { observable, computed, action } from 'mobx'
import { Entity, Collection } from '../core'
import { computedFn } from '../utils'
import { CHARACTERS_PER_PLAYER } from '../constants'
import { Player, SerializedPlayer } from './Player'
import { Team, TeamKind } from './Team'
import { Character, SerializedCharacter } from './Character'

export interface SerializedGame extends SerializedObject {
  id: string,
  players: SerializedPlayer[]
  losingTeamKind: TeamKind
  characters: SerializedCharacter[]
  currentPlayer?: SerializedPlayer
  currentCharacter?: SerializedCharacter
}

const all = new Collection<Game>()

const GAME_TURN_DURATION = 15000

export class Game extends Entity implements Serializable<SerializedGame> {
  public static all = all
  public static collection = all.collection

  @observable public currentTeamIndex: number = -1
  @observable public currentPlayerIndex: number = -1
  @observable public currentCharacterIndex: number = -1
  @observable public playersLoaded: number = 0
  @observable public created: boolean = false
  @observable public turn: number = -1
  @observable public readonly players: Collection<Player> = Player.collection()
  @observable public readonly teams: Collection<Team> = Team.collection()

  private interval: NodeJS.Timer

  constructor(
    id: string,
    players: Player[] | Collection<Player>
  ) {
    super(id)

    this.players.set(players)
    this.teams.set(Object.values(TeamKind).map((teamKind) => new Team(
      teamKind,
      this.players.filter(player => player.teamKind === teamKind)
    )))

    this.nextTurn()
  }

  @computed get currentTeam(): Team {
    return this.teams.at(this.currentTeamIndex)
  }

  @computed get currentPlayer(): Player {
    return this.currentTeam && this.currentTeam.players.at(this.currentPlayerIndex)
  }

  @computed get currentCharacter(): Character {
    return this.currentPlayer && this.currentPlayer.characters.at(this.currentCharacterIndex)
  }

  @computed get characters(): Collection<Character> {
    return this.players.reduce((characters, player) => (
      characters.concat(player.characters)
    ), Character.collection())
  }

  @computed get losingTeamKind(): TeamKind {
    const losingTeam = this.teams.find(team => team.lose)
    return losingTeam ? losingTeam.kind : null
  }

  @action public nextTurn() {
    ++this.turn

    if (this.losingTeamKind) this.disableInterval()

    this.currentTeamIndex = (this.currentTeamIndex + 1)%this.teams.length

    if (this.turn%this.teams.length === 0) {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1)%this.currentTeam.players.length

      for (var i = 1; i <= 3 && !this.currentPlayer.characters.length; ++i) {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1)%this.currentTeam.players.length
      }
    }

    if (this.turn%this.players.length === 0) {
      this.currentCharacterIndex = (this.currentCharacterIndex + 1)%this.currentPlayer.characters.length
    }
  }

  @computedFn public serialize(): SerializedGame {
    return {
      id: this.id,
      losingTeamKind: this.losingTeamKind,
      players: this.players.serialize() as SerializedPlayer[],
      characters: this.characters.serialize() as SerializedCharacter[],
      currentPlayer: this.currentPlayer && this.currentPlayer.serialize(),
      currentCharacter: this.currentCharacter && this.currentCharacter.serialize()
    }
  }

  public disableInterval() {
    clearInterval(this.interval)
  }

  public enableInterval() {
    this.disableInterval()

    this.interval = setInterval(() => {
      this.nextTurn()
    }, GAME_TURN_DURATION) as unknown as NodeJS.Timer
  }
}
