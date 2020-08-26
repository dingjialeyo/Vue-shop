import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入登录组件
import Login from '../components/login.vue'
// 导入home组件
import Home from '../components/home.vue'
// 导入welcome组件
import Welcome from '../components/welcome.vue'
// 导入users组件
import Users from '../components/user/users.vue'
// 导入rights组件
import Rights from '../components/power/rights.vue'
// 导入Roles组件
import Roles from '../components/power/roles.vue'
// 导入categories组件
import Categories from '../components/goods/categories.vue'
// 导入params组件
import Params from '../components/goods/params.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home',
    component: Home,
    // 只要访问home路由就跳转为welcome路由
    redirect: '/welcome',
    // 基于home组件下继续增加若干路由  继承home页面继续添加模板
    children: [{
      path: '/welcome', 
      component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/params',
        component: Params
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to代表将要访问的路径
  // from代表从哪个路径跳转
  // next 是一个函数， next()表示放行 或者 next('/login')强制跳转
  if (to.path === '/login') return next()
  // 获取token值 进行判断 是放行还是强制跳转
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})
export default router
