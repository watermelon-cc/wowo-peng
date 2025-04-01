<template>
  <div class="home-container">
    <header class="header">
      <h1>欢迎来到主页</h1>
      <div class="user-info">
        <span v-if="userStore.userInfo">欢迎, {{ userStore.userInfo.username }}</span>
        <button @click="handleLogout" class="logout-btn">登出</button>
      </div>
    </header>
    <main class="main-content">
      <p>这是主页内容</p>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/store'
import { supabase } from '../../lib/supabase'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = async () => {
  try {
    // Supabase 登出
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    // 清除 store 中的状态
    userStore.clearUserState()
    
    router.push('/login')
  } catch (error) {
    console.error('登出失败:', error.message)
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  background-color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  margin: 0;
  color: #333;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info span {
  color: #666;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #d32f2f;
}

.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>