<template>
  <span
    class="app-button"
    :class="{
      'app-button--primary': primary,
      'app-button--secondary': secondary,
      'app-button--alternate': alternate,
      'app-button--neutral': neutral,
      'app-button--filled': filled,
      'app-button--block': block
    }"
    v-on="listeners"
  >
    <button :disabled="disabled" :type="type" class="app-button__content">
      <slot />
    </button>

  </span>
</template>

<style lang="sass">
.app-button
  display: inline-block
  position: relative
  min-width: 140px
  &--neutral
    min-width: unset

  &__content
    font-family: 'Dead Jim', sans-serif
    font-size: 18px
    letter-spacing: 1px
    min-width: 100px
    width: 100%
    padding: 12px 15px
    text-transform: uppercase
    text-align: center
    z-index: 2
    position: relative
    border-radius: 4px
    transform: skew(-12deg)
    transition: .2s $easeOutQuart
    &:disabled
      filter: grayscale(100%)
      opacity: 0.7
      &:hover
        cursor: not-allowed
    &:hover
      cursor: pointer

  &__border
    width: 100%
    height: 100%
    top: 0
    left: 0
    display: block
    position: absolute
    border: 2px solid
    box-sizing: border-box

  &--neutral &__content
    background-color: transparent
    border: none
    box-shadow: none
    transform: unset
    padding: 5px

  &:hover &__content, &:active &__content
    cursor: pointer
    background: $white
    color: $pale-blue
    border-color: $white
    box-shadow: none

  &--primary &__content
    background-color: transparent
    border: 2px solid $green
    box-shadow: 0 0 10px transparentize($green, 0.4), inset 0 0 5px transparentize($green, 0.4)

  &--primary.app-button--filled &__content
    background: $green
    &:hover, &:active
      background: $white
      color: $green

  &--secondary.app-button--filled &__content
    background: $pale-blue
    &:hover, &:active
      background: $white
      color: $pale-blue

  &--secondary &__content
    background-color: transparent
    border: 2px solid $pale-blue
    box-shadow: 0 0 10px transparentize($pale-blue, 0.4), inset 0 0 5px transparentize($pale-blue, 0.4)
    &--filled
      background: $pale-blue

  &--secondary.app-button--alternate &__content
    background: $white
    border-color: $white
    box-shadow: none
    color: $pale-blue

  &--block
    display: block
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { BUTTON_AUDIO_PATH, MENU_SFX_VOLUME } from '@/game/manager/AudioManager'

@Component<AppButton>({
  mounted () {
    this.goToLink = this.goToLink.bind(this)
    this.$el.addEventListener('click', this.goToLink)
  },

  beforeDestroy () {
    this.$el.removeEventListener('click', this.goToLink)
  }
})
export default class AppButton extends Vue {
  @Prop({ type: Boolean, default: false }) readonly primary!: boolean
  @Prop({ type: Boolean, default: false }) readonly secondary!: boolean
  @Prop({ type: Boolean, default: false }) readonly alternate!: boolean
  @Prop({ type: Boolean, default: false }) readonly neutral!: boolean
  @Prop({ type: Boolean, default: false }) readonly block!: boolean
  @Prop({ type: Boolean, default: false }) readonly filled!: boolean
  @Prop({ type: Boolean, default: false }) readonly disabled!: boolean
  @Prop({ type: String, default: 'submit' }) readonly type!: string
  @Prop({ type: [String, Object], default: null }) readonly to!: string | object

  goToLink () {
    this.to && this.$router.push(this.to)
  }

  get listeners () {
    return {
      ...this.$listeners,
      click: (e: MouseEvent) => {
        this.$listeners.click && (this.$listeners.click as Function)(e)
        const audio = new Audio(BUTTON_AUDIO_PATH)
        audio.volume = MENU_SFX_VOLUME
        audio.play()
      }
    }
  }
}
</script>
