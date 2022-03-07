import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://geek.itheima.net/'
})

export default instance
