<template>
  <div class="home-container">
    <div class="flex items-center h-50">
      <span>{{ $faker.person.fullName() }} {{ $faker.person.jobArea() }}</span>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../../stores/store'
import { getCurrentInstance } from 'vue'

const userStore = useUserStore()
const { proxy } = getCurrentInstance()
const faker = proxy.$faker
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>