import Vue from 'vue'
import VueRouter from 'vue-router'
// 登陆
import Login from '@/views/Login.vue'
// token
import auth from '@/utils/auth.js'
// 主页布局
import Layout from '@/views/Layout.vue'
// 数据概览
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login },
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home }
    ]
  }
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
