<template>
  <div class="game__timer" :style="style">
    <div class="game__timer--left" :style="{ height: `${percentage.left}%`}"></div>
    <div class="game__timer--bottom" :style="{ width: `${percentage.bottom}%`}"></div>
    <div class="game__timer--right" :style="{ height: `${percentage.right}%`}"></div>
    <div class="game__timer--top" :style="{ width: `${percentage.top}%`}"></div>
  </div>
</template>

<style lang="sass">
.game__timer
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  background: transparent
  &--left,&--bottom,&--right,&--top
    background: var(--color)
  &--left
    position: absolute
    left: 0
    bottom: 0
    width: 4px
    height: 100%
  &--bottom
    position: absolute
    bottom: 0
    right: 0
    width: 100%
    height: 4px
  &--right
    position: absolute
    right: 0
    top: 0
    width: 4px
    height: 100%
  &--top
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 4px
</style>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { PlayerColor, SerializedPlayer } from '@street-of-age/shared/entities/player'
import { Emitter } from '@/main'
import { UIEvents } from '@street-of-age/shared/game/events'

const GAME_TURN_DURATION = 15000

@Component<GameTimer>({
  mounted (): void {
    Emitter.on(UIEvents.ResetTimer, this.reset)
    Emitter.on(UIEvents.PauseTimer, this.pause)
    Emitter.on(UIEvents.ResumeTimer, this.resume)
    this.rafId = requestAnimationFrame(this.onTick)
  },
  beforeDestroy (): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
    }
    Emitter.removeAllListeners(UIEvents.ResetTimer)
    Emitter.removeAllListeners(UIEvents.PauseTimer)
    Emitter.removeAllListeners(UIEvents.ResumeTimer)
  }
})
export default class GameTimer extends Vue {
  // @Prop({ type: String, required: true }) readonly color!: PlayerColor
  @Prop({ type: Object, required: false }) readonly currentPlayer!: SerializedPlayer

  private rafId: number | null = null
  public remaining = {
    left: GAME_TURN_DURATION / 4,
    bottom: GAME_TURN_DURATION / 4,
    right: GAME_TURN_DURATION / 4,
    top: GAME_TURN_DURATION / 4
  }
  public paused = false
  private time: number = 0

  @Watch('paused')
  private onPausedChange (paused: boolean) {
    if (paused) {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId)
      }
    } else {
      this.resetRaf()
    }
  }

  @Watch('currentPlayer')
  private onCurrentPlayerChanged (player: SerializedPlayer) {
    this.remaining.left = GAME_TURN_DURATION / 4
    this.remaining.bottom = GAME_TURN_DURATION / 4
    this.remaining.right = GAME_TURN_DURATION / 4
    this.remaining.top = GAME_TURN_DURATION / 4
    this.resume()
    this.resetRaf()
  }

  private resetRaf () {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
    }
    this.time = Date.now()
    this.rafId = requestAnimationFrame(this.onTick)
  }

  private reset () {
    this.remaining.left = GAME_TURN_DURATION / 4
    this.remaining.bottom = GAME_TURN_DURATION / 4
    this.remaining.right = GAME_TURN_DURATION / 4
    this.remaining.top = GAME_TURN_DURATION / 4
    this.resetRaf()
  }

  private pause () {
    this.paused = true
  }

  private resume () {
    this.paused = false
  }

  private onTick () {
    const time = Date.now()
    const delta = time - this.time
    this.time += delta
    if (!this.paused) {
      this.remaining.left -= delta
      if (this.remaining.left <= 0) {
        this.remaining.left = 0
        this.remaining.bottom -= delta
        if (this.remaining.bottom <= 0) {
          this.remaining.bottom = 0
          this.remaining.right -= delta
          if (this.remaining.right <= 0) {
            this.remaining.right = 0
            this.remaining.top -= delta
            if (this.remaining.top <= 0) {
              this.remaining.left = 0
              this.remaining.bottom = 0
              this.remaining.right = 0
              this.remaining.top = 0
              this.pause()
            }
          }
        }
      }
      this.rafId = requestAnimationFrame(this.onTick)
    }
  }

  get percentage () {
    return {
      left: this.remaining.left / (GAME_TURN_DURATION / 4) * 100,
      bottom: this.remaining.bottom / (GAME_TURN_DURATION / 4) * 100,
      right: this.remaining.right / (GAME_TURN_DURATION / 4) * 100,
      top: this.remaining.top / (GAME_TURN_DURATION / 4) * 100
    }
  }

  get style () {
    return {
      '--color': this.currentPlayer.color
    }
  }
}
</script>
