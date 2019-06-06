<template>
  <div class="game-ui">
    <template v-if="!paused">
      <virtual-joystick v-if="mobile"/>
      <img v-if="mobile" @click="onJumpButtonClick" class="button button--jump" :src="require('@/assets/ui/jump.svg')" alt="">
      <img @click="pauseToggle" class="button button--pause" :src="require('@/assets/ui/pause.svg')" alt="">
    </template>
    <GamePauseUI @close="pauseToggle" v-if="paused"/>
    <transition name="fade" mode="out-in">
      <div v-if="countdown > 0" class="game-ui__starting">
        <transition-group name="zoom-out" mode="out-in">
          <h1 :key="n" v-for="n in countdown" v-if="countdown === n" class="road-rage">
            {{ n - 1 > 0 ? n - 1 : 'Fight!' }}
          </h1>
        </transition-group>
      </div>
    </transition>
  </div>
</template>

<style lang="sass">
.game-ui
  position: fixed
  top: 0
  left: 0
  bottom: 0
  right: 0
  height: 100%
  width: 100%
  z-index: 11
  pointer-events: none
  &__starting
    position: fixed
    display: flex
    justify-content: center
    align-items: center
    z-index: 1000
    width: 100%
    height: 100%
    background: transparentize($black, 0.5)
    pointer-events: all
    h1
      font-size: 72px
  & .button
    pointer-events: all
    position: absolute
    &--jump
      bottom: 40px
      right: 40px
    &--pause
      top: 20px
      right: 20px
      opacity: 0.3
</style>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Emitter } from '@/main'
import { UIEvents } from '@street-of-age/shared/src/game/events'
import GamePauseUI from '@/components/ui/GamePauseUI.vue'
import VirtualJoystick from '@/components/VirtualJoystick.vue'

@Component<GameUI>({
  components: { VirtualJoystick, GamePauseUI },
  mounted (): void {
    this.intervalId = setInterval(() => {
      this.countdown--
    }, 1000)
  }
})
export default class GameUI extends Vue {
  public paused: boolean = false
  public countdown: number = 4
  private intervalId!: number
  @Prop({ type: Boolean, default: false }) readonly mobile!: boolean

  @Watch('countdown')
  private onCountdownChange (countdown: number) {
    if (countdown <= 0) {
      clearInterval(this.intervalId)
    }
  }

  public onJumpButtonClick () {
    Emitter.emit(UIEvents.Jump)
  }
  public pauseToggle () {
    this.paused = !this.paused
    const canvas = document.querySelector('canvas')
    if (canvas) {
      this.paused ? canvas.classList.add('paused') : canvas.classList.remove('paused')
    }
  }
}
</script>
