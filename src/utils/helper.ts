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
      let result: any = ''
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

function WithPage (option?: { pageNum: number; pageSize: number}) {
  return function (Component: any) {
    Component.prototype.pageNum = option ? option.pageNum : 1
    Component.prototype.pageSize = option ? option.pageSize : 10
    Component.prototype.total = 0
    Component.prototype.pageList = []
    Component.prototype.pageLoading = false
    Component.prototype.toPage = async function (n: number) {
      if (this.pageLoading) return
      this.pageLoading = true
      await this.getList(n, this.pageSize)
      this.pageNum = n
      this.pageLoading = false
    }
    Component.prototype.setPageSize = async function (size: number) {
      if (this.pageLoading) return
      this.pageLoading = true
      await this.getList(this.pageNum, size)
      this.pageSize = size
      this.pageLoading = false
    }
    Component.prototype.resetPageOption = async function () {
      if (this.pageLoading) return
      this.pageLoading = true
      await this.getList(option ? option.pageNum : 1, option ? option.pageSize : 10)
      this.pageLoading = false
    }
  }
}

export { WithParams, WithCheck, WithPage }
