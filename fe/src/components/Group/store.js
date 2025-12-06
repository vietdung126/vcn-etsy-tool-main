import _ from 'lodash'
import { defineStore } from 'pinia'
import * as groupApi from './service'

let isLoaded = false

export const useGroupStore = defineStore('group', {
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
    getByStoreIdAndType() {
      return (storeId, type) => {
        const arr = this.items.filter(e => e.storeId === storeId && e.type === type)

        return arr
      }
    },
  },
  actions: {
    async load() {
      if (isLoaded) {
        return
      }
      this._items = {}
      const store = await groupApi.getAll()
      this._items = _.keyBy(store, 'id')
      isLoaded = true
    },

    async create(storeId, type, name) {
      const store = await groupApi.create({ storeId, type, name })
      this._items[store.id] = store
      return store
    },

    getById(id) {
      return this._items[id]
    },

    async deleteById(id) {
      const result = await groupApi.deleteById(id)

      if (result) {
        delete this._items[id]
      }

      return result
    },

    async updateById(id, fields) {
      const item = await groupApi.updateById(id, fields)
      this._items[item.id] = item
      return item
    },
  },
})
