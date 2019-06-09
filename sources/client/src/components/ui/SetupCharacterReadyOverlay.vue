<template>
  <div class="setup__character__ready__overlay" @click.self="$emit('close')">
    <h2 @click="$emit('click')" class="road-rage">{{ this.heading }}</h2>
  </div>
</template>

<style lang="sass">
.setup__character__ready__overlay
  position: fixed
  top: 0
  bottom: 0
  left: 0
  right: 0
  z-index: 1
  background: transparentize($black, 0.4)
  display: flex
  justify-content: center
  align-items: center
  h2
    font-size: 60px
    width: 100%
    text-align: center
    transform: skewY(-10deg)
    background: $blue
    padding: 15px
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
