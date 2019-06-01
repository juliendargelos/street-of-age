import { Socket } from 'socket.io'
import { action, observable } from 'mobx'
import { Player, PlayerTeam } from '../entities/Player'
import { CharacterKind } from '../game/Character'
import Logger, { red } from '../services/Logger'

class PlayerManager {
  @observable private players: Player[] = []

  @action public connect = (socket: Socket): Player => {
    Logger.info(`socket with id ${red(socket.id)} has been connected`)
    const player = new Player(socket, null, null)
    this.players = [...this.players, player]
    return player
  }

  @action public disconnect = (player: Player): void => {
    if (player.room) {
      player.leaveRoom()
    }
    this.players = this.players.filter(p => p.id !== player.id)
    Logger.info(`socket with id ${red(player.id)} has been disconnected`)
  }

  public find = (socket: Socket): Player | undefined => {
    return this.players.find(player => player.id === socket.id)
  }
}

export default new PlayerManager()
