import _ from 'lodash'
import { defineStore } from 'pinia'
import * as skuSpuApi from './service'

let isLoaded = false

export const useSkuSpuStore = defineStore('skuspu', {
  state: () => ({
    _items: {},
  }),
  getters: {
    items: state => Object.values(state._items).filter(e => !e.isDeleted),
    allItems: state => Object.values(state._items),
    getByGroupId() {
      return groupId => {
        if (!groupId) {
          return []
        }

        const arr = this.items.filter(e => e.groupId === groupId)

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
      const skuSpus = await skuSpuApi.getAll()
      this._items = _.keyBy(skuSpus, 'id')
      isLoaded = true
    },

    async create(fields) {
      const skuSpu = await skuSpuApi.create(fields)
      this._items[skuSpu.id] = skuSpu
      return skuSpu
    },

    getById(id) {
      return this._items[id]
    },

    async deleteById(id) {
      const result = await skuSpuApi.deleteById(id)

      if (result) {
        delete this._items[id]
      }

      return result
    },

    async updateById(id, fields) {
      const skuSpu = await skuSpuApi.updateById(id, fields)
      this._items[skuSpu.id] = skuSpu
      return skuSpu
    },
  },
})
