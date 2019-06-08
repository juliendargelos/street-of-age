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
import { GameEvents } from '@street-of-age/shared/socket/events'
import { Character, SerializedCharacter } from '@/game/entities/Character'

@Component<RoomGame>({
  components: { GameUI },
  sockets: {
    [GameEvents.GameCreated] (game: { characters: SerializedCharacter[], currentCharacter: SerializedCharacter, currentPlayer: { id: string } }) {
      this.scene.setCharacters(game.characters)
      const character = this.scene.characters.get(game.currentCharacter.id) as Character
      this.scene.setCurrentCharacter(character)

      if (game.currentPlayer.id === AppModule.player.id) this.scene.enableControls(character)
      else this.scene.disableControls()
    },

    // [GameEvents.GameUpdated](game: { characters: SerializedCharacter[] }) {
    //   this.scene.setCharacters(game.characters)
    // },

    [GameEvents.GameTurnChanged](game: { characters: SerializedCharacter[], currentCharacter: SerializedCharacter, currentPlayer: { id: string } }) {
      const character = this.scene.characters.get(game.currentCharacter.id) as Character
      this.scene.setCurrentCharacter(character)

      if (game.currentPlayer.id === AppModule.player.id) this.scene.enableControls(character)
      else this.scene.disableControls()
    }
  },
  mounted () {
    this.scene = new GameScene(() => {
      this.$socket.emit(GameEvents.GameCreate, this.$route.params.id)
    })

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
    private scene!: GameScene
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
        disableContextMenu: true,
        scene: this.scene
      }
    }
}
</script>
