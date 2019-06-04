<template>
  <div class="room-setup-team">
    <div class="team__block team__block--old">
      <div class="team__picker">
        <h2 class="team__picker__title">Choisi</h2>
        <AppButton :disabled="disabledTeams.includes('old')" secondary alternate block class="team__picker__button" @click="chooseTeam('old')">Les anciens</AppButton>
      </div>
    </div>
    <div class="team__block team__block--young">
      <div class="team__picker">
        <h2 class="team__picker__title">Choisi</h2>
        <AppButton :disabled="disabledTeams.includes('young')" secondary alternate block class="team__picker__button" @click="chooseTeam('young')">Les jeunes</AppButton>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.room-setup-team
  height: 100%
  display: flex
  justify-content: center
  background: url(~@/assets/team.png) no-repeat center center / cover
  & .team__block
    flex: 1
    position: relative
    & .team__picker
      position: absolute
      bottom: 33px
      &__title
        font-family: 'Dead Jim', sans-serif
        text-align: center
        margin-bottom: 6px
      &__button .app-button__content
        font-size: 24px
        min-width: unset
        width: 260px
    &--young .team__picker
      right: 0
      &__button
        position: relative
        right: -8px
    &--old .team__picker
      left: 0
      &__button
        position: relative
        left: -8px
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
    mounted () {
      AppModule.changePlayerCharacterTeam(null)
      this.$socket.emit(CharacterEvents.CharacterChangeTeam, null)
      AppModule.clearPlayerCharacterKinds()
      this.$socket.emit(CharacterEvents.CharacterClearedKinds)
      AppModule.changePlayerCharacterReady(false)
      this.$socket.emit(CharacterEvents.CharacterChangeReady, false)
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
  public chooseTeam (team: PlayerTeam) {
    AppModule.changePlayerCharacterTeam(team)
    this.$socket.emit(CharacterEvents.CharacterChangeTeam, team)
    this.$router.push({ name: 'room-setup-character', params: { id: this.room.id } })
  }
  get room (): RoomType {
    return RoomModule.rooms.find(r => r.id === this.$route.params.id)!
  }

  get disabledTeams (): PlayerTeam[] {
    return Array.from(this.room.players.reduce((acc) => {
      const teams = [PlayerTeam.Old, PlayerTeam.Young]
      teams.forEach(team => {
        if (this.room.players.filter(player => player.team === team).length === this.room.settings.numberOfPlayers / 2) {
          acc.add(team)
        }
      })
      return acc
    }, new Set<PlayerTeam>([])))
  }

  get team (): PlayerTeam | string | null {
    return AppModule.player.team
  }
}
</script>
