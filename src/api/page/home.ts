import api from '../axiosInit'

export function getAppList () {
  return api.get('/mmp/v1/app/listall')
}

export function createApp (params: object) {
  return api.post('/mmp/v1/app?', params)
}

export function getAppInfo (id: string) {
  return api.get(`/mmp/v1/app/${id}`)
}

export function copyApp (params: object) {
  return api.post('/mmp/v1/app/copy?', params)
}

export function editApp (params: object) {
  return api.post('/mmp/v1/app', params)
}

export function publishApp (params: object) {
  return api.post('/mmp/v1/app/version', params)
}

export function downLoadApp (params: object) {
  return api.get('/mmp/downloadApp', { params: params })
}

export function deleteApp (params: string) {
  return api.delete(`/mmp/v1/app/${params}`)
}

export function deleteAppVersion (params: any) {
  return api.delete(`/mmp/v1/app/version?appid=${params.appid}&version=${params.version}&optsBy=${params.optsBy}&distributeType=${params.distributeType}`)
}
