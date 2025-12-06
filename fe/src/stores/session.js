import { defineStore } from 'pinia'
import * as AuthApi from '@/services/auth'

export const useSessionStore = defineStore('session', {
  state: () => ({ accessToken: null, refreshToken: null, loaded: false, userStores: [] }),
  getters: {
    getLoaded: state => state.loaded,
    roles: state => {
      const roles = state.userStores.map(e => e.roleId)
      return Array.from(new Set(roles))
    },
  },
  actions: {
    loadRole() {
      let userStores = sessionStorage.getItem('r')
      userStores = userStores ? JSON.parse(userStores) : []
      this.userStores = userStores
    },
    setLoaded() {
      this.loaded = true
    },
  },
})
