import router from './index'

router.beforeEach((to, from, next) => {
  if (to.path !== '/' && to.path !== '/home') {
    if (localStorage.getItem('authToken')) {
      next()
      return
    }
    next({ name: 'Home' })
    return
  }
  next()
})
