<template>
  <div class="game__timer" :style="style">
  </div>
</template>

<style lang="sass">
.game__timer
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  width: 100%
  height: 4px
  background: var(--color)
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
  @Prop({ type: String, required: true }) readonly color!: PlayerColor
  @Prop({ type: Object, required: true }) readonly currentPlayer!: SerializedPlayer

  private rafId: number | null = null
  public remaining = GAME_TURN_DURATION
  public paused = false

  @Watch('paused')
  private onPausedChange (paused: boolean) {
    if (paused) {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId)
        console.log('clearing RAF')
      }
    } else {
      this.rafId = requestAnimationFrame(this.onTick)
      console.log('Resuming RAF')
    }
  }

  @Watch('currentPlayer')
  private onCurrentPlayerChanged (player: SerializedPlayer) {
    this.resetRaf()
  }

  private resetRaf () {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
    }
    this.rafId = requestAnimationFrame(this.onTick)
  }

  private reset () {
    this.remaining = GAME_TURN_DURATION
    this.resetRaf()
  }

  private pause () {
    this.paused = true
  }

  private resume () {
    this.paused = false
  }

  private onTick (delta: number) {
    if (!this.paused) {
      this.remaining -= 1000 / 60
      console.log('tick')
      if (this.remaining <= 0) {
        this.remaining = GAME_TURN_DURATION
      }
      this.rafId = requestAnimationFrame(this.onTick)
    }
  }

  get percentage () {
    return this.remaining * (100 / GAME_TURN_DURATION)
  }

  get style () {
    return {
      '--color': this.color,
      width: `${this.percentage}%`
    }
  }
}
</script>
