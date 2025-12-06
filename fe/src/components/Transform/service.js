import API from '@/services/base'
const api = API('/transform')

export async function transform(storeCode, file) {
  var bodyFormData = new FormData()
  bodyFormData.append('storeCode', storeCode)
  bodyFormData.append('file', file)

  return api.post('', bodyFormData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
