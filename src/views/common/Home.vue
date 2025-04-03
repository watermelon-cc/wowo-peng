<template>
  <div class="home-container">
    <div class="flex items-center h-50">
      <span>{{ userStore.user_info?.user_name }}</span>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/store'
import { getCurrentInstance } from 'vue'

const userStore = useAuthStore()
const { proxy } = getCurrentInstance()
const faker = proxy.$faker
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>