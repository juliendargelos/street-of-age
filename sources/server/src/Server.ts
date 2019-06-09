import * as socketio from 'socket.io'
import * as express from 'express'
import { autorun } from 'mobx'
import { Express } from 'express'
import { Server as HttpServer } from 'http'
import { SocketEvents } from './Events'
import Logger from './services/Logger'
import { PlayerController } from './controllers/PlayerController'
import { RoomController } from './controllers/RoomController'
import { GameController } from './controllers/GameController'

import { Player } from './entities/Player'
import { Character } from './entities/Character'
import { Room } from './entities/Room'
import { Game } from './entities/Game'

export default new class Server {
  public port: number = Number(process.env.PORT) || 4444
  private app: Express
  private http: HttpServer
  private io: socketio.Server

  public init(): this {
    this.app = express()
    this.app.set('port', this.port)
    this.http = new HttpServer(this.app)
    this.io = socketio(this.http)
    Logger.info('Initialized server')

    return this
  }

  public listen(listener?: (port: number) => void): this {
    this.http.listen(this.port, () => {
      Logger.info(`Listening on port ${this.port}`)
      if (listener)  listener(this.port)
    })

    this.io.on(SocketEvents.Connect, socket => {
      const playerController = new PlayerController(socket)
      const roomController = new RoomController(socket)
      const gameController = new GameController(socket)

      // const disposeDebugPlayer    = autorun(() => console.log('Players   ', Player.all.serialize()))
      // const disposeDebugCharacter = autorun(() => console.log('Characters', Character.all.serialize()))
      // const disposeDebugRoom      = autorun(() => console.log('Rooms     ', Room.all.serialize()))
      // const disposeDebugGame      = autorun(() => console.log('Games     ', Game.all.serialize()))

      socket.on(SocketEvents.Disconnect, () => {
        // disposeDebugPlayer()
        // disposeDebugCharacter()
        // disposeDebugRoom()
        // disposeDebugGame()
        playerController.unmount()
        roomController.unmount()
        gameController.unmount()
      })
    })

    return this
  }
}
