const Nav = () => import(/* webpackChunkName: "nav_link_notfound" */ '../components/Nav.vue')
const Link = () => import(/* webpackChunkName: "nav_link_notfound" */ '../components/Link.vue')
const NotFound = () => import(/* webpackChunkName: "nav_link_notfound" */'../components/NotFound.vue')

const Login = () => import(/* webpackChunkName: "login" */'../components/Login.vue')

Vue.use(VueRouter)

const routes = [
  { path: '*', component: NotFound },
  { path: '/',redirect: '/nav'},
  { path: '/login',component:Login},
  { path: '/nav',
    redirect: '/link',
    component:Nav,
    children:[
      { path:'/link',component:Link}
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
