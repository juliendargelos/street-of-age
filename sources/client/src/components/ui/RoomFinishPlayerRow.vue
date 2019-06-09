<template>
  <div class="player__row" :style="{'--player-color': player.color}">
    <div class="player__row__picture" :data-player-number="playerNumber">
      <img v-if="player.characterKinds.length > 0" :src="require(`@/assets/characters/pictos/${player.characterKinds[0]}.png`)"/>
    </div>
    <div class="player__row__name">
      Joueur {{ playerNumber }}
    </div>
    <div class="player__row__metrics">
      <div class="player__row__metric player__row__metric--death"><h2>{{ death }}</h2></div>
      <div class="player__row__metric player__row__metric--kill"><h2>{{ kill }}</h2></div>
    </div>
  </div>
</template>

<style lang="sass">
.player__row
  box-sizing: border-box
  height: 45px
  display: flex
  background: transparentize($blue, 0.4)
  border-radius: 3px
  margin-bottom: 10px
  &__metrics
    display: flex
    & .player__row__metric
      position: relative
      margin: 0 2px
      display: flex
      justify-content: center
      transform: skewX(-20deg)
      align-items: center
      text-align: center
      width: 40px
      background: $pale-blue
      & h2
        font-family: "Dead Jim", sans-serif
        transform: skewX(20deg)
  &__name
    display: flex
    align-items: center
    justify-content: center
    width: 120px
  &__picture
    border: 2px solid var(--player-color)
    border-radius: 3px
    position: relative
    min-width: 41px
    &:after
      content: attr(data-player-number)
      font-size: 12px
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      width: 100%
      height: 100%
      background: var(--player-color)
      clip-path: polygon(50% 0, 0 0, 0 50%)
    img
      width: 100%
      height: 100%
      object-fit: contain
  &.is-local
    border: 2px solid var(--player-color)
    & .player__row__picture
      border: none
</style>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { SerializedPlayer } from '@street-of-age/shared/entities/player'

@Component<RoomFinishPlayerRow>({})
export default class RoomFinishPlayerRow extends Vue {
  @Prop({ type: Object, required: true }) readonly player!: SerializedPlayer
  @Prop({ type: Number, required: true }) readonly playerNumber!: number
  @Prop({ type: Number, required: true }) readonly death!: number
  @Prop({ type: Number, required: true }) readonly kill!: number
}
</script>
