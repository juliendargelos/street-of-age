<template>
  <div ref="joystick" class="virtual-joystick"></div>
</template>

<style lang="sass">
.virtual-joystick
  position: fixed
  pointer-events: none
  left: 0
  top: 0
  right: 0
  bottom: 0
  width: 100%
  height: 100%
  z-index: 10
  opacity: 0
  .nipple
    pointer-events: all
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import InputManager, { JoystickMoveEvent } from '@/game/manager/InputManager'

@Component<VirtualJoystick>({
  mounted (): void {
    InputManager.attachElement(this.$refs.joystick)
    InputManager.addEventListener('start', this.onJoystickStart)
    InputManager.addEventListener('end', this.onJoystickEnd)
    InputManager.addEventListener('move', this.onJoystickMove)
  },
  beforeDestroy (): void {
    InputManager.removeEventListener('move', this.onJoystickMove)
    InputManager.removeEventListener('start', this.onJoystickStart)
    InputManager.removeEventListener('end', this.onJoystickEnd)
    InputManager.detachElement()
  }
})
export default class VirtualJoystick extends Vue {
    $refs!: {
      joystick: HTMLDivElement
    }

    private onJoystickMove (evt: JoystickMoveEvent) {
      this.$emit('move', evt.detail.delta)
    }

    private onJoystickStart () {
      this.$emit('start')
    }

    private onJoystickEnd () {
      this.$emit('end')
    }
}
</script>
