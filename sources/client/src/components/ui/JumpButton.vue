<template>
  <img ref="jump" class="button button--jump" :class="{ active }" :src="require('@/assets/ui/jump.svg')" alt="">
</template>
<style lang="sass">
.button
  pointer-events: all
  position: absolute
  &--jump
    bottom: 40px
    right: 40px
    transition: opacity .15s
    opacity: 0.3
    &.active
      opacity: 0.8
</style>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component<JumpButton>({
  mounted (): void {
    if (this.$refs.jump) {
      this.$refs.jump.addEventListener('touchstart', this.onJumpButtonClick)
      this.$refs.jump.addEventListener('touchstart', this.onJumpTouchStart)
      this.$refs.jump.addEventListener('touchend', this.onJumpTouchEnd)
    }
  },
  beforeDestroy (): void {
    if (this.$refs.jump) {
      this.$refs.jump.removeEventListener('touchstart', this.onJumpButtonClick)
      this.$refs.jump.removeEventListener('touchstart', this.onJumpTouchStart)
      this.$refs.jump.removeEventListener('touchend', this.onJumpTouchEnd)
    }
  }
})
export default class JumpButton extends Vue {
  $refs!: {
    jump: HTMLButtonElement
  }
  public active: boolean = false

  public onJumpTouchStart () {
    this.active = true
  }

  public onJumpTouchEnd () {
    this.active = false
  }

  public onJumpButtonClick () {
    this.$emit('onJump')
  }
}
</script>
