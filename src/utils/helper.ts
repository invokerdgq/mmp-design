function WithParams (option?: any) {
  return function (Component: any) {
    Component.prototype.getParams = function (data: object, options: any) {
      return { ...data, ...options }
    }
  }
}

function WithCheck (Component: any) {
  Component.prototype.check = function (data: string, key: string, message: string, num: number) {
    return (rule: any, value: string, callback: (arg0?: any) => void) => {
      let result: any
      data.split('.').forEach((item: string) => {
        result = this[item]
      })
      if (value === '') {
        callback(new Error(`${message}不能为空`))
      }
      if (Array.isArray(result) && result.length > 0) {
        if (!num) {
          result.forEach((item: any) => {
            if (item[key] === value) {
              callback(new Error(`${message}已存在`))
            }
          })
        } else {
          // num 为key重复次数
          let n = 0
          result.forEach((item: any) => {
            if (item[key] === value) {
              n += 1
            }
          })
          if (n === num) callback(new Error(`${message}已存在`))
        }
      }
      callback()
    }
  }
}

export { WithParams, WithCheck }
