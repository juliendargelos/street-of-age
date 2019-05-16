<template>
  <div class="home-menu">
    <AppBlock>
      <AppButton
        class="home-menu__button"
        primary
        block
        :to="{ name: 'room-form' }"
      >
        Create game
      </AppButton>
      <AppButton
        class="home-menu__button"
        secondary
        block
        :to="{ name: 'room-list' }"
      >
        Join game
      </AppButton>
      <AppButton
        class="home-menu__button"
        secondary
        block
        :to="{ name: 'debug-game' }"
      >
        Debug
      </AppButton>
    </AppBlock>
  </div>
</template>

<style lang="sass">
.home-menu
  &__button
    margin:
      left: auto
      right: auto
    max-width: 200px

    &:not(:last-of-type)
      margin-bottom: 20px
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class HomeMenu extends Vue {

}
</script>
