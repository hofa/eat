import Vue from 'vue'
import App from './App'

import Me from './components/Me'
import Top from './components/Top'
import SSet from './components/Set'
import Mouth from './components/Mouth'
import Total from './components/Total'
import Order from './components/Order'
import Carte from './components/Carte'
import Brand from './components/Brand'
import Login from './components/Login'
import Code from './components/Code'

import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueCookie from 'vue-cookie'

const FastClick = require('fastclick')
FastClick.attach(document.body)

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueCookie)
console.log(process.env.NODE_ENV)
Vue.http.options.emulateJSON = true


const router = new VueRouter()

// Vue.http.headers.common['Authorization'] = '123456'
Vue.http.interceptors.push((request, next)  =>{
    if (request.url.indexOf('user/login') == -1) {
      // var token = VueCookie.get("t")
      var token = localStorage.t
      request.params['t'] = token
      // Vue.http.headers.common['Authorization'] = token
      // request.headers.set('Authorization', token)
      // request.headers['Authorization'] = token
      if (token == null || token.length == 0) {
        router.go('/code')
      }
    }
    next((response) => {
        if (response.ok) {
          if (response.data.code == 1) {
            router.go('/code')
          }
        } else {
          router.go('/code')
        }
        return response
    });

});

router.map({
  '/': {
    component: Me
  },
  '/order': {
    component: Order
  },
  '/mouth': {
    component: Mouth
  },
  '/total': {
    component: Total
  },
  '/top': {
    component: Order
  },
  '/set': {
    component: SSet
  },
  '/brand': {
    component: Brand
  },
  '/carte': {
    component: Carte
  },
  '/login': {
    component: Login
  },
  '/today': {
    component: Top
  },
  '/code': {
    component: Code
  },
})

router.start(App, '#app')

