<template>
  <form class="room-form" @submit.prevent="onSubmit">
    <AppBlock class="room-form__content">
      <input class="room-form__name" v-model="name" placeholder="Name" />
      <input class="room-form__number" type="number" step="2" min="2" max="6" v-model.number="numberOfPlayers">

      <button type="submit">
        Create room
      </button>
    </AppBlock>
  </form>
</template>

<style lang="sass">
.room-form
  height: 100%
  display: flex

  &__content
    width: 90%
    max-width: 400px
    margin: auto

  &__number
    margin: 20px auto 20px auto
    display: block

  &__name
    background-color: transparent
    width: 100%
    appearance: none
    border: none
    margin: 0
    display: block
    font-size: 25px
    color: $white
    text-align: center
    outline: none

    &::placeholder
      color: rgba($white, .4)
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
  public name: string = ''

  public onSubmit = () => {
    this.$socket.emit(RoomEvents.RoomCreate)
  }
}
</script>
