<template>
  <q-page class="q-pa-lg">
    <h4 class="q-mt-none q-mb-md text-weight-bold">Logout Qwitter</h4>
    <div class="text-body1">
      <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sunt similique molestias dolore, ab libero eius? Voluptatum quaerat architecto ex blanditiis, perspiciatis dolor quisquam labore fuga repellendus minima! Maxime, provident est.</p>
      <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sunt similique molestias dolore, ab libero eius? Voluptatum quaerat architecto ex blanditiis, perspiciatis dolor quisquam labore fuga repellendus minima! Maxime, provident est.</p>
    </div>
  </q-page>
  
</template>

<script>
import { store } from '../store/store'



//const result = await this.$gAuth.signOut();
//this.isLogin = false;
//this.$cookie.delete('googleUser');
//////store.state.user.loggedIn = false;
//console.log('aaasdjkasljdslkjsal')
//console.log(`result`, result);

//store.commit('increase')
//console.log(store.state.count)
export default {
  name: 'Logout',
  data() {
    return {
      //isLogin: this.isGoogleLoggedin(),
      //a: this.logout(),
    };
  },
  methods: {
    logout(){
      store.commit('logout');
      console.log("aaaaa")
      console.log(store.state.user.loggedIn)

      this.$router.push({name: 'Login'})
      }
  }, 
  beforeMount(){
    //this.logout()
  }

}
</script>
