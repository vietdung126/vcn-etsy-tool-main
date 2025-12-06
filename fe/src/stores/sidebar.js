import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebarStore', {
  state: () => ({
    rail: false,
  }),
  actions: {
    async setRail(val) {
      this.rail = val
    },
  },
})
