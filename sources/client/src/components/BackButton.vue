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

@Component<BackButton>({})
export default class BackButton extends Vue {
  @Prop({ type: Boolean, default: false }) readonly disabled!: boolean
  private onClick () {
    this.$router.back()
  }
}
</script>
