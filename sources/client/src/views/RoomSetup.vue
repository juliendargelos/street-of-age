<template>
  <div class="room-setup">
    <router-view/>
  </div>
</template>

<style lang="sass">
.room
  height: 100%
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Room as RoomType } from '@/@types'
import RoomModule from '@/store/modules/room'

@Component<RoomSetup>({})
export default class RoomSetup extends Vue {
  get room (): RoomType {
    return RoomModule.rooms.find(r => r.id === this.$route.params.id)!
  }
}
</script>
