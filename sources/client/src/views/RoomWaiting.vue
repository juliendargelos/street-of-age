<template>
  <div class="room-waiting">
      <h1>En attente des autres joueurs</h1>
  </div>
</template>

<style lang="sass">
.room-waiting
  height: 100%
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Room as RoomType } from '@/@types'
import RoomModule from '@/store/modules/room'

@Component<RoomWaiting>({})
export default class RoomWaiting extends Vue {
  get room (): RoomType {
    return RoomModule.rooms.find(r => r.id === this.$route.params.id)!
  }
}
</script>
