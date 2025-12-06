import _ from 'lodash'
import { defineStore } from 'pinia'
import * as storeApi from './service'

let isLoaded = false

export const useStoreStore = defineStore('store', {
  state: () => ({
    _items: {},
  }),
  getters: {
    items: state => {
      const result = Object.values(state._items).filter(e => !e.isDeleted)
      result.sort((a, b) => (a.name > b.name ? 1 : -1))

      return result
    },
    allStores: state => Object.values(state._items),
  },
  actions: {
    async load() {
      if (isLoaded) {
        return
      }
      this._items = {}
      const store = await storeApi.getAll()
      this._items = _.keyBy(store, 'id')
      isLoaded = true
    },

    async create(fields) {
      const store = await storeApi.create(fields)
      this._items[store.id] = store
      return store
    },

    getById(id) {
      return this._items[id]
    },

    async deleteById(id) {
      const result = await storeApi.deleteById(id)

      if (result) {
        delete this._items[id]
      }

      return result
    },

    async updateById(id, fields) {
      const store = await storeApi.updateById(id, fields)
      this._items[store.id] = store
      return store
    },
  },
})
