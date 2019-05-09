import * as socketio from 'socket.io'
import * as express from 'express'
import { Express } from 'express'
import { Server as HttpServer } from 'http'
import { SocketEvents } from '@street-of-age/shared/socket/events'
import PlayerManager from './managers/PlayerManager'
import SocketRoom from './handlers/SocketRoom'
import SocketPlayer from './handlers/SocketPlayer'
import Logger from './services/Logger'

export default new class Server {
  public port: number = Number(process.env.PORT) || 4444
  private app: Express
  private http: HttpServer
  private io: socketio.Server

  public init = (): this => {
    this.app = express()
    this.app.set('port', this.port)
    this.http = new HttpServer(this.app)
    this.io = socketio(this.http)
    Logger.info('Initialized server')

    return this
  }

  public listen = (listener?: (port: number) => void): this => {
    this.http.listen(this.port, () => {
      Logger.info(`Listening on port ${this.port}`)
      if (listener) {
        listener(this.port)
      }
    })

    this.io.on(SocketEvents.Connect, socket => {
      const player = PlayerManager.connect(socket)

      SocketPlayer.handle(socket)
      SocketRoom.handle(socket)

      socket.on(SocketEvents.Disconnect, () => {
        PlayerManager.disconnect(player)
      })
    })

    return this
  }
}
