import './assets/main.css'
import 'caring-css'

// element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/store'
import { supabase } from './lib/supabase'
import { faker } from '@faker-js/faker';


const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(ElementPlus)
app.use(pinia)
app.use(router)
app.config.globalProperties.$faker = faker
app.config.globalProperties.$supabase = supabase
// 初始化用户状态
const userStore = useAuthStore()
const initUserState = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      userStore.setAccessToken(session.access_token)
      userStore.setAuthInfo(session.user)
    }
  } catch (error) {
    console.error('初始化用户状态失败:', error.message)
  }
}

initUserState()

app.mount('#app')
