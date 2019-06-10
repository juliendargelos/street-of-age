<template>
  <button :disabled="disabled" class="back__button" @click="onClick">Retour</button>
</template>

<style lang="sass">
.back__button
  font-family: "Dead Jim", sans-serif
  border: none
  outline: none
  background: $blue
  padding: 10px 10px
  position: relative
  &:disabled
    opacity: 0.5
    cursor: not-allowed
  &:before
    content: '< '
  &:after
    position: absolute
    content: ''
    width: 20px
    height: 100%
    background: inherit
    top: 0
    right: -19px
    clip-path: polygon(100% 0, 0 0, 0 100%)
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { RawLocation } from '@street-of-age/client/node_modules/vue-router'
import { BUTTON_AUDIO_PATH, MENU_SFX_VOLUME } from '@/game/manager/AudioManager'

@Component<BackButton>({})
export default class BackButton extends Vue {
  @Prop({ type: Boolean, default: false }) readonly disabled!: boolean
  @Prop({ type: Object, default: null }) readonly to!: RawLocation
  private onClick () {
    if (this.to) {
      this.$router.push(this.to)
    } else {
      this.$router.back()
    }
    const audio = new Audio(BUTTON_AUDIO_PATH)
    audio.volume = MENU_SFX_VOLUME
    audio.play()
  }
}
</script>
