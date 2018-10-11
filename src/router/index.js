import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router)
import { homeChildren } from './homeChildren'

export default new Router({
  mode: 'history',
  base: __dirname,
  routes: [{
      path: '/Home',
      name: 'Home',
      component: resolve => require(['@/components/common/Home'], resolve),
      meta: {
        requiresAuth: true
      },
      children: homeChildren
    },
    {
      path: '*',
      name: 'Login',
      component: resolve => require(['@/components/Login/Login'], resolve),
      meta: {
        requiresAuth: false
      }
    },{
    path: '/Error',
      name: 'Error',
      component: resolve => require(['@/components/errorPage/error'], resolve),
      meta: {
        requiresAuth: false
    }
    }
  ]
})
