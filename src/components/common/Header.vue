<template>
  <header class="header">
    <h1 :class="{'cursor-pointer': !isHomePage}" @click="returnHome()">
      {{ isHomePage ? 'Wowo-peng' : '返回主页' }}
    </h1>
    <div class="user-info">
      <el-button type="info" text @click="addProject()">新增项目</el-button>
      <span>欢迎 {{ userStore.user_info?.email }}</span>
      <el-badge :value="2" class="item" type="primary">
        <el-popover placement="bottom" trigger="hover">
          <ul class="popover-menu">
            <li @click="goToAccount">账号</li>
            <li @click="goToSettings">设置</li>
            <li @click="handleLogout">退出</li>
          </ul>
          <template #reference>
            <el-avatar :src="userStore.user_info?.avatar || $faker.image.avatar()" :size="32"/>
          </template>
        </el-popover>
      </el-badge>
    </div>
  </header>

  <el-dialog
    v-model="dialogVisible"
    title="新增项目"
    width="500px"
  >
    <el-form :model="projectForm" label-width="80px">
      <el-form-item label="项目名称">
        <el-input v-model="projectForm.project_name" placeholder="请输入项目名称" />
      </el-form-item>
      <el-form-item label="项目描述">
        <el-input
          v-model="projectForm.description"
          type="textarea"
          :rows="3"
          placeholder="请输入项目描述"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitProject">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/store'
import { computed, ref } from 'vue'
import { supabase } from '../../lib/supabase'
import { insert_project } from "@/api/supabase.project.api"
import emitter from '@/utils/eventBus'

const router = useRouter()
const userStore = useAuthStore()

const isHomePage = computed(() => router.currentRoute.value.path === '/home')

const dialogVisible = ref(false)
const projectForm = ref({
  project_name: '',
  description: ''
})

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    userStore.clearUserState()
    router.push('/login')
  } catch (error) {
    console.error('登出失败:', error.message)
  }
}

const addProject = () => {
  dialogVisible.value = true
}

const resetForm = () => {
  projectForm.value = {
    project_name: '',
    description: ''
  }
}

const submitProject = () => {
  insert_project({...projectForm.value}).then(res => {
    if(res.success) {
      dialogVisible.value = false
      resetForm()
      emitter.emit('project-list-updated')
    }
  }).catch(error => {
    console.error('submitProject insert_project===> ', error)
  })
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
