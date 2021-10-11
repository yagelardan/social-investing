import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'


import { store } from '../store/store'
console.log("aaaaaa")

//store.state.user.loggedIn = true;
//console.log(store.state.user.loggedIn)

Vue.use(VueRouter)




/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  return Router
}


import App from 'pages/PageLogin.vue'
import Logout from 'pages/PageLogout.vue'
import MainLayout from 'layouts/MainLayout.vue'


Vue.config.productionTip = false

import GAuth from 'vue-google-oauth2'
const gauthOption = {
  clientId: '518639059281-uatnptota6tclkq3lv7col1c39ogurvq.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'consent',
  fetch_basic_profile: true
}
Vue.use(GAuth, gauthOption)


// Require dependencies
var VueCookie = require('vue-cookie');
// Tell Vue to use the plugin
Vue.use(VueCookie);


//import Vuex from 'vuex'
//Vue.use(Vuex)

new Vue({
  store: store,
  render: h => h(App),
}).$mount('#app')

new Vue({
  store: store,
  render: h => h(Logout),
})//.$mount('#Logout')


new Vue({
  store: store,
  render: h => h(MainLayout),
})//.$mount('#Logout')


/*
const store = new Vuex.Store({
  state: {
      user: {
          loggedIn: false,
          isSubscribed: false
      }
  },

  getters: {
      auth(state) {
          return state.user
      }
  }
})
*/