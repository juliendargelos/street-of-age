<template>
  <div class="setup__character__ready__overlay" @click.self="$emit('close')">
    <div class="setup__character__ready__overlay__container">
      <h2 @click="$emit('click')" class="road-rage">{{ this.heading }}</h2>
      <h3>Touche pour commencer</h3>
    </div>
  </div>
</template>

<style lang="sass">
.setup__character__ready__overlay
  position: fixed
  top: 0
  bottom: 0
  left: 0
  right: 0
  z-index: 1000
  background: transparentize($black, 0.4)
  display: flex
  justify-content: center
  align-items: center
  &__container
    display: flex
    width: 100%
    text-align: center
    transform: skewY(-10deg)
    background: $blue
    padding: 30px
    flex-direction: column
    h2
      font-size: 60px
    h3
      margin-top: 18px
      font-size: 12px
      opacity: 0.3
      text-transform: uppercase
      letter-spacing: 2px
      animation: flicker 1s alternate-reverse infinite
  @keyframes flicker
    from
      opacity: 0.3
    to
      opacity: 1
</style>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { PlayerTeam } from '@/store/modules/app'

@Component<SetupCharacterReadyOverlay>({})
export default class SetupCharacterReadyOverlay extends Vue {
  @Prop({ type: String, required: true }) readonly team!: PlayerTeam

  get heading () {
    console.log(this.team)
    return this.team === PlayerTeam.Old
      ? "C'est parti !" : "C'est ti-par"
  }
}
</script>
