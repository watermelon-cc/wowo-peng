import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    access_token: null,
    auth_info: null,
    user_info: null
  }),

  getters: {
    getUserInfo: (state) => state.user_info,
    getAuthInfo: (state) => state.auth_info,
    isLoggedIn: (state) => !!state.access_token
  },

  actions: {
    setUserInfo(userInfo) {
      this.user_info = userInfo
    },
    
    setAuthInfo(authInfo) {
      this.auth_info = authInfo
    },
    
    setAccessToken(token) {
      this.access_token = token
    },

    clearUserState() {
      this.access_token = null
      this.auth_info = null
      this.user_info = null
    }
  },

  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['access_token', 'auth_info', 'user_info']
  }
}) 