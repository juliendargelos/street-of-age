<template>
  <div class="debug-game">
    <GameUI
      :current-character="null"
      :current-player="null"
      :is-current-player="true"
      :mobile="mobile"
    />
  </div>
</template>

<style lang="sass">
.debug-game
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
import { Component, Prop, Vue } from 'vue-property-decorator'
import Phaser from 'phaser'
import { GameScene } from '@/game/scenes/GameScene'
import { REGISTRY_LEVEL_KEY } from '@/constants'
// TODO: The level should be fetched from the server. Meanwhile, it's hard-fetched for testing purposes
import level from '@/assets/levels/SmallStreet.level.json'
import GameManager from '@/game/manager/GameManager'
import PhaserUpdatePlugin from 'phaser-plugin-update'
import GameLoader from '@/components/ui/GameLoader.vue'
import { SerializedCharacter } from '@street-of-age/shared/game/character'
import GameUI from '@/components/ui/GameUI.vue'
const RANDOMS_X = [420, 720, 580, 830, 1200, 1260, 1370, 1400, 1640, 1720, 1780, 1860, 1900, 2000, 2200, 2700, 2850, 3400, 3600]

@Component<DebugGame>({
  components: {
    GameUI
  },

  mounted () {
    this.scene = new GameScene({
      created: () => {
        const characters = [
          'egocentric',
          'geek',
          'hippie',
          'doting-granny',
          'fusty-grandpa',
          'lapdog-woman',
          'mr-muscle',
          'fattie'
        ].map(kind => ({
          id: kind,
          kind,
          x: RANDOMS_X[Math.floor(Math.random() * RANDOMS_X.length)],
          y: Math.random()*-500
        }))

        this.scene.setCharacters(characters as SerializedCharacter[])
        this.scene.setCurrentCharacter(this.scene.characters.get('geek')!)
        this.scene.enableControls(this.scene.characters.get('geek')!)
      },

      characterShooted: () => {
        setTimeout(() => {
          this.scene.setCurrentCharacter(this.scene.controlledCharacter!)
        }, 4000)
      },

      characterDied: (character: SerializedCharacter) => {
        if (character.id === this.scene.controlledCharacter!.id) {
          const length = this.scene.characters.size
          const id = length.toString()
          const [_, character] = [...this.scene.characters][~~(Math.random()*length)]
          this.scene.createCharacter({ ...character, id })
          this.scene.setCurrentCharacter(this.scene.characters.get(id)!)
          this.scene.enableControls(this.scene.characters.get(id)!)
        }
      },
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
export default class DebugGame extends Vue {
    $el!: HTMLDivElement
    private game!: Phaser.Game
    private scene!: GameScene
    private mobile: boolean = false
    @Prop({ type: Boolean, default: process.env.NODE_ENV === 'development' }) readonly debug!: boolean

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
