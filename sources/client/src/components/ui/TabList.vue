<template>
  <div class="tabs-list" :key="activeTabId">
    <slot></slot>
  </div>
</template>

<style lang="sass">

</style>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component<TabList>({
  mounted () {
    if (this.defaultTab) {
      this.activeTabId = this.defaultTab
    }
  },
  provide () {
    return Object.defineProperties({}, {
      activeTabId: { enumerable: true, get: () => this.activeTabId },
      changeTab: { enumerable: true, get: () => this.changeTab }
    })
  }
})
export default class TabList extends Vue {
    @Prop({ type: String, required: false, default: null }) defaultTab!: string
    public activeTabId: string = ''

    public changeTab (newId: string): void {
      this.activeTabId = newId
    }
}
</script>
