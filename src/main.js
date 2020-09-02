import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import '../src/assets/css/global.css'
import './assets/fonts/iconfont.css'
// 导入插件table
import TreeTable from 'vue-table-with-tree-grid'
// 导入axios
import axios from 'axios'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
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

// 全局注册 为可用的组件
Vue.component('tree-table',TreeTable)
// 全局注册富文本编辑器
Vue.use(VueQuillEditor)
// 全局注册一个时间过滤器
Vue.filter('dateFormat', function (date) {
  // 需要过滤的时间毫秒数
  const dt = new Date(date)
  // 年份获取
  const y = dt.getFullYear()
  // 月份获取     padStart方法 需要转换为字符串才能使用 使该数值必须为两位，少于两位会在前面补充0
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  // 日期获取
  const d = (dt.getDate() + '').padStart(2, '0')
  // 小时获取
  const hh = (dt.getHours() + '').padStart(2, '0')
  // 分钟获取
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  // 秒获取
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  // 返回处理好的时间
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
