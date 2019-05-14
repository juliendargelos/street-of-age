import { Character } from '@/game/entities/Character'

const DISTANCE_TAP_THRESHOLD = 30

interface ProjectileMoveEvent {
  pointer: Phaser.Input.Pointer
}

interface ProjectileDetectionEventsMap {
  'player:tap': Event,
  'player:untap': Event,
  'projectile:launch': Event
  'projectile:move': CustomEvent<ProjectileMoveEvent>
}

class ProjectileDetection implements EventTarget {
  private delegate = document.createDocumentFragment()
  private playerTapped = false
  private lastTappedPosition = new Phaser.Math.Vector2({ x: 0, y: 0 })

  constructor (private readonly input: Phaser.Input.InputPlugin) {
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, currentlyOver: any[]) => {
      this.lastTappedPosition = pointer.position.clone()
      if (currentlyOver.some(object => object instanceof Character)) {
        this.playerTapped = true
      } else {
        this.playerTapped = false
      }
    })
    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      const { position } = pointer
      this.dispatchEvent(new Event('player:untap'))
      if (this.playerTapped) {
        if (position.clone().distance(this.lastTappedPosition) > DISTANCE_TAP_THRESHOLD) {
          this.dispatchEvent(new Event('projectile:launch'))
        } else {
          this.dispatchEvent(new Event('player:tap'))
        }
      }
      this.playerTapped = false
    })
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.playerTapped) {
        this.dispatchEvent(new CustomEvent<ProjectileMoveEvent>('projectile:move', { detail: { pointer } }))
      }
    })
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

export default ProjectileDetection
