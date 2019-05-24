<template>
  <form class="room-form" @submit.prevent="onSubmit">
    <AppPanel class="room-form__content">
      <template slot="header"><h2>Configuration de la partie</h2></template>
      <input class="room-form__name" v-model="settings.name" placeholder="Entrez le nom de la partie"/>
      <AppPicker
        label="Nombre de joueurs"
        v-model="settings.numberOfPlayers"
        class="room-form__number"
        :choices="[{ value: 2, label: 2 }, { value: 4, label: 4 }, { value: 6, label: 6 }]"/>
      <AppPicker
        label="Taille de la map"
        v-model="settings.mapSize"
        class="room-form__mapsize"
        :choices="[{ value: 'small', label: 'Petite'}, { value: 'medium', label: 'Moyenne'}, { value: 'large', label: 'Grande'}]"/>
      <button type="submit">
        Create room
      </button>
    </AppPanel>
  </form>
</template>

<style lang="sass">
  .room-form
    height: 100%
    display: flex

    &__content
      width: 80%
      max-width: 400px
      margin: auto

    &__number
      align-self: center
      width: 80%

    &__mapsize
      align-self: center
      width: 80%

    &__name
      align-self: center
      width: 70%

      &::placeholder
        color: rgba($white, .6)
</style>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {RoomEvents} from '@street-of-age/shared/socket/events'
  import {Room, RoomSettings} from '@/@types'
  import AppPicker from '@/components/AppPicker.vue'

  @Component({
    components: {AppPicker},
    sockets: {
      [RoomEvents.RoomJoined](room: Room) {
        const {id} = room
        this.$router.push({name: 'room', params: {id}})
      }
    }
  })
  export default class RoomForm extends Vue {
    public settings: RoomSettings = {numberOfPlayers: 4, mapSize: 'medium', name: ''}

    public onSubmit = () => {
      this.$socket.emit(RoomEvents.RoomCreate)
    }
  }
</script>
