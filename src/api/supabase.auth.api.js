import { supabase } from '@/lib/supabase'

/**
 * 用户注册
 * @param {string} email - 用户邮箱
 * @param {string} password - 用户密码
 * @returns {Promise<Object>} 注册结果
 */
export const signUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`
      }
    })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('注册失败:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 用户登录
 * @param {string} email - 用户邮箱
 * @param {string} password - 用户密码
 * @returns {Promise<Object>} 登录结果
 */
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('登录失败:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 用户登出
 * @returns {Promise<Object>} 登出结果
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('登出失败:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 获取当前会话
 * @returns {Promise<Object>} 会话信息
 */
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return { success: true, session }
  } catch (error) {
    console.error('获取会话失败:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 获取当前用户
 * @returns {Promise<Object>} 用户信息
 */
export const getUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return { success: true, user }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 重置密码
 * @param {string} email - 用户邮箱
 * @returns {Promise<Object>} 重置结果
 */
export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('重置密码失败:', error)
    return { success: false, error: error.message }
  }
} 