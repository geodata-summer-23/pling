import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import { createPinia } from 'pinia'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { registerIcons } from './icons'

const app = createApp(App)
  .use(createPinia())
  .use(router)
  .component('fa-icon', FontAwesomeIcon)

registerIcons()

app.mount('#app')
