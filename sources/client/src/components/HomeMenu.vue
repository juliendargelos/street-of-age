<template>
  <div class="home-menu-view">
    <div class="home-menu">
      <AppButton
        class="home-menu__button"
        primary
        block
        :to="{ name: 'room-form' }"
      >
        Creer une partie
      </AppButton>
      <AppButton
        class="home-menu__button"
        secondary
        block
        :to="{ name: 'room-list' }"
      >
        Rejoindre une partie
      </AppButton>
    </div>
    <AppButton
      class="home-menu__button home-menu__button--debug"
      secondary
      block
      :to="{ name: 'debug-game' }"
    >
      Debug
    </AppButton>
  </div>
</template>

<style lang="sass">
.home-menu
  &__button
    margin:
      left: auto
      right: auto
    max-width: 200px
    &--debug.app-button
      position: absolute
      bottom: 20px
      right: 20px
    & .app-button__content
      height: 50px

    &:not(:last-of-type)
      margin-bottom: 20px
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class HomeMenu extends Vue {

}
</script>
