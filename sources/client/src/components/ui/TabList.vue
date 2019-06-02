<template>
  <div class="tabs-list" :key="activeTabId">
    <slot></slot>
  </div>
</template>

<style lang="sass">

</style>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component<TabList>({
  provide () {
    return Object.defineProperties({}, {
      activeTabId: { enumerable: true, get: () => this.activeTabId },
      changeTab: { enumerable: true, get: () => this.changeTab }
    })
  }
})
export default class TabList extends Vue {
    public activeTabId: string = 'settings'

    public changeTab (newId: string): void {
      this.activeTabId = newId
    }
}
</script>
