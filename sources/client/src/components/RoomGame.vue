<template>
  <div class="room-game">
    <virtual-joystick v-if="mobile"/>
  </div>
</template>

<style lang="sass">
.room-game
  height: 100%
  position: relative

  &__renderer
    height: 100%
  canvas
    position: fixed
    top: 0
    bottom: 0
    right: 0
    left: 0
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Phaser from 'phaser'
import { GameScene } from '@/game/scenes/GameScene'
import { Player } from '@/@types/'
import VirtualJoystick from '@/components/VirtualJoystick.vue'
import { REGISTRY_LEVEL_KEY } from '@/constants'
// TODO: The level should be fetched from the server. Meanwhile, it's hard-fetched for testing purposes
import level from '@/assets/levels/Street.level.json'

@Component<RoomGame>({
  components: { VirtualJoystick },
  mounted () {
    this.game = new Phaser.Game(this.config)
    this.game.registry.set(REGISTRY_LEVEL_KEY, level)
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

    get config (): Phaser.Types.Core.GameConfig {
      return {
        parent: this.$el,
        scale: {
          zoom: 1 / window.devicePixelRatio,
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: 667,
          height: 375
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
        scene: GameScene
      }
    }
}
</script>
