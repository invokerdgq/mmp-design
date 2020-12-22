const regExp = /^[0-9]+\.[0-9]+\.[0-9]+$/g

function noRepeat (list: any, key: string, message = '应用名称', key2 = '', type = 4) {
  return function noRepeatValidate (rule: any, value: string, callback: (arg0?: any) => void) {
    if (value === '') {
      callback(new Error(`${message}不能为空`))
    }
    if (key2 === '') {
      list.forEach((item: any) => {
        if (value === item[key]) {
          callback(new Error(`${message}已存在`))
        }
      })
    } else {
      let num = 0
      list.forEach((item: any) => {
        if (value === item[key]) {
          num += 1
        }
      })
      if (num === 4) {
        callback(new Error(`${message}已存在`))
      }
    }
    callback()
  }
}

function versionCheck (rule: any, value: string, callback: (arg0?: any) => void) {
  if (!regExp.test(value)) {
    callback(new Error('版本号只能输入数字和小数点'))
  }
  regExp.lastIndex = 0
  callback()
}

export { noRepeat, versionCheck }
