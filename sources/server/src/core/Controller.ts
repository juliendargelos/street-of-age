import { autorun, when } from 'mobx'

export class Controller {
  protected readonly socket: SocketIO.Socket
  protected readonly events: string[]
  protected readonly reactions: (() => void)[] = []

  protected autorun: typeof autorun = ((view: any,...args: any) => {
    const reaction = autorun(view, ...args)
    this.reactions.push(reaction)
    return reaction
  })

  protected when: typeof when = <typeof when>((predicate: any, ...args: any) => {
    const reaction = when(predicate, ...args)
    this.reactions.push(reaction as unknown as (() => void))
    return reaction
  })

  constructor(socket: SocketIO.Socket, events: string[]) {
    this.socket = socket
    this.events = events
    this.events.forEach(event => (this as any)[event] = this.handler(event).bind(this))
    this.mount()
  }

  protected get io() {
    return this.socket.server
  }

  private handler(event: string): (...args: any[]) => void {
    return ((this as any)[event] as (...args: any[]) => void)
  }

  public mount() {
    this.events.forEach(event => this.socket.on(event, this.handler(event)))
  }

  public unmount() {
    this.events.forEach(event => this.socket.off(event, this.handler(event)))
    this.reactions.forEach(dispose => dispose())
  }
}
