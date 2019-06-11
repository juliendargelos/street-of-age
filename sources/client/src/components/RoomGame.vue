<template>
  <div class="room-game">
    <GameUI v-if="isPlaying" :mobile="mobile"/>
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
    will-change: filter
    transition: all .2s
    &.paused
      filter: blur(25px)
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Phaser from 'phaser'
import { GameScene } from '@/game/scenes/GameScene'
import { Player } from '@/@types/'
import { REGISTRY_LEVEL_KEY } from '@/constants'
// TODO: The level should be fetched from the server. Meanwhile, it's hard-fetched for testing purposes
import level from '@/assets/levels/SmallStreet.level.json'
import GameManager from '@/game/manager/GameManager'
import GameUI from '@/components/ui/GameUI.vue'
import AppModule from '@/store/modules/app'
import PhaserUpdatePlugin from 'phaser-plugin-update'

@Component<RoomGame>({
  components: { GameUI },
  mounted () {
    this.game = new Phaser.Game(this.config)
    GameManager.init(this.game)
    this.game.registry.set(REGISTRY_LEVEL_KEY, level)
    this.mobile = !this.game.device.os.desktop &&
      (this.game.device.os.android || this.game.device.os.iOS || this.game.device.os.windowsPhone)
  },
  beforeDestroy () {
    this.game.destroy(false)
    GameManager.destroy()
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

    get isPlaying (): boolean {
      return AppModule.isPlaying
    }

    get config (): Phaser.Types.Core.GameConfig {
      return {
        parent: this.$el,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: Math.max(window.innerWidth, window.innerHeight),
          height: Math.min(window.innerWidth, window.innerHeight)
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
        plugins: {
          scene: [
            {
              key: 'updatePlugin', plugin: PhaserUpdatePlugin, mapping: 'updates'
            }
          ]
        },
        disableContextMenu: true,
        scene: GameScene
      }
    }
}
</script>
