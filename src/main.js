import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'



// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // 拦截器中，展示进度条，
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
})

// 隐藏进度条
axios.interceptors.response.use((config) => {
  NProgress.done()
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

// 安装全局的VueQuillEditor
Vue.use(VueQuillEditor)

// 创建全局的时间过滤器
Vue.filter('msgFormat', function (msg) {
  // padStart()是字符串的方法
  const dt = new Date(msg);
  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '').padStart(2, '0');
  const d = (dt.getDate() + '').padStart(2, '0');
  const hh = (dt.getHours() + '').padStart(2, '0');
  const mm = (dt.getMinutes() + '').padStart(2, '0');
  const ss = (dt.getSeconds() + '').padStart(2, '0');
  return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
