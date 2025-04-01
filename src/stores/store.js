import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    access_token: null,
    userInfo: null
  }),

  getters: {
    getUserInfo: (state) => state.userInfo,
    isLoggedIn: (state) => !!state.access_token
  },

  actions: {
    setUserInfo(userInfo) {
      this.userInfo = userInfo
    },
    
    setAccessToken(token) {
      this.access_token = token
    },

    clearUserState() {
      this.access_token = null
      this.userInfo = null
    }
  },

  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['access_token', 'userInfo']
  }
}) 