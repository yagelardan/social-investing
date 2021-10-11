<template>
  <div id="app">
      {{ isGoogleLoggedin() }}
    <button @click="login()">Login</button>
    Is login: ? {{ isLogin }}
    <button @click="logOut()">LogOut</button>
  </div>
</template>

<script>
import db from 'src/boot/firebase'
import { store } from '../store/store'
import { el } from 'date-fns/locale';

export default {
  name: "App",
  data() {
    return {
      isLogin: this.isGoogleLoggedin(),
    };
  },
  methods: {
    registerUser(user){
      //let newUser = {
      //  name: user_name,
      //  date: Date.now()
      //}
      // this.qweets.unshift(newQweet)
      db.collection('users').add(user).then(function(docRef) {
        console.log('Document written with ID: ', docRef.id)
      }).catch(function(error) {
        console.error('Error adding document: ', error)
      })

    },
    isGoogleLoggedin(){
        console.log("check is logged in")

        // todo: the function doesnt check the credentials to check wheter the auth is correct.
        // In order to fix this problem: 1. use the google auth to check every time.
        // 2. store the user id and access token in the db, and check if they the same.
        if(store.state.user.loggedIn == true){
            return true;
        }
        else{
            return false;
        }
        /*
        try{
            var gogUser = JSON.parse(this.$cookie.get('googleUser'));
            console.log("gogUser");
            console.log(gogUser);
            const gogUserId = gogUser.ya;
            const gogUserAccessToken = gogUser.$b.access_token;
            if(gogUserId.length > 10 && gogUserAccessToken.length >10){
                // not really checked if logged in correctly.
                store.state.user.loggedIn = true; //check
                store.state.user.user_id = gogUserId;
                store.state.user.profile_pic = gogUser.it.kK;
                //next()
                console.log("user logged in");
                
                return true;
            }
            
        }catch(error){
            return false;
        }
        console.log("user not logged in");
        return false;
        */
    },

    async logOut() {
      const result = await this.$gAuth.signOut();
      this.isLogin = false;
      this.$cookie.delete('googleUser');
      console.log(`result`, result);
    },
    async login() {
      const googleUser = await this.$gAuth.signIn();
      console.log("googleUser", googleUser);
      this.$cookie.set('googleUser', JSON.stringify(googleUser));
      console.log("getId", googleUser.getId());
      console.log("getBaseProfile", googleUser.getBasicProfile());
      console.log("getAuthResponse", googleUser.getAuthResponse());
      console.log(
        "getAuthResponse$G",
        this.$gAuth.GoogleAuth.currentUser.get().getAuthResponse()
      );
      this.isLogin = this.$gAuth.isAuthorized;
      if(this.isLogin == true){
            const user = {
                login_source: "google",
                userid: googleUser.ya,
                id_token: googleUser.$b.id_token,
                firstname: googleUser.it.HU,
                lastname: googleUser.it.YS,
                profile_pic: googleUser.it.kK,
                mail: googleUser.it.Tt,
            }
            //!is_user_already_exist(login_source, user_id) => create user
            
            this.registerUser(user)
            //store.commit('login')

            //// change state, and to go home
            //store.state.user.loggedIn = true; 
            store.commit('login');
            this.$router.push({name: 'Home'})
      }

    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
