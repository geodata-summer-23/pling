const MapView = () => import('@/views/map/MapView.vue')
const HomeView = () => import('@/views/home/HomeView.vue')
const AddPlaceView = () => import('@/views/home/AddPlaceView.vue')
const UserView = () => import('@/views/user/UserView.vue')
const MessageView = () => import('@/views/message/MessageView.vue')
const OnboardingView = () => import('@/views/onboarding/OnboardingView.vue')

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
      { path: '/onboarding', name: 'onboarding', component: OnboardingView },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', redirect: '/' },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
