<template>
  <li class="room-list-item">
    <span class="room-list-item__informations">
      <span class="room-list-item__informations__name">{{ this.room.settings.name }}</span>
      <span class="room-list-item__informations__players">
        {{ this.room.players.length }}/{{ this.room.settings.numberOfPlayers}} joueurs
      </span>
    </span>
    <span class="room-list-item__action" :class="{ disabled }">
      <router-link :to="disabled ? {} : { name: 'room-setup-team', params: { id: this.room.id }}">Rejoindre</router-link>
    </span>
  </li>
</template>

<style lang="sass">
.room-list-item
  display: flex
  background: transparentize($blueberry, 0.5)
  border-radius: 3px
  margin: 10px 0
  &:first-of-type
    margin-top: 0
  &:last-of-type
    margin-bottom: 0
  &__informations, &__action
    padding: 15px 20px
  &__informations
    flex: 1.8
    > span
      display: block
  &__action
    position: relative
    flex: 1.2
    display: flex
    justify-content: center
    align-items: center
    background: $pale-blue
    text-align: center
    &:hover, &:active, &:focus
      background: $white
      cursor: pointer
      & > a
        color: $pale-blue
    &.disabled
      cursor: not-allowed
      opacity: 0.2
      pointer-events: none
    &:before
      position: absolute
      content: ''
      background: inherit
      width: 20px
      height: 100%
      left: -19px
      top: 0
      clip-path: polygon(100% 0, 0% 100%, 100% 100%)
    & > a
      text-transform: uppercase
      text-decoration: none
      font-family: 'Dead Jim', sans-serif
      font-weight: 300
      letter-spacing: 1px
      font-size: 16px
      vertical-align: sub

</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Room } from '@/@types'

@Component
export default class RoomListItem extends Vue {
  @Prop(Object) readonly room!: Room

  get disabled () {
    return this.room.players && this.room.players.length === this.room.settings.numberOfPlayers
  }
}
</script>
