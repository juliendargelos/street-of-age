<template>
  <div class="player__health" :style="rootStyle">
    <img class="player__health__picture" :src="picture" alt="">
    <div class="player__health--outer">
      <div class="player__health--inner" :style="style">

      </div>
    </div>
  </div>
</template>

<style lang="sass">
.player__health
  position: fixed
  left: 20px
  top: 30px
  padding-left: 20px
  &__picture
    position: absolute
    z-index: 1
    bottom: 0
    left: 30px
  &--outer
    width: 200px
    height: 30px
    transform: skewX(35deg)
    background: var(--darker-color)
    position: relative
    overflow: hidden
    clip-path: polygon(17% 0, 17% 60%, 100% 60%, 100% 100%, 0 100%, 0 0)
  &--inner
    position: absolute
    left: 0
    top: 0
    bottom: 0
    right: 0
    width: 100%
    background: var(--color)
</style>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { CharacterKind } from '@/store/modules/app'
import { PlayerColor } from '@street-of-age/shared/entities/player'
import Color from 'color'
import PlayerHealthTimer from '@/components/ui/PlayerHealthTimer.vue'

@Component<PlayerHealth>({
  components: { PlayerHealthTimer }
})
export default class PlayerHealth extends Vue {
  @Prop({ type: Number, required: true }) readonly health!: number
  @Prop({ type: String, required: true }) readonly kind!: CharacterKind | string
  @Prop({ type: String, required: true }) readonly color!: PlayerColor

  get style () {
    return {
      width: `${this.health * (100 / 4)}%`
    }
  }

  get rootStyle () {
    return {
      '--color': this.color,
      '--darker-color': Color(this.color).darken(0.5)
    }
  }

  get picture () {
    return require(`@/assets/characters/health/${this.kind}.png`)
  }
}
</script>
