const Nav = () => import(/* webpackChunkName: "nav_link_notfound" */ '../components/Nav.vue')
const Link = () => import(/* webpackChunkName: "nav_link_notfound" */ '../components/Link.vue')
const NotFound = () => import(/* webpackChunkName: "nav_link_notfound" */'../components/NotFound.vue')

Vue.use(VueRouter)

const routes = [
  { path: '*', component: NotFound },
  { path: '/',redirect: '/link'},
  { path: '/nav',
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
