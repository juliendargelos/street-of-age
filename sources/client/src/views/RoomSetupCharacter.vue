<template>
  <div class="room-setup-character">
    <AppNav>
      <BackButton/>
    </AppNav>
      <div class="room-setup-character__characters">
        <CharacterCard v-for="characterKind in playerTeamKinds[player.team]"
                       @click="onCharacterChange"
                       :class="{'local': player.characterKind === characterKind}"
                       :disabled="room.players.some(player => player.characterKind === characterKind)"
                       :character-kind="characterKind"
                       :key="characterKind"/>
      </div>
    <AppButton
      secondary
      @click="onValidate"
      block>
      Valider
    </AppButton>
  </div>
</template>

<style lang="sass">
.room-setup-character
  height: 100%
  &__characters
    display: flex
    & .character-card.local
      box-shadow: 0 0 30px white
      z-index: 1
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { CharacterCardClickEvent, Player, Room as RoomType } from '@/@types'
import RoomModule from '@/store/modules/room'
import AppModule from '@/store/modules/app'
import { PlayerTeamKinds } from '@/game/entities/player'
import CharacterCard from '@/components/CharacterCard.vue'
import { CharacterEvents, RoomEvents } from '@street-of-age/shared/socket/events'

@Component<RoomSetupCharacter>({
  mounted () {
    if (!this.player.team) {
      this.$router.replace({ name: 'room-setup-team', params: { id: this.room.id } })
    } else {
      const availableKinds = this.playerTeamKinds[this.player.team]
        .filter(kind => !this.room.players.map(p => p.characterKind).includes(kind))
      const characterKind = availableKinds[Math.floor(Math.random() * availableKinds.length)]
      AppModule.changePlayerCharacterKind(characterKind)
      this.$socket.emit(CharacterEvents.CharacterChangeKind, characterKind)
      AppModule.changePlayerCharacterReady(false)
      this.$socket.emit(CharacterEvents.CharacterChangeReady, false)
    }
  },
  components: { CharacterCard }
})
export default class RoomSetupCharacter extends Vue {
  private onCharacterChange ({ character }: CharacterCardClickEvent): void {
    console.log('selecting', character)
    if (this.player.team !== character.team) {
      AppModule.changePlayerCharacterTeam(character.team)
      this.$socket.emit(CharacterEvents.CharacterChangeTeam, character.team)
    }
    AppModule.changePlayerCharacterKind(character.kind)
    this.$socket.emit(CharacterEvents.CharacterChangeKind, character.kind)
  }

  private onValidate (): void {
    this.$socket.emit(RoomEvents.RoomPlayerReady)
    this.$router.replace({ name: 'room-waiting', params: { id: this.room.id } })
  }
  get room (): RoomType {
    return RoomModule.rooms.find(r => r.id === this.$route.params.id)!
  }
  get player (): Player {
    return AppModule.player
  }
  get playerTeamKinds () {
    return PlayerTeamKinds
  }
}
</script>
