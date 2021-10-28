//import { store } from 'quasar/wrappers'
import { store } from '../store/store'

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

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
            //console.log("uuuuuuu")
            //console.log(getCookie("current-user"))
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
        name: 'Post',
        beforeEnter: (to, from, next) => {
          next()
        }
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



export default routes
