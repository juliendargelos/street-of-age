import { Character } from '@/game/entities/Character'

const DISTANCE_TAP_THRESHOLD = 40

interface ProjectileMoveEvent {
  pointer: Phaser.Input.Pointer
}

interface ProjectileLaunchEvent {
  distance: number,
  angle: number,
  position: Phaser.Math.Vector2
}

export type ProjectileLaunchEventHandler = (evt: ProjectileDetectionEventsMap['projectile:launch']) => void
export type ProjectileMoveEventHandler = (evt: ProjectileDetectionEventsMap['projectile:move']) => void

interface ProjectileDetectionEventsMap {
  'tap': Event,
  'player:tap': Event,
  'player:untap': Event,
  'projectile:launch': CustomEvent<ProjectileLaunchEvent>
  'projectile:move': CustomEvent<ProjectileMoveEvent>
}

class TouchDetection implements EventTarget {
  private delegate = document.createDocumentFragment()
  private playerTapped = false
  private lastTappedPosition = new Phaser.Math.Vector2({ x: 0, y: 0 })

  constructor (private readonly input: Phaser.Input.InputPlugin) {
    this.initEventListeners()
  }

  private initEventListeners = (): void => {
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, currentlyOver: any[]) => {
      this.lastTappedPosition = pointer.position.clone()
      this.playerTapped = currentlyOver.some(object => object instanceof Character)
      if (!this.playerTapped) {
        this.dispatchEvent(new Event('tap'))
      }
    })

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      this.dispatchEvent(new Event('player:untap'))
      if (this.playerTapped) {
        if (pointer.getDistance() > DISTANCE_TAP_THRESHOLD) {
          const angle = Phaser.Math.RadToDeg(pointer.getAngle())
          this.dispatchEvent(new CustomEvent<ProjectileLaunchEvent>('projectile:launch', {
            detail: { angle: angle, distance: pointer.getDistance(), position: new Phaser.Math.Vector2(pointer.worldX, pointer.worldY) }
          }))
        } else {
          this.dispatchEvent(new Event('player:tap'))
        }
      }
      this.playerTapped = false
    })

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.playerTapped && pointer.getDistance() > DISTANCE_TAP_THRESHOLD) {
        this.dispatchEvent(new CustomEvent<ProjectileMoveEvent>('projectile:move', { detail: { pointer } }))
      } else {
        this.dispatchEvent(new Event('player:untap'))
      }
    })
  }

  public removeEventListeners = (): void => {
    this.delegate = document.createDocumentFragment()
  }

  public addEventListener<K extends keyof ProjectileDetectionEventsMap> (type: K, listener: (evt: ProjectileDetectionEventsMap[K]) => void, options?: boolean | AddEventListenerOptions): void {
    this.delegate.addEventListener(type, listener, options)
  }

  public dispatchEvent (event: Event): boolean {
    return this.delegate.dispatchEvent(event)
  }

  public removeEventListener<K extends keyof ProjectileDetectionEventsMap> (type: K, callback: (evt: ProjectileDetectionEventsMap[K]) => void, options?: EventListenerOptions | boolean): void {
    this.delegate.removeEventListener(type, callback, options)
  }
}

export default TouchDetection
