import Vue from 'vue'
import App from './App.vue'
import router from './router'
// element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// axios
import http from '@/utils/http.js'

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.prototype.$http = http

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
