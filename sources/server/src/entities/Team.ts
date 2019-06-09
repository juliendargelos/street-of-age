import { Entity, Collection } from '../core'
import { Player } from './Player'

export enum TeamKind {
  Young = 'young',
  Old = 'old'
}

const all = new Collection<Team>()

export class Team extends Entity {
  public static all = all
  public static collection = all.collection

  public readonly players: Collection<Player> = Player.collection()

  constructor(
    public readonly kind: TeamKind,
    players: Player[] | Collection<Player>
  ) {
    super()
    this.players.set(players)
  }
}
