<template>
  <form class="room-form" @submit.prevent="onSubmit">
    <input type="number" step="2" min="2" max="6" v-model.number="numberOfPlayers">
    <button type="submit">Create room</button>
  </form>
</template>

<style lang="sass">
.room

</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { RoomEvents } from '@street-of-age/shared/socket/events'
import { Room } from '@/@types'

@Component({
  sockets: {
    [RoomEvents.RoomJoined] (room: Room) {
      const { id } = room
      this.$router.push({ name: 'room', params: { id } })
    }
  }
})
export default class RoomForm extends Vue {
  public numberOfPlayers: number = 2

  public onSubmit = () => {
    this.$socket.emit(RoomEvents.RoomCreate)
  }
}
</script>
