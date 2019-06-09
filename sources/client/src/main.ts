import 'array-flat-polyfill'
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
import BackButton from './components/BackButton.vue'
import AppNav from './components/AppNav.vue'
import AppPanel from './components/AppPanel.vue'

export const Emitter = new EventEmitter()

Vue.config.productionTip = false

const vueSocketIO = new VueSocketIO({
  debug: process.env.NODE_ENV !== 'production',
  connection: process.env.VUE_APP_SOCKET_ENDPOINT,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
})

// Vue.prototype.$io = vueSocketIO.io
Vue.use(vueSocketIO)

Vue.component('GlobalEvents', VueGlobalEvents)
Vue.component('AppNav', AppNav)
Vue.component('BackButton', BackButton)
Vue.component('AppBlock', AppBlock)
Vue.component('AppPanel', AppPanel)
Vue.component('AppButton', AppButton)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
