
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import 'element-plus/dist/index.css'
import './style.scss'

const app = createApp(App)
app.use(router)
app.mount('#app')
