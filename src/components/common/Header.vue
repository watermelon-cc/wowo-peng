<template>
  <header class="header">
    <h1 :class="{'cursor-pointer': !isHomePage}" @click="returnHome()">
      {{ isHomePage ? 'Wowo-peng' : '返回主页' }}
    </h1>
    <div class="user-info">
      <span>欢迎 {{ userStore.userInfo.email }}</span>
      <el-badge :value="2" class="item" type="primary">
        <el-popover placement="bottom" trigger="hover">
          <ul class="popover-menu">
            <li @click="goToAccount">账号</li>
            <li @click="goToSettings">设置</li>
            <li @click="handleLogout">退出</li>
          </ul>
          <template #reference>
            <el-avatar :src="$faker.image.avatar()" :size="32"/>
          </template>
        </el-popover>
      </el-badge>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/store'
import { computed } from 'vue'
import { supabase } from '../../lib/supabase' // 确保正确导入 supabase 实例

const router = useRouter()
const userStore = useUserStore()

const isHomePage = computed(() => router.currentRoute.value.path === '/home')

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut() // 使用导入的 supabase 实例
    if (error) throw error

    userStore.clearUserState()
    router.push('/login')
  } catch (error) {
    console.error('登出失败:', error.message)
  }
}

const returnHome = () => {
  if (isHomePage.value) return
  router.push('/')
}

const goToAccount = () => {
  router.push('/account')
}

const goToSettings = () => {
  router.push('/settings')
}
</script>

<style scoped>
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

.popover-menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.popover-menu li {
  padding: 0.5rem 0;
  cursor: pointer;
  transition: color 0.3s;
}

.popover-menu li:hover {
  color: #409eff;
}
</style>
