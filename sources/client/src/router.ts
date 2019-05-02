import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Room from '@/views/Room.vue'
import RoomForm from '@/views/RoomForm.vue'
import RoomList from '@/views/RoomList.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/rooms',
      name: 'room-list',
      component: RoomList
    },
    {
      path: '/rooms/new',
      name: 'room-form',
      component: RoomForm
    },
    {
      path: '/rooms/:id',
      name: 'room',
      component: Room
    }
  ]
})
