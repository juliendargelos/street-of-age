<template>
  <div class="room-setup-character">
    <AppNav>
      <BackButton/>
    </AppNav>
      <div class="room-setup-character__characters">
        <CharacterCard v-for="characterKind in playerTeamKinds[player.teamKind]"
                       :disabled="!player.characterKinds.includes(characterKind) && ready"
                       :player-character-kinds="player.characterKinds"
                       :class="{'local': player.characterKind === characterKind}"
                       v-on:character:add="onCharacterAdd"
                       :character-kind="characterKind"
                       v-on:character:remove="onCharacterRemove"
                       :key="characterKind"/>
      </div>
    <transition name="slide-fade" mode="out-in">
      <SetupCharacterReadyOverlay
        :team="player.team"
        v-if="ready"
        @close="onClose"
        @click="onValidate"/>
    </transition>
  </div>
</template>

<style lang="sass">
.room-setup-character
  height: 100%
  & .validate-button
    position: fixed
    top: 10px
    right: 10px
  &__characters
    display: flex
    width: 100%
    height: 100%
    justify-content: space-evenly
    align-items: center
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
import SetupCharacterReadyOverlay from '@/components/ui/SetupCharacterReadyOverlay.vue'

@Component<RoomSetupCharacter>({
  mounted () {
    if (!this.player.teamKind) {
      this.$router.replace({ name: 'room-setup-team', params: { id: this.room.id } })
    }
  },
  components: { SetupCharacterReadyOverlay, CharacterCard }
})
export default class RoomSetupCharacter extends Vue {
  public onCharacterAdd ({ character }: CharacterCardClickEvent): void {
    console.log('adding', character)
    if (this.player.teamKind !== character.team) {
      AppModule.changePlayerCharacterTeam(character.team)
      this.$socket.emit(CharacterEvents.CharacterChangeTeam, character.team)
    }
    AppModule.addPlayerCharacterKind(character.kind)
    this.$socket.emit(CharacterEvents.CharacterAddedKind, character.kind)
  }

  public onCharacterRemove ({ character }: CharacterCardClickEvent): void {
    console.log('removing', character)
    if (this.player.teamKind !== character.team) {
      AppModule.changePlayerCharacterTeam(character.team)
      this.$socket.emit(CharacterEvents.CharacterChangeTeam, character.team)
    }
    AppModule.removePlayerCharacterKind(character.kind)
    this.$socket.emit(CharacterEvents.CharacterRemovedKind, character.kind)
  }

  public onValidate (): void {
    this.$socket.emit(RoomEvents.RoomPlayerReady)
    this.$router.replace({ name: 'room-waiting', params: { id: this.room.id } })
  }

  public onClose (): void {
    AppModule.changePlayerCharacterReady(false)
    this.player.characterKinds.forEach(characterKind => {
      this.$socket.emit(CharacterEvents.CharacterRemovedKind, characterKind)
    })
    AppModule.clearPlayerCharacterKinds()
  }

  get ready (): boolean {
    return this.player.characterKinds.length === 3
  }
  get room (): RoomType {
    return RoomModule.rooms.find(r => r.id === this.$route.params.id)!
  }
  get player (): Player {
    return AppModule.player
  }
  get playerTeamKinds (): { [team: string]: string[] } {
    return PlayerTeamKinds
  }
}
</script>
