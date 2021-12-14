import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

import { store } from '../store/store'



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
import MainLayout from 'layouts/MainLayout.vue'
import Post from 'pages/PagePost.vue'

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


var VueAxios = require('axios');
console.log("use axios")
Vue.use(VueAxios);


//import Vuex from 'vuex'
//Vue.use(Vuex)

new Vue({
  store: store,
  render: h => h(App),
})//.$mount('#app')



new Vue({
  store: store,
  render: h => h(MainLayout),
})//.$mount('#Logout')

new Vue({
  store: store,
  render: h => h(Post),
})//.$mount('#Logout')