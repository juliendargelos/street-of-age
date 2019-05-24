import Vue from 'vue'
// @ts-ignore
import VueSocketIO from 'vue-socket.io'
// @ts-ignore
import VueGlobalEvents from 'vue-global-events'
import { EventEmitter } from 'events'
import router from './router'
import store from './store'
import './registerServiceWorker'
import App from './App.vue'
import AppButton from './components/AppButton.vue'
import AppBlock from './components/AppBlock.vue'
import AppPanel from './components/AppPanel.vue'

export const Emitter = new EventEmitter()

Vue.config.productionTip = false

Vue.use(new VueSocketIO({
  debug: true,
  connection: process.env.VUE_APP_SOCKET_ENDPOINT,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}))

Vue.component('GlobalEvents', VueGlobalEvents)
Vue.component('AppBlock', AppBlock)
Vue.component('AppPanel', AppPanel)
Vue.component('AppButton', AppButton)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
