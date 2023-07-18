import './assets/main.css'

import { createApp, Vue } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 将全局echarts对象挂载到Vue的原型对象上
// 别的组件中通过 this.$echarts 使用
Vue.prototype.$echarts = window.echarts

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
