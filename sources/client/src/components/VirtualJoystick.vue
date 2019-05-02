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
  .nipple
    pointer-events: all
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import nipplejs, { EventData, JoystickManager, JoystickOutputData } from 'nipplejs'

@Component<VirtualJoystick>({
  mounted (): void {
    this.joystick = nipplejs.create({
      lockX: true,
      zone: this.$refs.joystick,
      mode: 'static',
      position: { left: '50%', top: '50%' },
      color: 'red'
    })
    this.joystick.on('move', this.onJoystickMove)
    this.joystick.on('start', this.onJoystickStart)
    this.joystick.on('end', this.onJoystickEnd)
  },
  beforeDestroy (): void {
    this.joystick.off('move', this.onJoystickMove)
    this.joystick.off('start', this.onJoystickStart)
    this.joystick.off('end', this.onJoystickEnd)
  }
})
export default class VirtualJoystick extends Vue {
    private joystick!: JoystickManager
    $refs!: {
      joystick: HTMLDivElement
    }

    private onJoystickMove (evt: EventData, data: JoystickOutputData) {
      if (data && data.direction && data.distance) {
        const delta = (data.direction.x === 'right'
          ? data.distance
          : -data.distance) / 10
        this.$emit('move', delta)
      }
    }

    private onJoystickStart (evt: EventData, data: JoystickOutputData) {
      this.$emit('start')
    }

    private onJoystickEnd (evt: EventData, data: JoystickOutputData) {
      this.$emit('end')
    }
}
</script>
