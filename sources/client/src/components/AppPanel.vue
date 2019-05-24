<template>
  <div class="app-panel">
    <div class="app-panel__header">
      <slot name="header"></slot>
    </div>
    <div class="app-panel__body">
      <slot/>
    </div>
  </div>
</template>

<style lang="sass">
  .app-panel
    background-color: transparentize($blue, 0.5)
    color: $white

    &__header, &__body
      padding: 20px

    &__body
      display: flex
      flex-direction: column

    &__header
      background: $pale-blue
      h1, h2, h3, h4, h5, h6
        margin: 0
        text-align: center

</style>
