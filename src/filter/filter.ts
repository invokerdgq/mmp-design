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

export { GMTToStr, getRouteName }
