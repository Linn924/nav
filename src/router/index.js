const Nav = () => import(/* webpackChunkName: "nav_link" */ '../components/Nav.vue')
const Link = () => import(/* webpackChunkName: "nav_link" */ '../components/Link.vue')

Vue.use(VueRouter)

const routes = [
  {path: '/',redirect: '/link'},
  {path: '/nav',component:Nav,children:[
    {path:'/link',component:Link}
  ]}
]

const router = new VueRouter({
  routes
})

export default router
