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
  left: 0
  z-index: 10
  display: flex
  &--top
    top: 0
  &--bottom
    bottom: 0
</style>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component<AppNav>({})
export default class AppNav extends Vue {
  @Prop({ type: String, default: 'top' }) readonly position!: string
}
</script>
