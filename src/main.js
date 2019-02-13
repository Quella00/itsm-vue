// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import "babel-polyfill"

import Vuex from 'vuex'

import store from './store/index.js'

import ElementUI from 'element-ui'
ElementUI.Upload.components.IframeUpload.props.onLoad = Function
import 'element-ui/lib/theme-chalk/index.css'
import './assets/font/iconfont.css'

//import '../static/lib/utf8-jsp/third-party/jquery-1.10.2.min.js'
//import '../static/lib/utf8-jsp/ueditor.config.js'
//import '../static/lib/utf8-jsp/ueditor.all.min.js'
//import '../static/lib/utf8-jsp/lang/zh-cn/zh-cn.js'

import App from './App'
import router from './router'

//import promise from 'es6-promise'
//promise.polyfill()

import axios from './axios'
Vue.prototype.$axios = axios;
Vue.prototype.$host = '/api';

////mock模拟数据
//import Mock from './mock'

Vue.config.productionTip = false;

Vue.use(ElementUI);

import itsm from './assets/js/itsm.js'
Vue.use(itsm);

//jQuery.support.cors = true;

/* eslint-disable no-new */
window['vm']= new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
