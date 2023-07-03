import { createRouter, createWebHashHistory } from 'vue-router'
import MapView from '@/views/map/MapView.vue'
import PlacesView from '@/views/places/PlacesView.vue'
import UserView from '@/views/user/UserView.vue'

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: { name: 'map' },
    children: [
      { path: '/places', name: 'places', component: PlacesView },
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
