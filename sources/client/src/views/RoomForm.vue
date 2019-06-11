<template>
  <form class="room-form" @submit.prevent="onSubmit">
    <AppNav>
      <BackButton :to="{ name: 'home' }"/>
    </AppNav>
    <AppPanel class="room-form__content">
      <p class="label">Nom de la partie</p>
      <input type="text" required class="room-form__name" v-model="settings.name" placeholder="Entrez le nom de la partie"/>
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
      <div class="room-form__actions">
        <AppButton
          secondary
          alternate
          block
          type="submit">
          Suivant
        </AppButton>
      </div>

    </AppPanel>
  </form>
</template>

<style lang="sass">
  .room-form
    height: 100%
    display: flex
    p.label
      width: 80%
      margin: 0 auto 12px auto

    &__content
      width: 57%
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
      height: 14px
      line-height: 16px
      font-size: 16px
      &::placeholder
        color: rgba($white, .6)
        line-height: 14

    &__actions
      margin-top: 30px
      display: flex
      justify-content: space-evenly
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { RoomEvents } from '@street-of-age/shared/socket/events'
import { Room } from '@/@types'
import AppPicker from '@/components/AppPicker.vue'
import { RoomSettings } from '@street-of-age/shared/entities/room'
import AppModule from '@/store/modules/app'

  @Component({
    components: { AppPicker },
    sockets: {
      [RoomEvents.RoomJoined] (room: Room) {
        const { id } = room
        const local = room.players.find(p => p.id === AppModule.player.id)
        if (local) {
          AppModule.setPlayerCharacterColor(local.color)
        }
        this.$router.push({ name: 'room-setup-team', params: { id } })
      }
    }
  })
export default class RoomForm extends Vue {
    public settings: RoomSettings = { numberOfPlayers: 4, mapSize: 'medium', name: '' }

    public onBackClick () {
      this.$router.push({ name: 'home' })
    }

    public onSubmit = () => {
      if (this.settings.name === '') {
        return
      }
      this.$socket.emit(RoomEvents.RoomCreate, this.settings)
    }
}
</script>
