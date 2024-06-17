import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import './main.css'

import 'primevue/resources/themes/lara-light-purple/theme.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import 'prismjs/themes/prism-tomorrow.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {})
app.mount('#app')
