<template>
  <div class="room-setup-team">
      <h1>room setup team</h1>
    <AppPicker
      label="Votre équipe"
      lazy
      :value="this.team"
      @input="changePlayerCharacterTeam"
      class="room-setup-team__field"
      :choices="[{ value: 'old', label: 'Vieux' }, { value: 'young', label: 'Jeunes' }]"/>

  </div>
</template>

<style lang="sass">
.room
  height: 100%
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import RoomTeam from '@/components/RoomTeam.vue'
import RoomCharacter from '@/components/RoomCharacter.vue'
import RoomLobby from '@/components/RoomLobby.vue'
import RoomGame from '@/components/RoomGame.vue'
import RoomScore from '@/components/RoomScore.vue'
import { Room as RoomType } from '@/@types'
import RoomModule from '@/store/modules/room'
import AppModule, { PlayerTeam } from '@/store/modules/app'
import AppPicker from '@/components/AppPicker.vue'
import { CharacterEvents } from '@street-of-age/shared/socket/events'

@Component<RoomSetupTeam>({
  methods: {
    changePlayerCharacterTeam (team: PlayerTeam) {
      AppModule.changePlayerCharacterTeam(team)
      this.$socket.emit(CharacterEvents.CharacterChangeTeam, team)
      this.$router.push({ name: 'room-setup-character', params: { id: this.room.id } })
    }
  },
  components: {
    RoomTeam,
    AppPicker,
    RoomCharacter,
    RoomLobby,
    RoomGame,
    RoomScore
  }
})
export default class RoomSetupTeam extends Vue {
  get room (): RoomType {
    return RoomModule.rooms.find(r => r.id === this.$route.params.id)!
  }

  get team (): PlayerTeam {
    return AppModule.player.team
  }
}
</script>
