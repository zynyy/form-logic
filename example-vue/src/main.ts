import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'
import {listLayoutPlugin} from '@formlogic/render-vue'



const app = createApp(App)

app.use(router).use(listLayoutPlugin)

app.mount('#app')
