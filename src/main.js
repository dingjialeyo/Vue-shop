import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import '../src/assets/css/global.css'
import './assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'
// 配置拦截器
axios.interceptors.request.use(config => {
  // console.log(config)
  // 预处理一下
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须return config
  return config
})
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 每一个Vue组件都可以通过this.$http发送ajax请求。
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
