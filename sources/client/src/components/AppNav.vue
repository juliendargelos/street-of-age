<template>
  <div class="app-nav"
       :class="{
         'app-nav--top': position === 'top',
         'app-nav--bottom': position === 'bottom',
       }"
  >
    <slot></slot>
  </div>
</template>

<style lang="sass">
.app-nav
  position: fixed
  z-index: 10
  left: 20px
  display: flex
  &--top
    top: 20px
  &--bottom
    bottom: 20px
</style>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component<AppNav>({})
export default class AppNav extends Vue {
  @Prop({ type: String, default: 'top' }) readonly position!: string
}
</script>
