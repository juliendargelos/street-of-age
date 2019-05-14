import { Character } from '@/game/entities/Character'

interface ProjectileMoveEvent {
  pointer: Phaser.Input.Pointer
}

interface ProjectileDetectionEventsMap {
  'player:tap': Event,
  'projectile:launch': Event
  'projectile:move': CustomEvent<ProjectileMoveEvent>
}

class ProjectileDetection implements EventTarget {
  private delegate = document.createDocumentFragment()
  private playerTapped = false

  constructor (private readonly input: Phaser.Input.InputPlugin) {
    this.input.on('pointerdown', (_: Phaser.Input.Pointer, currentlyOver: any[]) => {
      if (currentlyOver.some(object => object instanceof Character)) {
        this.playerTapped = true
        this.dispatchEvent(new Event('player:tap'))
      } else {
        this.playerTapped = false
      }
    })
    this.input.on('pointerup', () => {
      if (this.playerTapped) {
        this.dispatchEvent(new Event('projectile:launch'))
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
