import Vue from 'vue'
import VueRouter from 'vue-router'
// 登陆
import Login from '@/views/Login.vue'
// token
import auth from '@/utils/auth.js'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 获取token
  const token = auth.getToken()
  if (to.path !== '/login' && !token) return next('/login')
  next()
})

export default router
