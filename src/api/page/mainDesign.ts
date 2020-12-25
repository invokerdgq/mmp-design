import api from '../axiosInit'

export function addHomePage (params: object) {
  return api.post('/mmp/v1/first/page', params)
}

export function editHomePage (params: object) {
  return api.post('/mmp/v1/first/page', params)
}

export function deleteHomePage (id: string) {
  return api.delete(`/mmp/v1/first/page/${id}`)
}

export function getHomePage (params: any) {
  return api.get(`/mmp/v1/first/page/page/${params.pageNum}/${params.pageSize}`, { params: params })
}

export function useHomePage (id: string) {
  return api.put(`/mmp/v1/first/page/${id}`)
}

export function closeHomePage (id: string) {
  return api.patch(`/mmp/v1/first/page/${id}`)
}
