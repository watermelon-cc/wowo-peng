import request from '../utils/request'
import { API_NAMESPACE } from '../config/namespace'

// 认证相关 API
export const authApi = {
  // 登录
  login(data) {
    return request.post(API_NAMESPACE.auth.login, data)
  },
  
  // 注册
  register(data) {
    return request.post(API_NAMESPACE.auth.register, data)
  },
  
  // 登出
  logout() {
    return request.post(API_NAMESPACE.auth.logout)
  },
  
  // 刷新 token
  refreshToken(data) {
    return request.post(API_NAMESPACE.auth.refresh, data)
  }
}

// 用户相关 API
export const userApi = {
  // 获取用户信息
  getProfile() {
    return request.get(API_NAMESPACE.user.profile)
  },
  
  // 更新用户信息
  updateProfile(data) {
    return request.put(API_NAMESPACE.user.update, data)
  }
}

// 导出所有 API
export default {
  auth: authApi,
  user: userApi
} 