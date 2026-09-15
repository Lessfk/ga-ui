import { createApp } from 'vue'
import {
  ID_INJECTION_KEY,
  ZINDEX_INJECTION_KEY,
} from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import './styles/index.css'

const app = createApp(App)

app.provide(ID_INJECTION_KEY, { prefix: 1024, current: 0 })
app.provide(ZINDEX_INJECTION_KEY, { current: 0 })
app.mount('#app')
