<template>
  <div class="room-game">
    <transition mode="out-in" name="slide-fade">
      <GameLoader v-if="!isPlaying"/>
      <GameUI :current-character="currentCharacter"
              :current-player="currentPlayer"
              :is-current-player="isCurrentPlayer"
              :mobile="mobile"
              v-if="isPlaying"/>    </transition>
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
import { GameScene, Shoot } from '@/game/scenes/GameScene'
import { Player } from '@/@types/'
import { REGISTRY_LEVEL_KEY } from '@/constants'
// TODO: The level should be fetched from the server. Meanwhile, it's hard-fetched for testing purposes
import level from '@/assets/levels/SmallStreet.level.json'
import GameManager from '@/game/manager/GameManager'
import GameUI from '@/components/ui/GameUI.vue'
import AppModule from '@/store/modules/app'
import PhaserUpdatePlugin from 'phaser-plugin-update'
import GameModule from '@/store/modules/game'
import { GameEvents } from '@street-of-age/shared/socket/events'
import { Character, SerializedCharacter } from '@/game/entities/Character'
import { Emitter } from '@/main'
import { UIEvents } from '@street-of-age/shared/game/events'
import { PlayerTeam, SerializedPlayer } from '@street-of-age/shared/entities/player'
import GameLoader from '@/components/ui/GameLoader.vue'

const throttle = (method: (...args: any) => void, limit: number, always: (...args: any) => boolean = () => false): (...args: any) => void => {
  let inThrottle: boolean = false
  let timeout: number

  return (...args: any) => {
    if (!inThrottle || always(...args)) {
      method(...args)
      inThrottle = true
      clearTimeout(timeout)
      timeout = setTimeout(() => inThrottle = false, limit)
    }
  }
}

@Component<RoomGame>({
  components: { GameLoader, GameUI },
  sockets: {
    [GameEvents.GameCreated] (game: { characters: SerializedCharacter[], currentCharacter: SerializedCharacter, currentPlayer: { id: string } }) {
      Emitter.emit(UIEvents.ResetTimer)
      Emitter.emit(UIEvents.PauseTimer)
      this.scene.setCharacters(game.characters)
      const character = this.scene.characters.get(game.currentCharacter.id) as Character
      this.scene.setCurrentCharacter(character)

      this.currentPlayer = game.currentPlayer
      this.currentCharacter = game.currentCharacter
      if (this.isCurrentPlayer) this.scene.enableControls(character)
      else this.scene.disableControls()
    },

    // [GameEvents.GameUpdated](game: { characters: SerializedCharacter[] }) {
    //   this.scene.setCharacters(game.characters)
    // },

    [GameEvents.GameCharacterMoved] (character: SerializedCharacter) {
      this.scene.moveCharacter(character)
    },

    [GameEvents.GameCharacterDied] (character: SerializedCharacter) {
      this.scene.removeCharacter(character.id)
    },

    [GameEvents.GameCharacterShooted] (shoot: Shoot) {
      this.scene.shoot(shoot)
    },

    [GameEvents.GameTurnChanged] (game: { players: SerializedPlayer[], losingTeamKind: PlayerTeam, characters: SerializedCharacter[], currentCharacter: SerializedCharacter, currentPlayer: { id: string } }) {
      // Emitter.emit(UIEvents.ResetTimer)
      this.scene.resetVelocity()

      if (game.losingTeamKind) {
        GameModule.setData(game)
        this.$router.replace({ name: 'room-finish', params: { id: this.$route.params.id } })
        return
      }

      if (game.currentCharacter) {
        const character = this.scene.characters.get(game.currentCharacter.id) as Character
        this.scene.setCurrentCharacter(character)

        this.currentPlayer = game.currentPlayer
        this.currentCharacter = game.currentCharacter
        if (this.isCurrentPlayer) this.scene.enableControls(character)
        else this.scene.disableControls()
      }
    },

    [GameEvents.GameCharacterTookDamage] (character: SerializedCharacter) {
      const localCharacter = this.scene.characters.get(character.id) as Character
      localCharacter.health = character.health
    }
  },
  mounted () {
    this.scene = new GameScene({
      created: () => {
        this.$socket.emit(GameEvents.GameCreate, this.$route.params.id)
      },

      characterMoved: throttle((character: SerializedCharacter) => {
        if (this.isCurrentPlayer) {
          this.$socket.emit(GameEvents.GameCharacterMove, character)
        }
      }, 100, ({ velocityX, velocityY }) => velocityX === 0 && velocityY === 0),

      characterShooted: (shoot: Shoot) => {
        if (this.isCurrentPlayer) {
          this.$socket.emit(GameEvents.GameCharacterShoot, shoot)
          this.scene.disableControls()
        }
      },

      characterDied: (character: SerializedCharacter) => {
        if (this.isCurrentPlayer) {
          this.$socket.emit(GameEvents.GameCharacterDie, character)
        }
      },

      characterTookDamage: (damage: { id: string, damage: number }) => {
        if (this.isCurrentPlayer) {
          this.$socket.emit(GameEvents.GameCharacterTakeDamage, damage)
        }
      }
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
    public currentPlayer: { id: string } = { id: '' }
    public currentCharacter: SerializedCharacter | null = null
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

    get isCurrentPlayer () {
      return AppModule.player.id === this.currentPlayer.id
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
        scene: this.scene
      }
    }
}
</script>
