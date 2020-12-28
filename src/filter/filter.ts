function GMTToStr (time: string) {
  const date = new Date(time)
  return date.getFullYear() + '-' +
    (date.getMonth() + 1) + '-' +
    date.getDate() + ' ' +
    date.getHours() + ':' +
    date.getMinutes() + ':' +
    date.getSeconds()
}

function getRouteName (name: string) {
  let dec = ''
  switch (name) {
    case 'main':
      dec = '首页定制'
      break
    case 'config':
      dec = '应用配置'
      break
    case 'feature':
      dec = '功能定制'
      break
    default :
  }
  return dec
}

function getIcon (type: string): string {
  switch (type) {
    case 'root' :
      return 'mmp-addContents iconfont'
    case 'module' :
      return 'mmp-fileClose iconfont'
    case 'module-open' :
      return 'mmp-fileOpen iconfont'
    case 'page' :
      return 'mmp-sidebar iconfont'
    default :
      return 'mmp-sidebar iconfont'
  }
}

function getConfig (type: string): string {
  switch (type) {
    case 'base':
      return '基础设置'
    case 'connect':
      return '业务关联'
    case 'icon':
      return '图标设置'
    case 'ding':
      return '浙政钉设置'
    case 'ban':
      return '浙里办设置'
    default :
      return ''
  }
}

export { GMTToStr, getRouteName, getIcon, getConfig }
