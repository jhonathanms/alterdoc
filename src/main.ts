import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import './main.css'

import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import 'prismjs/themes/prism-tomorrow.css'
import ConfirmationService from 'primevue/confirmationservice';


const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(PrimeVue)
app.use(ConfirmationService);

app.mount('#app')
