import axios from 'axios'
import Vue from 'vue'

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : '/',
  timeout: 3000
})

instance.interceptors.request.use((requsetConfig) => {
  // 请求拦截
  return requsetConfig
})

instance.interceptors.response.use((response) => {
  // 对于200 状态码 处理
  if (response.data.errors) {
    const err = response.data.errors
    if (Array.isArray(err) && err.length > 0) {
      let errMsg = ''
      err.forEach(item => {
        errMsg += item.message
      })
      Vue.prototype.$message({
        type: 'error',
        message: errMsg,
        showClose: true
      })
    } else {
      Vue.prototype.$message({
        type: 'error',
        message: '未知错误,稍后重试',
        showClose: true
      })
    }
    return Promise.reject(response.data.errors)
  }
  return response.data
}, (error) => {
  if (error.response) {
    // 全局错误统一处理
    Vue.prototype.$message({
      showClose: true,
      type: 'error',
      message: `${error.response.data.status} ${error.response.data.error}  ${error.response.data.message}`
    })
    return Promise.reject(error.response)
  }
  return Promise.reject(error)
})

export default instance
