import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);


export const store = new Vuex.Store({
    state: {
        count: 0,
        user: {
            user_id: '',
            //profile_pic, 
            loggedIn: false,
            isSubscribed: false
        }
    },
    mutations: {
        increase(state) {
            state.count++;
        },
        login(state){
            state.user.loggedIn = true;
        },

        logout(state){
            state.user.loggedIn = false;
        }
    }
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