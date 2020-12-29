import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import CreateApp from '../views/CreateApp/CreateApp.vue'
import ConfigDesign from '../views/CreateApp/ConfigDesign.vue'
import FeatureDesign from '../views/CreateApp/FeatureDesign.vue'
import MainDesign from '../views/CreateApp/MainDesign.vue'
import ProcessImage from '../views/CreateApp/ProcessImage.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/create:id',
    name: 'create',
    component: CreateApp,
    redirect: '/create:id/process',
    children: [
      {
        path: 'main',
        name: 'main',
        component: MainDesign
      },
      {
        path: 'feature',
        name: 'feature',
        component: FeatureDesign
      },
      {
        path: 'config',
        name: 'config',
        component: ConfigDesign
      },
      {
        path: 'process',
        name: 'process',
        component: ProcessImage
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
