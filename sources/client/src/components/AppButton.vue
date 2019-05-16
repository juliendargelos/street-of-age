<template>
  <span
    class="app-button"
    :class="{
      'app-button--primary': primary,
      'app-button--secondary': secondary,
      'app-button--block': block
    }"
    v-on="$listeners"
  >
    <div class="app-button__content">
      <slot />
    </div>

    <div class="app-button__border" />
  </span>
</template>

<style lang="sass">
.app-button
  display: inline-block
  position: relative
  cursor: pointer
  font-size: 14px

  &__content
    min-width: 100px
    padding: 15px
    text-align: center
    z-index: 2
    position: relative
    transform: translate(-4px, -4px)
    transition: .2s $easeOutQuart

  &__border
    width: 100%
    height: 100%
    top: 0
    left: 0
    display: block
    position: absolute
    border: 2px solid
    box-sizing: border-box

  &:hover &__content, &:active &__content
    transform: translate(0, 0)

  &--primary &__content
    background-color: $green
    color: $light-blue

  &--primary &__border
    border-color: $green

  &--secondary &__content
    background-color: $light-blue
    color: $green

  &--secondary &__border
    border-color: $white

  &--block
    display: block
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

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
  @Prop({ type: Boolean, default: false }) readonly block!: boolean
  @Prop({ type: [String, Object], default: null }) readonly to!: string | object

  goToLink () {
    this.to && this.$router.push(this.to)
  }
}
</script>
