import nipplejs, { JoystickManager, JoystickManagerOptions } from 'nipplejs'

const DEFAULTS: JoystickManagerOptions = {
  lockX: true,
  mode: 'static',
  position: { left: '50%', top: '50%' },
  color: 'red'
}

export type JoystickMoveEvent = CustomEvent<{
  delta: number
}>

interface JoystickEventsMap {
  'start': Event,
  'move': JoystickMoveEvent,
  'end': Event
}

class InputManager implements EventTarget {
  private delegate = document.createDocumentFragment()
  private joystick!: JoystickManager

  public detachElement = (): void => {
    this.joystick.destroy()
  }

  public attachElement = (element: HTMLElement): void => {
    this.joystick = nipplejs.create({
      ...DEFAULTS,
      zone: element
    })
    this.joystick.on('start', () => {
      this.dispatchEvent(new Event('start'))
    })
    this.joystick.on('end', () => {
      this.dispatchEvent(new Event('end'))
    })
    this.joystick.on('move', (evt, data) => {
      if (data && data.direction && data.distance) {
        const delta = (data.direction.x === 'right'
          ? data.distance
          : -data.distance) / 10
        this.dispatchEvent(new CustomEvent('move', { detail: { delta } }))
      }
    })
  }

  public addEventListener<K extends keyof JoystickEventsMap> (type: K, listener: (evt: JoystickEventsMap[K]) => void, options?: boolean | AddEventListenerOptions): void {
    this.delegate.addEventListener(type, listener, options)
  }

  public dispatchEvent (event: Event): boolean {
    return this.delegate.dispatchEvent(event)
  }

  public removeEventListener<K extends keyof JoystickEventsMap> (type: K, callback: (evt: JoystickEventsMap[K]) => void, options?: EventListenerOptions | boolean): void {
    this.delegate.removeEventListener(type, callback, options)
  }
}

export default new InputManager()
