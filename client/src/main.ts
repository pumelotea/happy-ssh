import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import http from '@/apis'
import components from './components'
import 'animate.css'
import 'xterm/css/xterm.css'
import elementPlus from 'element-plus';
import '../public/theme/light/default.css'
import 'nprogress/nprogress.css'
const app = createApp(App)
app.use(router)
app.use(http)
app.use(store)
app.use(elementPlus)
//全局组件
app.use(components)


app.mount('#app')
