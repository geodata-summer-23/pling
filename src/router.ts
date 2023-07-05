const MapView = () => import('@/views/map/MapView.vue')
const PlacesView = () => import('@/views/places/PlacesView.vue')
const AddPlaceView = () => import('@/views/places/AddPlaceView.vue')
const UserView = () => import('@/views/user/UserView.vue')
const NameView = () => import('@/views/onboarding/NameView.vue')
const BirthdayView = () => import('@/views/onboarding/BirthdayView.vue')
const LanguageView = () => import('@/views/onboarding/LanguageView.vue')

import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: { name: 'map' },
    children: [
      {
        path: '/places',
        name: 'places',
        component: PlacesView,
      },
      { path: '/add-place', name: 'add-place', component: AddPlaceView },
      { path: '/map', name: 'map', component: MapView },
      { path: '/user', name: 'user', component: UserView },
      { path: '/onboarding', name: 'nameReg', component: NameView},
      { path: '/onboarding', name: 'birthdayReg', component: BirthdayView},
      { path: '/onboarding', name: 'languageReg', component: LanguageView}
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', redirect: '/' },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
