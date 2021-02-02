import App from './App.vue'
import router from './router'
import store from './store'
import { VueJsonp } from 'vue-jsonp'
import './assets/css/global.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// axios.defaults.baseURL='http://139.196.210.43:0924/'
axios.defaults.baseURL='http://localhost:8888/'

axios.interceptors.request.use(config => {
  config.url === 'navs' && NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.use(VueJsonp)

Vue.filter('date', function (originVal) {
  const t = new Date(originVal)
  const y = t.getFullYear()
  const m = (t.getMonth() + 1 + '').padStart(2, '0')
  const d = (t.getDate() + '').padStart(2, '0')
  const hh = (t.getHours() + '').padStart(2, '0')
  const mm = (t.getMinutes() + '').padStart(2, '0')
  const ss = (t.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
