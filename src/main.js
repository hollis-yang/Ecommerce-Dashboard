// 引入全局less
import './assets/css/global.less'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 配置axios
import axios from 'axios'
// 请求基准路径配置
axios.defaults.baseURL = 'http://127.0.0.1:8888/api'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 将axios挂载到Vue的原型对象上
// 别的组件中通过 this.$http 使用
app.config.globalProperties.$http = axios

app.mount('#app')
