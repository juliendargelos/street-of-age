<template>
  <div class="debug-game">
    <RoomGame :players="[]"/>
  </div>
</template>

<style lang="sass">
.debug-game
  height: 100%
  position: relative

  &__renderer
    height: 100%
  canvas
    position: fixed
    top: 0
    bottom: 0
    right: 0
    left: 0
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import RoomTeam from '@/components/RoomTeam.vue'
import RoomCharacter from '@/components/RoomCharacter.vue'
import RoomLobby from '@/components/RoomLobby.vue'
import RoomGame from '@/components/RoomGame.vue'
import RoomScore from '@/components/RoomScore.vue'

@Component<DebugGame>({
  components: {
    RoomTeam,
    RoomCharacter,
    RoomLobby,
    RoomGame,
    RoomScore
  }
})
export default class DebugGame extends Vue {
}
</script>
