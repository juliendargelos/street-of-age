<template>
  <div class="room-list">
    <ul>
      <RoomListItem v-for="room in this.rooms" :key="room.id" :room="room"/>
    </ul>
  </div>
</template>

<style lang="sass">
.room

</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import RoomListItem from '@/components/RoomListItem.vue'
import RoomModule from '@/store/modules/room'
import CharacterCard from '@/components/CharacterCard.vue'
@Component({
  components: {
    CharacterCard,
    RoomListItem
  }
})
export default class RoomList extends Vue {
  get rooms () {
    return RoomModule.rooms
  }
}
</script>
