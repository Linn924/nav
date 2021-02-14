const Home = () => import(/* webpackChunkName: "home" */ '../components/Home.vue')

const NavList = () => import(/* webpackChunkName: "navlist" */ '../components/dynamic/NavList.vue')
const Nav = () => import(/* webpackChunkName: "nav" */ '../components/dynamic/Nav.vue')
const Login = () => import(/* webpackChunkName: "login" */'../components/dynamic/Login.vue')
const NotFound = () => import(/* webpackChunkName: "notfound" */'../components/dynamic/NotFound.vue')

Vue.use(VueRouter)

const routes = [
  { path: '*', component: NotFound },
  { path: '/',redirect: '/home'},
  { path: '/login',component:Login},
  { path: '/home',
    redirect: '/navlist',
    component:Home,
    children:[
      { path:'/navlist',component:NavList},
      { path:'/nav',component:Nav},
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
