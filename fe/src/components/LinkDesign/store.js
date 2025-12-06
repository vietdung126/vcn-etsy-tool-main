import _ from 'lodash'
import { defineStore } from 'pinia'
import * as linkDesignApi from './service'

let isLoaded = false

export const useLinkDesignStore = defineStore('linkdesign', {
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
      const link = await linkDesignApi.getAll()
      this._items = _.keyBy(link, 'id')
      isLoaded = true
    },

    async create(fields) {
      const link = await linkDesignApi.create(fields)
      this._items[link.id] = link
      return link
    },

    getById(id) {
      return this._items[id]
    },

    async deleteById(id) {
      const result = await linkDesignApi.deleteById(id)

      if (result) {
        delete this._items[id]
      }

      return result
    },

    async updateById(id, fields) {
      const link = await linkDesignApi.updateById(id, fields)
      this._items[link.id] = link
      return link
    },
  },
})
