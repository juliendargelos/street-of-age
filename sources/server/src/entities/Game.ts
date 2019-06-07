import { observable, computed, action } from 'mobx'
import { Entity, Collection } from '../core'
import { computedFn } from '../utils'
import { CHARACTERS_PER_PLAYER } from '../constants'
import { Player, SerializedPlayer } from './Player'
import { Team, TeamKind } from './Team'
import { Character } from './Character'

export interface SerializedGame extends SerializedObject {
  id: string,
  players: SerializedPlayer[]
}

const all = new Collection<Game>()

export class Game extends Entity implements Serializable<SerializedGame> {
  public static all = all
  public static collection = all.collection

  @observable public currentTeamIndex: number = -1
  @observable public currentPlayerIndex: number = -1
  @observable public currentCharacterIndex: number = -1
  @observable public turn: number = -1
  @observable public readonly players: Collection<Player> = Player.collection()
  @observable public readonly teams: Collection<Team> = Team.collection()

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
    return this.currentTeam.players.at(this.currentPlayerIndex)
  }

  @computed get currentCharacter(): Character {
    return this.currentPlayer.characters.at(this.currentCharacterIndex)
  }

  @computed get characters(): Collection<Character> {
    return Character.collection(this.players.reduce((characters, player) => {
      characters.push(...player.characters)
      return characters
    }, []))
  }

  @action public nextTurn() {
    ++this.turn

    this.currentTeamIndex = (this.currentTeamIndex + 1)%this.teams.length

    if (this.turn%this.teams.length === 0) {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1)%this.currentTeam.players.length
    }

    if (this.turn%this.players.length === 0) {
      this.currentCharacterIndex = (this.currentCharacterIndex + 1)%CHARACTERS_PER_PLAYER
    }
  }

  @computedFn serialize(): SerializedGame {
    return {
      id: this.id,
      players: this.players.serialize() as SerializedPlayer[]
    }
  }
}
