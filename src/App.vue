<template>
  <div id="app">
    <Header v-if="userStore.isLoggedIn" />
    <router-view style="flex: 1; overflow: hidden;" />
  </div>
</template>

<script setup>
import { useUserStore } from './stores/store'
import Header from './components/common/Header.vue'

const userStore = useUserStore()

</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
</style>
