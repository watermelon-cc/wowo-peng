import { supabase } from '@/lib/supabase'

/**
 * 获取用户详细信息
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 用户详细信息
 */
export const getUserInfo = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_info')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 更新用户信息
 * @param {Object} userInfo - 用户信息对象
 * @returns {Promise<Object>} 更新结果
 */
export const updateUserInfo = async (userInfo) => {
  try {
    const { error } = await supabase
      .from('user_info')
      .upsert({
        id: userInfo.id,
        user_name: userInfo.user_name,
        age: userInfo.age,
        sex: userInfo.sex,
        email: userInfo.email,
        phone: userInfo.phone,
        avatar: userInfo.avatar
      })

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('更新用户信息失败:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 更新用户头像
 * @param {string} userId - 用户ID
 * @param {string} avatarUrl - 头像URL
 * @returns {Promise<Object>} 更新结果
 */
export const updateUserAvatar = async (userId, avatarUrl) => {
  try {
    const { error } = await supabase
      .from('user_info')
      .update({ avatar: avatarUrl })
      .eq('id', userId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('更新用户头像失败:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 获取用户列表
 * @param {Object} options - 查询选项
 * @param {number} options.limit - 每页数量
 * @param {number} options.offset - 偏移量
 * @returns {Promise<Object>} 用户列表
 */
export const getUserList = async ({ limit = 10, offset = 0 } = {}) => {
  try {
    const { data, error, count } = await supabase
      .from('user_info')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return { success: true, data, count }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 搜索用户
 * @param {string} keyword - 搜索关键词
 * @returns {Promise<Object>} 搜索结果
 */
export const searchUsers = async (keyword) => {
  try {
    const { data, error } = await supabase
      .from('user_info')
      .select('*')
      .or(`user_name.ilike.%${keyword}%,email.ilike.%${keyword}%,phone.ilike.%${keyword}%`)

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('搜索用户失败:', error)
    return { success: false, error: error.message }
  }
} 