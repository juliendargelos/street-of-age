<template>
  <div class="room-setup-character">
      <h1>room setup character</h1>
      <div class="room-setup-character__characters">
        <CharacterCard v-for="characterKind in playerTeamKinds[player.character.team]"
                       @click="onCharacterChange"
                       :character-kind="characterKind"
                       :key="characterKind"/>
      </div>
  </div>
</template>

<style lang="sass">
.room-setup-character
  height: 100%
  &__characters
    display: flex
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { CharacterCardClickEvent, Player, Room as RoomType } from '@/@types'
import RoomModule from '@/store/modules/room'
import AppModule from '@/store/modules/app'
import { PlayerTeamKinds } from '@/game/entities/player'
import CharacterCard from '@/components/CharacterCard.vue'
import { CharacterEvents } from '@street-of-age/shared/socket/events'

@Component<RoomSetupCharacter>({
  components: { CharacterCard }
})
export default class RoomSetupCharacter extends Vue {
  private onCharacterChange ({ character }: CharacterCardClickEvent): void {
    console.log('selecting', character)
    AppModule.changePlayerCharacterKind(character.kind)
    this.$socket.emit(CharacterEvents.CharacterChangeKind, character.kind)
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
