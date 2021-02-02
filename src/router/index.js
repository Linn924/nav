const Home = () => import(/* webpackChunkName: "nav_link_detail" */ '../components/Home.vue')
const NavList = () => import(/* webpackChunkName: "nav_link_detail" */ '../components/NavList.vue')
const NavDetail = () => import(/* webpackChunkName: "nav_link_detail" */ '../components/NavDetail.vue')

const NotFound = () => import(/* webpackChunkName: "nav_link" */'../components/NotFound.vue')

const Login = () => import(/* webpackChunkName: "login" */'../components/Login.vue')

Vue.use(VueRouter)

const routes = [
  { path: '*', component: NotFound },
  { path: '/',redirect: '/home'},
  { path: '/login',component:Login},
  { path: '/home',
    redirect: '/home/navlist',
    component:Home,
    children:[
      { path:'/home/navlist',component:NavList},
      { path:'/home/navdetail',component:NavDetail},
    ]
  }
]

const router = new VueRouter({
  // mode: 'history',
  routes
})

export default router
