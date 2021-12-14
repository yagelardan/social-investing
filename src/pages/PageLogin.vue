<template>
  <div id="app">
      <button type="button" @click="login()" class="login-with-google-btn" >Sign in with Google</button>
  </div> 
</template>

<script>
import db from 'src/boot/firebase'
import { store } from '../store/store'
import axios from 'axios';

//import { el } from 'date-fns/locale';

export default {
  name: "App",
  data() {
    return {
    };
  },
  methods: {
    async get_google_user_details_by_accesstoken(access_token){
        let config = {
            headers:{
                'Accept': 'application/json'
            }
        }
        const google_user_details = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + access_token, config)
        return google_user_details.data
    },
    /*
    does_user_already_exist(user_id){
        var docRef = db.collection("users").doc(user_id);
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
    */
    register_or_login_user(user){
        var user_id = user.id;
       // var user_doc_id = login_source + '-' + user.userid;
        var docRef = db.collection("users").doc(user_id);
        //user['user_doc_id'] = user_doc_id
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("user already exists: " + user_id)
            } else {
                // doc.data() will be undefined in this case
                console.log("no such user, adding new user: " + user_id)
                db.collection('users').doc(user_id).set(user)
                //console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        //// change state, and to go home

        this.$cookie.set('current-user', JSON.stringify(user));
        store.commit('login');
        this.$router.push({name: 'Home'})
    },
    /*
    isGoogleLoggedin(){
        console.log("check is logged in")
        var is_logged_in = false;
        // todo: the function doesnt check the credentials to check wheter the auth is correct.
        // In order to fix this problem: 1. use the google auth to check every time.
        // 2. store the user id and access token in the db, and check if they the same.
        var currect_user_cookie = this.$cookie.get('current-user');
        if(currect_user_cookie){
            var currect_user_cookie_id = JSON.parse(this.$cookie.get('current-user')).user_doc_id;
            
            console.log("get(current-user)).login_hint")
            var currect_user_cookie_token = JSON.parse(this.$cookie.get('current-user')).login_hint;
            //if(JSON.parse(currect_user_cookie).user_doc_id == )
            console.log("currect_user_cookie_id")
            console.log(currect_user_cookie_id)
            console.log("currect_user_cookie_token")
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
        if(is_logged_in == true){
            console.log("user is logged in")
            //this.$cookie.set('current-user', JSON.stringify(user));
            store.commit('login');
            this.$router.push({name: 'Home'})
        }
        return is_logged_in
    },
    */

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
      this.accessToken = googleUser.getAuthResponse().access_token;

      var login_info = await this.get_google_user_details_by_accesstoken(this.accessToken);
      console.log("login info:")
      console.log(login_info)

      if(this.isLogin == true){
            const user = {
                login_source: "google",
                id: login_info.email, //login_info.id, //googleUser.ya,
                //login_hint: "", //googleUser.$b.login_hint,
                firstname: login_info.given_name,
                lastname: login_info.family_name,
                profile_pic: login_info.picture,
                mail: login_info.email,
                at: '@' + login_info.given_name + login_info.family_name,
            }
            store.state.user.profile_pic = login_info.picture
            //var login_source = "google"
            this.register_or_login_user(user);
      }
    },

  },
  beforeMount() {
      //this.isGoogleLoggedin()
        var currect_user_cookie = this.$cookie.get('current-user');
        //todo: not secured enough
        if(currect_user_cookie){
            store.commit('login');
            this.$router.push({name: 'Home'})
        }
      console.log("after beforemount")
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
  margin-top: 10em;
}

.login-with-google-btn {
  transition: background-color 0.3s, box-shadow 0.3s;
  padding: 9px 62px 12px 90px;
  border: none;
  border-radius: 3px;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.85);
  color: #757575;
  font-size: 14px;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=);
  background-color: white;
  background-repeat: no-repeat;
  background-position: 20px 11px;
}
.login-with-google-btn:hover {
  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.5);
}
.login-with-google-btn:active {
  background-color: #eeeeee;
}
.login-with-google-btn:focus {
  outline: none;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.75), 0 0 0 3px #c8dafc;
}
.login-with-google-btn:disabled {
  filter: grayscale(100%);
  background-color: #ebebeb;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.25);
  cursor: not-allowed;
}

</style>
