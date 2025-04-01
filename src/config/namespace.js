// API 基础配置
export const API_CONFIG = {
  // 开发环境
  development: {
    baseURL: 'https://hnzdtwhttoyvyxdcmbnq.supabase.co',
    timeout: 10000
  },
  // 生产环境
  production: {
    baseURL: 'https://hnzdtwhttoyvyxdcmbnq.supabase.co',
    timeout: 10000
  }
}

// API 接口命名空间
export const API_NAMESPACE = {
  // 认证相关
  auth: {
    login: '/auth/v1/token',
    register: '/auth/v1/signup',
    logout: '/auth/v1/logout',
    refresh: '/auth/v1/token/refresh'
  },
  // 用户相关
  user: {
    profile: '/rest/v1/profiles',
    update: '/rest/v1/profiles'
  }
}

// 获取当前环境的配置
export const getApiConfig = () => {
  const env = import.meta.env.MODE
  return API_CONFIG[env] || API_CONFIG.development
} 