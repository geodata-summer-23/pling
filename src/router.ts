import { createRouter, createWebHistory } from 'vue-router'
import MapView from '@/views/map/MapView.vue'
import SettingsView from '@/views/settings/SettingsView.vue'

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: { name: 'map' },
    children: [
      { path: '/map', name: 'map', component: MapView },
      { path: '/settings', name: 'settings', component: SettingsView },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', redirect: '/' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
