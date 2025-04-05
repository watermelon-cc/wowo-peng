import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/store'
import { watch } from 'vue'

// 获取用户详细信息
export const fetchUserInfo = async (userId) => {
  try {
    const { data: profile, error } = await supabase
      .from('user_info')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return profile
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

// 监听 store 变化并更新用户信息
export const watchAndUpdateUserInfo = () => {
  const userStore = useAuthStore()
  
  // 监听 access_token 变化
  watch(
    () => userStore.access_token,
    async (newToken) => {
      if (newToken && userStore.auth_info?.id) {
        const userInfo = await fetchUserInfo(userStore.auth_info.id)
        if (userInfo) {
          userStore.setUserInfo(userInfo)
        }
      }
    },
    { immediate: true }
  )
} 