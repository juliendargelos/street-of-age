<template>
  <router-link :to="{name: 'room', params: { id: this.room.id }}">
    <li class="room-list-item">
      {{ this.room.id }} ({{ this.room.players.length }})
    </li>
  </router-link>
</template>

<style lang="sass">
  .room-list-item

</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Room } from '@/@types'

@Component
export default class RoomListItem extends Vue {
  @Prop(Object) readonly room!: Room
}
</script>
