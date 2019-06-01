<template>
  <div class="app-panel">
    <div v-if="$slots['header']" class="app-panel__header">
      <slot name="header"></slot>
    </div>
    <div v-else class="app-panel__header--empty"></div>
    <div class="app-panel__body">
      <slot/>
    </div>
  </div>
</template>

<style lang="sass">
  .app-panel
    background: linear-gradient(180deg, $light-blue 6%, transparent 100%)

    &__header, &__body
      padding: 20px

    &__body
      display: flex
      flex-direction: column

    &__header
      background: $pale-blue
      &--empty
        padding: 3px
        position: sticky
        top: 0
        background: $pale-blue
      h1, h2, h3, h4, h5, h6
        margin: 0
        text-align: center

</style>
