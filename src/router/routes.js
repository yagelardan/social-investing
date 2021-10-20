//import { store } from 'quasar/wrappers'
import { store } from '../store/store'


const routes = [
  {
    
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        // todo: change to dashboard
        path: '',
        component: () => import('pages/PageHome.vue'),
        name: 'Home',
        beforeEnter: (to, from, next) => {
          if(!store.state.user.loggedIn){
          //if(!this.$cookie.get('current-user')){
            return next({
              name: 'Login'
            })
          }
          next()
        }
      },
      { 
        path: '/about',
        component: () => import('pages/PageAbout.vue'),
        name: 'About'
      },
      { 
        path: '/post',
        component: () => import('pages/PagePost.vue'),
        name: 'Post'
      },
      { 
        path: '/login',
        component: () => import('pages/PageLogin.vue'),
        name: 'Login',
        beforeEnter: (to, from, next) => {
          if(store.state.user.loggedIn){
            return next({
              name: 'Home'
            })
          }
          next()
        }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]
console.log("hhhhhhhhhhh")
console.log(store.state.user.loggedIn)


export default routes
