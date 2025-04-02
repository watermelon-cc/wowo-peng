<template>
  <div class="account-container">
    <div class="account-menu">
      <div class="menu-section">
        <div class="menu-header">账户设置</div>
        <ul class="menu-list">
          <li :class="{ active: activeMenu === '/account/profile' }">
            <a href="/account/profile">个人信息</a>
          </li>
          <li :class="{ active: activeMenu === '/account/security' }">
            <a href="/account/security">安全设置</a>
          </li>
        </ul>
      </div>
      <div class="menu-section">
        <div class="menu-header">其他</div>
        <ul class="menu-list">
          <li :class="{ active: activeMenu === '/account/notifications' }">
            <a href="/account/notifications">通知设置</a>
          </li>
          <li :class="{ active: activeMenu === '/account/billing' }">
            <a href="/account/billing">账单信息</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="account-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.account-container {
  display: flex;
  padding: 20px;
}

.account-menu {
  width: 250px;
  border-right: 1px solid #e0e0e0;
  padding-right: 20px;
}

.menu-section {
  margin-bottom: 20px;
}

.menu-header {
  font-size: 14px;
  font-weight: bold;
  color: #6b7280; /* Neutral gray */
  margin-bottom: 10px;
  padding-left: 10px;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-list li {
  margin-bottom: 10px;
}

.menu-list li a {
  text-decoration: none;
  color: #666; /* Default gray */
  padding: 8px 10px;
  display: block;
  font-weight: normal;
  transition: color 0.2s;
}

.menu-list li a:hover {
  color: #333; /* Darker gray on hover */
  font-weight: bold;
}

.menu-list li.active a {
  color: #333; /* Darker gray when active */
  font-weight: bold;
}
  
.account-content {
  flex: 1;
  padding-left: 20px;
}
</style>
