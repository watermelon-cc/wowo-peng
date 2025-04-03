<template>
  <div class="not-found-container">
    <h1>404</h1>
    <p>页面未找到</p>
    <router-link to="/" class="back-home-button">返回首页</router-link>
  </div>
</template>

<script setup>
// No additional logic is needed for this simple 404 page.
</script>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #f9fafb; /* Light gray background */
  color: #374151; /* Dark gray text */
}

.not-found-container h1 {
  font-size: 96px;
  font-weight: bold;
  margin-bottom: 16px;
}

.not-found-container p {
  font-size: 18px;
  margin-bottom: 24px;
}

.back-home-button {
  display: inline-block;
  padding: 10px 20px;
  font-size: 16px;
  color: #ffffff;
  background-color: #2563eb; /* Blue */
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.back-home-button:hover {
  background-color: #1e40af; /* Darker blue */
}
</style>
