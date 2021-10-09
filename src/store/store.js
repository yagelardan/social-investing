import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);


export const store = new Vuex.Store({
    state: {
        user: {
            loggedIn: false,
            isSubscribed: false
        }
    },
})

/*
    getters: {
        auth(state) {
            return state.user
        }
    }
  })
 
export const store = new Vuex.Store({
    state: {
        product:[]
    }
})
*/