import api from '../axiosInit'

export function getModuleInfo (id: string) {
  return api.get(`/mmp/v1/module/${id}`)
}

export function getPageInfo (id: string) {
  return api.get(`/mmp/v1/page/${id}`)
}

export function deleteModule (id: string) {
  return api.delete(`/mmp/v1/module/${id}`)
}

export function deletePage (id: string) {
  return api.delete(`/mmp/v1/page/${id}`)
}

export function addModule (params: object) {
  return api.post('/mmp/v1/module', params)
}

export function addPage (params: object) {
  return api.post('/mmp/v1/page', params)
}

export function editModule (params: object) {
  return api.post('/mmp/v1/module', params)
}

export function editPage (params: object) {
  return api.post('/mmp/v1/page', params)
}

export function getAllName (id: string) {
  return api.get(`/mmp/v1/module/children/${id}`)
}
