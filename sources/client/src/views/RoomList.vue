<template>
  <div class="room-list">
    <AppNav>
      <BackButton :to="{name: 'home'}"/>
    </AppNav>
    <AppPanel class="room-list__panel">
      <ul>
        <RoomListItem v-for="room in this.rooms" :key="`${room.id}`" :room="room"/>
      </ul>
    </AppPanel>
  </div>
</template>

<style lang="sass">
.room-list
  height: 100%
  display: flex
  justify-content: center
  align-items: center
  &__panel
    height: 80%
    width: 400px
    overflow-y: scroll
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import RoomListItem from '@/components/RoomListItem.vue'
import RoomModule from '@/store/modules/room'
import CharacterCard from '@/components/CharacterCard.vue'
import characters from '@/assets/characters'
@Component({
  components: {
    CharacterCard,
    RoomListItem
  }
})
export default class RoomList extends Vue {
  get characters () {
    return characters
  }
  get rooms () {
    return RoomModule.rooms
  }
}
</script>
