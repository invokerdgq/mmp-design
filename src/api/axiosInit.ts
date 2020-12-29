import axios from 'axios'
import Vue from 'vue'

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : 'http://xxx.xxx.xxx',
  timeout: 3000
})

instance.interceptors.request.use((requestConfig) => {
  // 请求拦截
  return requestConfig
})

instance.interceptors.response.use((response) => {
  // 对于200 状态码 处理
  if (response.data.error) {
    Vue.prototype.$message({
      type: 'error',
      message: response.data.error
    })
    return Promise.reject(response.data.error)
  }
  return response.data
}, (error) => {
  if (error.response) {
    // 全局错误统一处理
    Vue.prototype.$message({
      showClose: true,
      type: 'error',
      message: `${error.response.status} ${error.response.data.error}`
    })
    return Promise.reject(error.response)
  }
  return Promise.reject(error)
})

export default instance
