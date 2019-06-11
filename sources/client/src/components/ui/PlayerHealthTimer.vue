<template>
  <div class="player__health__timer">
    00:12
  </div>
</template>

<style lang="sass">
.player__health__timer
  position: absolute
  bottom: 0
  left: 0
  font-size: 12px
  color: $green
  text-shadow: 2px 2px 0 $violet
  font-family: "Dead Jim", sans-serif
  z-index: 2
</style>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component<PlayerHealthTimer>({})
export default class PlayerHealthTimer extends Vue {
}
</script>
