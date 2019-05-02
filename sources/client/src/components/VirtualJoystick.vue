<template>
  <div ref="joystick" class="virtual-joystick"></div>
</template>

<style lang="sass">
  .virtual-joystick
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    width: 100%
    height: 100%

</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import nipplejs, { EventData, JoystickManager, JoystickOutputData } from 'nipplejs'

@Component({
  mounted (): void {
    const self = (this as VirtualJoystick)
    self.joystick = nipplejs.create({
      lockX: true,
      zone: (this as VirtualJoystick).$refs.joystick,
      mode: 'static',
      position: { left: '50%', top: '50%' },
      color: 'red'
    })
    self.joystick.on('move', self.onJoystickMove)
    self.joystick.on('start', self.onJoystickStart)
    self.joystick.on('end', self.onJoystickEnd)
  },
  beforeDestroy (): void {
    const self = (this as VirtualJoystick)
    self.joystick.off('move', self.onJoystickMove)
    self.joystick.off('start', self.onJoystickStart)
    self.joystick.off('end', self.onJoystickEnd)
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
