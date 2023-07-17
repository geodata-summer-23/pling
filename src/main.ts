import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import { createPinia } from 'pinia'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { registerIcons } from './icons'

const app = createApp(App)
  .use(router)
  .use(createPinia())
  .component('fa-icon', FontAwesomeIcon)

registerIcons()

app.mount('#app')

export const serverUrl = 'https://varselserver-1-i2815530.deta.app'
