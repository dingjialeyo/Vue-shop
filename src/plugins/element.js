import Vue from 'vue'
// // 用到哪些组件需要导入哪些
// import { Button } from 'element-ui'
// import { Form, FormItem } from 'element-ui'
// import { Input } from 'element-ui'
// // 导入弹框提示
// import { Message } from 'element-ui'

import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox, Tag, Tree, Select, Option, Cascader, Alert, Tabs, TabPane, Step, Steps, Checkbox, CheckboxGroup, Upload} from 'element-ui'

// 并注册为全局组件
Vue.use(Button)
Vue.use(Form)
Vue.use(Upload)
Vue.use(FormItem)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Input)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(Step)
Vue.use(Steps)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
// 挂载一个全局方法 都可以通过this.$message来调用
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
