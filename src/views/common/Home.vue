<template>
  <div class="h-full p-15">
    <div class="flex">
      <div style="width: 500px; height: 300px;" v-for="item of project_list" class="mr-15 mb-15">
        <ProjectCard :info="item" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../../stores/store'
import { getCurrentInstance, onMounted, reactive, ref} from 'vue'
import ProjectCard from '@/components/project-card.vue'
import { get_user_all_project } from '@/api/supabase.project.api'

const userStore = useAuthStore()
const { proxy } = getCurrentInstance()
const faker = proxy.$faker

const project_list = ref([])

onMounted(() => {
  get_user_all_project().then(res => {
    project_list.value = res.data || []
  }).catch(error => {
    console.warn('get_user_all_project ===>', error)
  })
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>