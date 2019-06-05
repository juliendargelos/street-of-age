<template>
  <div class="game-ui">
    <template v-if="!paused">
      <virtual-joystick v-if="mobile"/>
      <img v-if="mobile" @click="onJumpButtonClick" class="button button--jump" :src="require('@/assets/ui/jump.svg')" alt="">
      <img @click="pauseToggle" class="button button--pause" :src="require('@/assets/ui/pause.svg')" alt="">
    </template>
    <GamePauseUI @close="pauseToggle" v-if="paused"/>
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
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Emitter } from '@/main'
import { UIEvents } from '@street-of-age/shared/src/game/events'
import GamePauseUI from '@/components/ui/GamePauseUI.vue'
import VirtualJoystick from '@/components/VirtualJoystick.vue'

@Component({
  components: { VirtualJoystick, GamePauseUI }
})
export default class GameUI extends Vue {
  public paused: boolean = false
  @Prop({ type: Boolean, default: false }) readonly mobile!: boolean

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
