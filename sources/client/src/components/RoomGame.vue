<template>
  <div class="room-game">
    <virtual-joystick v-if="mobile" @move="onJoystickMove" @start="onJoystickStart" @end="onJoystickEnd"/>
  </div>
</template>

<style lang="sass">
.room-game
  height: 100%
  position: relative

  &__renderer
    height: 100%
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Phaser from 'phaser'
import { GameScene } from '@/game/scenes/GameScene'
import { GameDebugScene } from '@/game/scenes/GameDebugScene'
import { Player } from '@/@types/'
import VirtualJoystick from '@/components/VirtualJoystick.vue'
import { Emitter } from '@/main'
import { UIEvents } from '@/enums'

@Component<RoomGame>({
  components: { VirtualJoystick },
  mounted () {
    this.game = new Phaser.Game(this.config)
    this.mobile = !this.game.device.os.desktop &&
      (this.game.device.os.android || this.game.device.os.iOS || this.game.device.os.windowsPhone)
  },
  beforeDestroy () {
    this.game.destroy(false)
    delete this.game
  }
})
export default class RoomGame extends Vue {
    $el!: HTMLDivElement
    private game!: Phaser.Game
    private mobile: boolean = false
    @Prop({ type: Boolean, default: process.env.NODE_ENV === 'development' }) readonly debug!: boolean
    @Prop({ type: Array, default: () => [] }) readonly players!: Player[]

    @Watch('players', { deep: true, immediate: true })
    private onPlayersChanged (val: Player[], oldVal: Player[]) {
    }

    private onJoystickMove (delta: number) {
      Emitter.emit(UIEvents.JoystickMove, delta)
    }

    private onJoystickStart () {
      Emitter.emit(UIEvents.JoystickStart)
    }

    private onJoystickEnd () {
      Emitter.emit(UIEvents.JoystickEnd)
    }

    get config (): GameConfig {
      return {
        parent: this.$el,
        scale: {
          mode: Phaser.Scale.RESIZE
        },
        input: {
          gamepad: false,
          keyboard: true,
          mouse: true,
          touch: true
        },
        physics: {
          arcade: {
            debug: this.debug,
            gravity: { y: 0 }
          },
          default: 'arcade'
        },
        disableContextMenu: true,
        scene: [
          this.debug ? GameDebugScene : GameScene
        ]
      }
    }
}
</script>
