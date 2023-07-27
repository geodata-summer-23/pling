const AdminView = () => import('@/views/admin/AdminView.vue')
const MapView = () => import('@/views/map/MapView.vue')
const HomeView = () => import('@/views/home/HomeView.vue')
const AddPlaceView = () => import('@/views/home/AddPlaceView.vue')
const EditPlaceView = () => import('@/views/home/EditPlaceView.vue')
const UserView = () => import('@/views/user/UserView.vue')
const NetworkView = () => import('@/views/network/NetworkView.vue')
const OnboardingView = () => import('@/views/onboarding/OnboardingView.vue')
const EventView = () => import('@/views/event/EventView.vue')
const RequestHelpView = () => import('@/views/help/RequestHelpView.vue')

import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'root', redirect: { name: 'home' } },
  { path: '/admin', name: 'admin', component: AdminView },
  { path: '/home', name: 'home', component: HomeView },
  { path: '/add-place', name: 'add-place', component: AddPlaceView },
  { path: '/edit-place', name: 'edit-place', component: EditPlaceView },
  { path: '/map', name: 'map', component: MapView },
  { path: '/user', name: 'user', component: UserView },
  { path: '/network', name: 'network', component: NetworkView },
  { path: '/onboarding', name: 'onboarding', component: OnboardingView },
  { path: '/event', name: 'event', component: EventView },
  { path: '/help', name: 'help', component: RequestHelpView },
  { path: '/:pathMatch(.*)*', name: 'not-found', redirect: '/' },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
