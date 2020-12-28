import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/router/permission'
import store from './store'
import Element from 'element-ui'
import './style/standard.scss'
import './assets/style/icon.css'
import VueClipboard from 'vue-clipboard2'
import * as filter from './filter/filter'

Vue.use(VueClipboard)
Vue.use(Element)
Vue.config.productionTip = false
Object.keys(filter).forEach(item => {
  // @ts-ignore
  Vue.filter(item, filter[item])
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
