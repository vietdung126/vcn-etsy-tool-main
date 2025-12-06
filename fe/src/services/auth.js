import API from './base'
const api = API('/auth')

export async function login(username, password) {
  return await api.post('/login', { username, password })
}

export async function changePassword({ currentPassword, newPassword }) {
  return api.put('/password', { currentPassword, newPassword })
}

export async function register(username, email, password) {
  return api.post('/register', { username, email, password })
}

export async function updateToken({ storeId }) {
  return api.put('/access-token', { storeId })
}

export async function ping() {
  return api.get('/ping')
}
