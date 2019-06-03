<template>
  <div class="game-pause-ui">
    <nav>
      <Logo color="white" :width="140"/>
      <ul class="actions">
        <li @click="$emit('close')">Reprendre</li>
        <li>Quitter</li>
      </ul>
      <div class="remaining">
        04:43
      </div>
    </nav>
    <main>
      <TabList defaultTab="credits">
        <div class="tab-panel-tabs">
          <Tab class="tab-panel-tabs__title" id="settings">Paramètres</Tab>
          <Tab class="tab-panel-tabs__title" id="help">Aides</Tab>
          <Tab class="tab-panel-tabs__title" id="credits">Crédit</Tab>
        </div>
        <div class="tab-panel-view">
          <TabPanel forTab="settings">
            <h2>Contenu des paramètres</h2>
          </TabPanel>
          <TabPanel forTab="help">
            <h2>Contenu de l'aide</h2>
          </TabPanel>
          <TabPanel class="tab-panel-view--credits" forTab="credits">
            <p>Un projet réalisé par <em>Iris Mangin</em>, <em>Fany Thourain</em>, <em>Bastien Lepecheur</em>,
              <em>Julien Dargelos</em> et <em>Omar Jbara</em> dans le cadre de l'école Gobelins.</p>
            <small class="copyright">Tous droits resérvés, 2019</small>
          </TabPanel>
        </div>
      </TabList>
    </main>
  </div>
</template>

<style lang="sass">
.game-pause-ui
  position: relative
  display: flex
  z-index: 20
  background: transparentize($white, 0.7)
  width: 100%
  height: 100%
  pointer-events: all
  & p
    font-weight: 300
    font-size: 16px
    line-height: 24px
  & .copyright
    display: inline-block
    margin-top: 40px
  & em
    font-weight: 500
  & nav
    flex: 1
    background: transparentize($blue, 0.45)
    display: flex
    flex-direction: column
    padding: 0 30px
    clip-path: polygon(0 0, 100% 0, 70% 100%, 0% 100%)
    & .actions
      margin-top: 40px
      font-family: "Dead Jim", sans-serif
      font-size: 20px
      & li
        margin: 20px 0
        &:hover, &:active, &:focus
          cursor: pointer
          opacity: 0.8
        &:first-of-type
          margin-top: 0
        &:last-of-type
          margin-bottom: 0
    & .remaining
      margin-top: auto
      font-size: 20px
      padding-left: 35px
      padding-bottom: 30px
  & main
    flex: 2
    & .tabs-list
      height: 100%
      display: flex
      flex-direction: column
    & .tab-panel-tabs
      display: flex
      justify-content: space-evenly
      padding: 40px 20px 20px 20px
      &__title
        opacity: 0.3
        &.selected
          opacity: 1
        &:hover
          opacity: 1
          cursor: pointer
    & .tab-panel-view
      padding: 20px
      &--credits
        margin-top: 40px

</style>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Logo from '@/components/ui/icons/Logo.vue'
import TabList from '@/components/ui/TabList.vue'
import Tab from '@/components/ui/Tab.vue'
import TabPanel from '@/components/ui/TabPanel.vue'

  @Component({
    components: { TabPanel, Tab, TabList, Logo }
  })
export default class GamePauseUI extends Vue {
}
</script>
