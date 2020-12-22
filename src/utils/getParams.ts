function getParams (appJson: object, optsBy: string): object {
  const formData = new FormData()
  formData.set('appJson', JSON.stringify(appJson))
  formData.set('optsBy', optsBy)
  return formData
}

function params (target: any) {
  target.prototype.getParams = getParams
}

export default params
