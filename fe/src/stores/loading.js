import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('Loading', {
  state: () => ({
    _items: {},
  }),
  getters: {
    loading: state => Object.values(state._items).filter(e => !!e).length,
  },
  actions: {
    async start(id) {
      this._items[id] = true
    },

    async finish(id) {
      delete this._items[id]
    },
  },
})
