import { createRouter, createWebHashHistory } from 'vue-router'
import MapView from '@/views/map/MapView.vue'
import AddressesView from '@/views/addresses/AddressesView.vue'
import UserView from '@/views/user/UserView.vue'

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: { name: 'map' },
    children: [
      { path: '/addresses', name: 'addresses', component: AddressesView },
      { path: '/map', name: 'map', component: MapView },
      { path: '/user', name: 'user', component: UserView },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', redirect: '/' },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
