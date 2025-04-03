<template>
  <div class="login-container">
    <div class="login-box">
      <h2>{{ isSignUp ? '注册' : '登录' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <input
            type="email"
            v-model="email"
            placeholder="邮箱"
            required
          />
        </div>
        <div class="form-group">
          <input
            type="password"
            v-model="password"
            placeholder="密码"
            required
          />
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <div v-if="verificationSent" class="success-message">
          验证邮件已发送，请检查您的邮箱
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? '处理中...' : (isSignUp ? '注册' : '登录') }}
        </button>
        <div class="switch-mode">
          <a href="#" @click.prevent="isSignUp = !isSignUp">
            {{ isSignUp ? '已有账号？去登录' : '没有账号？去注册' }}
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/store'
import { supabase } from '../../lib/supabase'
import { watchAndUpdateUserInfo } from '@/api/common.api'

const router = useRouter()
const userStore = useUserStore()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const isSignUp = ref(false)
const verificationSent = ref(false)

// 处理注册
const handleSignUp = async () => {
  if (!email.value || !password.value) return
  
  try {
    loading.value = true
    error.value = ''
    
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        emailRedirectTo: `${window.location.origin}/login`
      }
    })

    if (signUpError) throw signUpError

    // 检查是否需要邮箱验证
    // if (data?.user?.identities?.length === 0) {
    if (data?.aud === 'authenticated') {
      verificationSent.value = true
      error.value = '请检查您的邮箱以完成验证'
    } else {
      // 如果不需要验证，直接登录
      await handleLogin()
    }
  } catch (err) {
    error.value = err.message
    console.error('注册失败:', err)
  } finally {
    loading.value = false
  }
}

// 处理登录
const handleLogin = async () => {
  if (!email.value || !password.value) return
  
  try {
    loading.value = true
    error.value = ''
    
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (signInError) throw signInError

    // 检查邮箱是否已验证
    if (!data.user.email_confirmed_at) {
      error.value = '请先验证您的邮箱'
      return
    }

    // 保存认证信息到 store
    userStore.setAccessToken(data.session.access_token)
    userStore.setAuthInfo(data.user)
    
    // 开始监听用户信息更新
    watchAndUpdateUserInfo()

    router.push('/home')
  } catch (err) {
    error.value = err.message
    console.error('登录失败:', err)
  } finally {
    loading.value = false
  }
}

// 处理表单提交
const handleSubmit = async () => {
  if (isSignUp.value) {
    await handleSignUp()
  } else {
    await handleLogin()
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.error-message {
  color: #f44336;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

button {
  width: 100%;
  padding: 0.8rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.success-message {
  color: #4CAF50;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.switch-mode {
  text-align: center;
  margin-top: 1rem;
}

.switch-mode a {
  color: #4CAF50;
  text-decoration: none;
}

.switch-mode a:hover {
  text-decoration: underline;
}
</style> 