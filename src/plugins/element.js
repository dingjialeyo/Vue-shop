import Vue from 'vue'
// // 用到哪些组件需要导入哪些
// import { Button } from 'element-ui'
// import { Form, FormItem } from 'element-ui'
// import { Input } from 'element-ui'
// // 导入弹框提示
// import { Message } from 'element-ui'

import { Button, Form, FormItem, Input, Message } from 'element-ui'

// 并注册为全局组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 挂载一个全局方法 都可以通过this.$message来调用
Vue.prototype.$message = Message
