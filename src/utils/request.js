import axios from 'axios'
import { getApiConfig } from '../config/namespace'
import { useAuthStore } from '../stores/store'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const service = axios.create({
  ...getApiConfig(),
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const userStore = useAuthStore()
    // 如果有 token，添加到请求头
    if (userStore.access_token) {
      config.headers['Authorization'] = `Bearer ${userStore.access_token}`
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    return res
  },
  error => {
    console.error('响应错误:', error)
    
    // 处理错误响应
    const message = error.response?.data?.message || error.message || '请求失败'
    
    // 根据错误状态码处理
    switch (error.response?.status) {
      case 401:
        // 未授权，清除用户信息并跳转到登录页
        const userStore = useAuthStore()
        userStore.logout()
        window.location.href = '/login'
        break
      case 403:
        ElMessage.error('没有权限访问')
        break
      case 404:
        ElMessage.error('请求的资源不存在')
        break
      case 500:
        ElMessage.error('服务器错误')
        break
      default:
        ElMessage.error(message)
    }
    
    return Promise.reject(error)
  }
)

// 封装请求方法
export const request = {
  get(url, params) {
    return service.get(url, { params })
  },
  
  post(url, data) {
    return service.post(url, data)
  },
  
  put(url, data) {
    return service.put(url, data)
  },
  
  delete(url, params) {
    return service.delete(url, { params })
  },
  
  patch(url, data) {
    return service.patch(url, data)
  }
}

export default request 