const MapView = () => import('@/views/map/MapView.vue')
const HomeView = () => import('@/views/home/HomeView.vue')
const AddPlaceView = () => import('@/views/home/AddPlaceView.vue')
const UserView = () => import('@/views/user/UserView.vue')
const MessageView = () => import('@/views/message/MessageView.vue')
const NameView = () => import('@/views/onboarding/NameView.vue')
const BirthdayView = () => import('@/views/onboarding/BirthdayView.vue')
const LanguageView = () => import('@/views/onboarding/LanguageView.vue')

import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: { name: 'home' },
    children: [
      {
        path: '/home',
        name: 'home',
        component: HomeView,
      },
      { path: '/add-place', name: 'add-place', component: AddPlaceView },
      { path: '/map', name: 'map', component: MapView },
      { path: '/user', name: 'user', component: UserView },
      { path: '/message', name: 'message', component: MessageView },
      { path: '/onboarding', name: 'nameReg', component: NameView },
      { path: '/onboarding', name: 'birthdayReg', component: BirthdayView },
      { path: '/onboarding', name: 'languageReg', component: LanguageView },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', redirect: '/' },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
