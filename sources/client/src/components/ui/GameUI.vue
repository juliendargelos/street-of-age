<template>
  <div class="game-ui">
    <GameTimer v-if="currentPlayer" :current-player="currentPlayer"/>
    <template v-if="!paused">
      <PlayerHealth v-if="currentCharacter" :health="currentCharacter.health" :kind="currentCharacter.kind" :color="currentPlayer.color"/>
      <virtual-joystick v-if="mobile && isCurrentPlayer"/>
      <img v-if="mobile && isCurrentPlayer" ref="jump" @click="onJumpButtonClick" class="button button--jump" :src="require('@/assets/ui/jump.svg')" alt="">
      <img @click="pauseToggle" class="button button--pause" :src="require('@/assets/ui/pause.svg')" alt="">
    </template>
    <transition name="slide-fade" mode="out-in">
      <GamePauseUI @close="pauseToggle" v-if="paused"/>
    </transition>
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
      font-size: 140px
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
import PlayerHealth from '@/components/ui/PlayerHealth.vue'
import AudioManager from '@/game/manager/AudioManager'
import { SerializedCharacter } from '@street-of-age/shared/game/character'
import GameTimer from '@/components/ui/GameTimer.vue'
import { SerializedPlayer } from '@street-of-age/shared/entities/player'

@Component<GameUI>({
  components: { GameTimer, PlayerHealth, VirtualJoystick, GamePauseUI },
  mounted (): void {
    this.$refs.jump.addEventListener('touchstart', this.onJumpButtonClick)
    this.intervalId = setInterval(() => {
      this.countdown--
    }, 1000)
  },
  beforeDestroy (): void {
    this.$refs.jump.removeEventListener('touchstart', this.onJumpButtonClick)
  }
})
export default class GameUI extends Vue {
  $refs!: {
    jump: HTMLButtonElement
  }
  public paused: boolean = false
  public countdown: number = 4
  private intervalId!: number
  @Prop({ type: Boolean, default: false }) readonly mobile!: boolean
  @Prop({ type: Boolean, default: false }) readonly isCurrentPlayer!: boolean
  @Prop({ type: Object, default: null }) readonly currentCharacter!: SerializedCharacter
  @Prop({ type: Object, default: null }) readonly currentPlayer!: SerializedPlayer

  @Watch('countdown')
  private onCountdownChange (countdown: number) {
    if (countdown <= 0) {
      clearInterval(this.intervalId)
      Emitter.emit(UIEvents.ResumeTimer)
    }
  }

  public onJumpButtonClick () {
    Emitter.emit(UIEvents.Jump)
  }

  public pauseToggle () {
    AudioManager.playSfx('start', { volume: 0.15 })
    this.paused = !this.paused
    const canvas = document.querySelector('canvas')
    if (canvas) {
      this.paused ? canvas.classList.add('paused') : canvas.classList.remove('paused')
    }
  }
}
</script>
