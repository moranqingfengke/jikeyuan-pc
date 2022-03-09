import Vue from 'vue'
import App from './App.vue'
import router from './router'
// element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// axios
import http from '@/utils/http.js'
// 注册全局组件
import MyChannel from '@/components/MyChannel.vue'

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.prototype.$http = http

Vue.component(MyChannel.name, MyChannel)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
