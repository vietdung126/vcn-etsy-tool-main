import _ from 'lodash'
import { defineStore } from 'pinia'
import * as userApi from './service'

let isLoaded = false

export const useUserStore = defineStore('user', {
  state: () => ({
    _users: {},
  }),
  getters: {
    users: state => Object.values(state._users).filter(e => !e.isDeleted),
    allStores: state => Object.values(state._users),
  },
  actions: {
    async load() {
      if (isLoaded) {
        return
      }
      this._users = {}
      const users = await userApi.getAll()
      this._users = _.keyBy(users, 'id')
      isLoaded = true
    },

    async create(fields) {
      const user = await userApi.create(fields)
      this._users[user.id] = user
      return user
    },

    getById(id) {
      return this._users[id]
    },

    async deleteById(userId) {
      const result = await userApi.deleteById(userId)

      if (result) {
        delete this._users[userId]
      }

      return result
    },

    async updateById(userId, fields) {
      const user = await userApi.updateById(userId, fields)
      this._users[user.id] = user
      return user
    },
  },
})
