// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
// import G2 from '@antv/g2';
import $ from "jquery";
import {getCookie} from './config/mUtils'
//引入element-ui的默认CSS样式
import 'element-ui/lib/theme-default/index.css';
Vue.use(ElementUI);
Vue.config.productionTip = false
/* eslint-disable no-new */
axios.defaults.baseURL = HOST;
// console.log(HOST,'HOST')
/* eslint-disable no-new */

// 引入Vuex的store
import store from './Vuex'

new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) { // 下一个页面需要登录
    if (getCookie("Token")) { // 已登录
      next() // 访问下一个页面
    } else { // 未登录
      next('/') // 回到登录界面
    }
  } else { //下一个页面不需要登录
    next() // 访问下一个页面
  }
})
