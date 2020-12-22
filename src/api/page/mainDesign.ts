import api from '../axiosInit'

export function getPageList (params: object) {
  return api.get('/getPageList', { params: params })
}
