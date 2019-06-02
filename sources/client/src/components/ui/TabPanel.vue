<template>
  <div class="tab-panel" v-if="activeTabId === forTab">
    <slot></slot>
  </div>
</template>

<style lang="sass">

</style>
<script lang="ts">
import { Vue, Component, Inject, Prop } from 'vue-property-decorator'

@Component<TabPanel>({})
export default class TabPanel extends Vue {
  @Inject('activeTabId') readonly activeTabId!: string
  @Prop({ type: String, required: true }) readonly forTab!: string
}
</script>
