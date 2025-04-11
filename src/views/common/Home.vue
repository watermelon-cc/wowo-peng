<template>
  <div class="h-full p-15 ">
    <div class="flex h-full" v-loading="loading">
      <div style="width: 500px; height: 300px;" v-for="(item, num) of project_list" :key="num" class="mr-15 mb-15">
        <ProjectCard :info="item" @delete="getProjectList" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/store'
import { getCurrentInstance, onMounted, onUnmounted, reactive, ref, nextTick } from 'vue'
import ProjectCard from '@/components/project/project-card.vue'
import { get_user_all_project } from '@/api/supabase.project.api'
import emitter from '@/utils/eventBus'

const userStore = useAuthStore()
const { proxy } = getCurrentInstance()

const project_list = ref([])
const loading = ref(false)

const getProjectList = () => {
  loading.value = true
  get_user_all_project().then(res => {
    loading.value = false
    project_list.value = res.data || []
    // nextTick(() => {
    //   project_list.value = res.data || []
    // })
  }).catch(error => {
    loading.value = false
  })
}

onMounted(() => {
  getProjectList()
  // 监听项目列表更新事件
  emitter.on('project-list-updated', getProjectList)
})

onUnmounted(() => {
  // 组件卸载时移除事件监听
  emitter.off('project-list-updated', getProjectList)
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>