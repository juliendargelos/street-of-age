<template>
  <div class="room-game">

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

@Component
export default class RoomGame extends Vue {
  $el!: HTMLElement
  private game!: Phaser.Game

  @Prop({ type: Boolean, default: process.env.NODE_ENV === 'development' }) readonly debug!: boolean
  @Prop({ type: Array, default: () => [] }) readonly players!: Player[]

  @Watch('players', { deep: true, immediate: true })
  private onPlayersChanged (val: Player[], oldVal: Player[]) {

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

  mounted () {
    this.game = new Phaser.Game(this.config)
  }

  beforeDestroy () {
    this.game.destroy(false)
    delete this.game
  }
}
</script>
