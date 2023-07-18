import './assets/main.css'

import { createApp, Vue } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 配置axios
import axios from 'axios'
// 请求基准路径配置
axios.defaults.baseURL = 'http://127.0.0.1:8888/api'
// 将axios挂载到Vue的原型对象上
// 别的组件中通过 this.$http 使用
Vue.prototype.$http = axios


// 将全局echarts对象挂载到Vue的原型对象上
// 别的组件中通过 this.$echarts 使用
Vue.prototype.$echarts = window.echarts


const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
