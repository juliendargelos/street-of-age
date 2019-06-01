<template>
  <div class="app-nav">
    <slot></slot>
  </div>
</template>

<style lang="sass">
.app-nav
  position: fixed
  z-index: 10
  top: 20px
  left: 20px
  display: flex
</style>
