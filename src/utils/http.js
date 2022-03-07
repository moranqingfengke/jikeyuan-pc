import axios from 'axios'
// 获取token
import auth from '@/utils/auth.js'
// 路由
import router from '@/router'

const instance = axios.create({
  baseURL: 'http://geek.itheima.net/',
  timeout: 5000
})

// 请求拦截器加上token
instance.interceptors.request.use(config => {
  const token = auth.getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}, err => Promise.reject(err))

// 响应拦截器拦截失效token
instance.interceptors.response.use(res => res, err => {
  // 失效token
  if (err.response && err.response.status === 401) {
    auth.delToken()
    router.push('/login')
  }
  return Promise.reject(err)
})

export default instance
