import API from '@/services/base'
const api = API('/stores')

export async function getAll() {
  return await api.get('')
}

export async function create(fields) {
  return api.post('', fields)
}

export async function updateById(id, fields) {
  return api.put(`/${id}`, fields)
}

export async function deleteById(id) {
  return api.delete(`/${id}`)
}
