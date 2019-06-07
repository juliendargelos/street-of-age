import nipplejs, { JoystickManager, JoystickManagerOptions } from 'nipplejs'
import TouchDetection from '@/game/entities/TouchDetection'
import { GameManager } from '@/game/manager/GameManager'

const DEFAULTS: JoystickManagerOptions = {
  lockX: true,
  mode: 'static',
  position: { left: '80px', bottom: '80px' },
  color: 'red'
}

export type JoystickMoveEvent = CustomEvent<{
  delta: number
}>

interface Axis {
  horizontal: number
}

interface JoystickEventsMap {
  'start': Event,
  'move': JoystickMoveEvent,
  'end': Event
}

class InputManager implements EventTarget {
  private delegate = document.createDocumentFragment()
  private joystick: JoystickManager | null = null
  private axis: Axis = { horizontal: 0 }

  public touch!: TouchDetection

  public init = (gm: GameManager) => {
    if (gm.currentScene) {
      this.touch = new TouchDetection(gm.currentScene.input)
    }
  }

  public detachElement = (): void => {
    if (this.joystick) {
      this.joystick.destroy()
    }
  }

  public attachElement = (element: HTMLElement): void => {
    this.joystick = nipplejs.create({
      ...DEFAULTS,
      zone: element
    })
    this.joystick.on('start', () => {
      this.axis.horizontal = 0
      this.dispatchEvent(new Event('start'))
    })
    this.joystick.on('end', () => {
      this.axis.horizontal = 0
      this.dispatchEvent(new Event('end'))
    })
    this.joystick.on('move', (evt, data) => {
      if (data && data.direction && data.distance) {
        const delta = (data.direction.x === 'right'
          ? data.distance
          : -data.distance) / 10
        this.axis.horizontal = delta
        this.dispatchEvent(new CustomEvent('move', { detail: { delta } }))
      }
    })
  }

  public getAxis = (axis: keyof Axis): number => {
    return this.axis[axis]
  }

  public addEventListener<K extends keyof JoystickEventsMap> (type: K, listener: (evt: JoystickEventsMap[K]) => void, options?: boolean | AddEventListenerOptions): void {
    this.delegate.addEventListener(type, listener as EventListener, options)
  }

  public dispatchEvent (event: Event): boolean {
    return this.delegate.dispatchEvent(event)
  }

  public removeEventListener<K extends keyof JoystickEventsMap> (type: K, callback: (evt: JoystickEventsMap[K]) => void, options?: EventListenerOptions | boolean): void {
    this.delegate.removeEventListener(type, callback as EventListener, options)
  }
}

export default new InputManager()
