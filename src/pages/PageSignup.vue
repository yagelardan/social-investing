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
//import { el } from 'date-fns/locale';

export default {
  name: "App",
  data() {
    return {
      isLogin: this.isGoogleLoggedin(),
    };
  },
  methods: {
    does_user_already_exist(user_doc_id){
        console.log(user_doc_id)
        var docRef = db.collection("users").doc(user_doc_id);
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                return true;
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                return false;
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
            return false;
        });
    },
    register_or_login_user(login_source, user){
        var user_doc_id = login_source + '-' + user.userid;
        var docRef = db.collection("users").doc(user_doc_id);
        user['user_doc_id'] = user_doc_id
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("user already exists: " + user_doc_id)
            } else {
                // doc.data() will be undefined in this case
                console.log("adding new user: " + user_doc_id)
                db.collection('users').doc(user_doc_id).set(user)
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        //// change state, and to go home

        
        this.$cookie.set('current-user', JSON.stringify(user));
        store.commit('login');
        this.$router.push({name: 'Home'})
    },
    isGoogleLoggedin(){
        console.log("check is logged in")
        var is_logged_in = false;
        // todo: the function doesnt check the credentials to check wheter the auth is correct.
        // In order to fix this problem: 1. use the google auth to check every time.
        // 2. store the user id and access token in the db, and check if they the same.
        var currect_user_cookie = this.$cookie.get('current-user');
        if(currect_user_cookie){
            var currect_user_cookie_id = JSON.parse(this.$cookie.get('current-user')).user_doc_id;
            var currect_user_cookie_token = JSON.parse(this.$cookie.get('current-user')).login_hint;
            //if(JSON.parse(currect_user_cookie).user_doc_id == )
            console.log(currect_user_cookie_id)
            console.log(currect_user_cookie_token)
            db.collection('users').doc(currect_user_cookie_id).get().then(snapshot => {
                const document = snapshot.data()
                console.log("whats upppp")
                console.log(document)
                if(document.login_hint == currect_user_cookie_token){
                    console.log("logged in successfully")
                    is_logged_in = true;
                    store.commit('login');
                    this.$router.push({name: 'Home'})
                    //return true;
                }
            }).catch((error) => {
                console.log("Error getting user document (for cookie):", error);
             });
        }else{
            console.log('there is no cookie for the user');
        }
        if(store.state.user.loggedIn == true){
            console.log("i like dogs")
            is_logged_in = true;
            //return true;
        }
        console.log("aaaa")
        console.log(is_logged_in)
        if(is_logged_in == true){
            console.log("hiii")
            this.$cookie.set('current-user', JSON.stringify(user));
            store.commit('login');
            this.$router.push({name: 'Home'})
        }
        return is_logged_in
    },

    async login() {
      const googleUser = await this.$gAuth.signIn();
      console.log("googleUser", googleUser);
      //this.$cookie.set('googleUser', JSON.stringify(googleUser));
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
                login_hint: googleUser.$b.login_hint,
                firstname: googleUser.it.HU,
                lastname: googleUser.it.YS,
                profile_pic: googleUser.it.kK,
                mail: googleUser.it.Tt,
            }
            store.state.user.profile_pic = googleUser.it.kK

            

            var login_source = "google"
            
            this.register_or_login_user(login_source, user);

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
