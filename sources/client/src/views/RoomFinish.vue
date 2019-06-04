<template>
  <div class="room-finish">
    <h1 class="road-rage">Victoire</h1>
    <div class="duration">04:43</div>
  </div>
</template>

<style lang="sass">
.room-finish
  height: 100%
  h1
    margin: 20px
    font-size: 40px
    text-align: center
  .duration
    background: linear-gradient(90deg, transparent 0%, transparent 33%, $grey 50%, transparent 67%, transparent 100%)
    text-align: center
    padding: 2px 0
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component<RoomFinish>({})
export default class RoomFinish extends Vue {
}
</script>
