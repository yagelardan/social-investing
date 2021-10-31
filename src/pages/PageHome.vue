<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height" id="center_page" @scroll="onScroll"> 
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            v-model="newQweetContent"
            class="new-qweet"
            placeholder="What's happening?"
            maxlength="280"
            bottom-slots
            counter
            autogrow
          >
          
            <template v-slot:before>
              <q-avatar size="xl">
                
                <img :src="user.profile_pic">
              </q-avatar>
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            @click="addNewQweet"
            :disable="!newQweetContent"
            class="q-mb-lg"
            color="primary"
            label="Qweet"
            rounded
            unelevated
            no-caps
          />
        </div>
      </div>

      <q-separator
        class="divider"
        color="grey-2"
        size="10px"
      />

      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item
            v-for="qweet in qweets"
            :key="qweet.id"
            class="qweet q-py-md"
          >
            <q-item-section avatar top>
              <q-avatar size="xl">
                
                <img :src="qweet.profile_pic">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1">
                <strong>{{qweet.user_name}} </strong>
                <span class="text-grey-7">
                  {{qweet.user_at}}
                  <br class="lt-md">&bull; {{ qweet.date | relativeDate }}
                </span>

              </q-item-label>
              
              <q-item-label class="qweet-content text-body1">{{ qweet.content }}</q-item-label>
              <div class="qweet-icons row justify-start q-mt-sm">

                <div class="col-4">
                <q-btn 
                  @click="toggleLiked(qweet)"
                  :color="qweet.liked ? 'pink' : 'grey'"
                  :icon="qweet.liked ? 'fas fa-heart' : 'far fa-heart'"
                  size="sm"
                  flat
                  round
                />
                </div>
                <div class="col-4">
                  <q-btn class=""
                    color="grey"
                    icon="far fa-comment"
                    size="sm"
                    flat
                    :label="hi(qweet)"
                    round
                    to=""
                    @click="goToPostPage(qweet)"
                  />
                </div>
                <div class="col-4">
                <q-btn v-if="does_current_user(qweet.user_id)"
                  @click="deleteQweet(qweet)"
                  color="grey"
                  icon="fas fa-trash"
                  size="sm"
                  flat
                  round
                />
              </div>
                
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import db from 'src/boot/firebase'
import { store } from '../store/store'
import { formatDistance } from 'date-fns'


export default {
  name: 'PageHome',
  data() {
    return {
      user: this.get_user(),
      //profile_pic: store.state.user.profile_pic,
      //profile_pic: this.get_profile_pic(this.user_id),
      newQweetContent: '',
      qweets: [
        // {
        //   id: 'ID1',
        //   content: 'Be your own hero, its cheaper than a movie ticket.',
        //   date: 1611653238221,
        //   liked: false
        // },
        // {
        //   id: 'ID2',
        //   content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat justo id viverra consequat. Integer feugiat lorem faucibus est ornare scelerisque. Donec tempus, nunc vitae semper sagittis, odio magna semper ipsum, et laoreet sapien mauris vitae arcu.',
        //   date: 1611653252444,
        //   liked: true
        // },
      ]
    }
  },
  methods: {
    hi(qw){

      return "2"
    },
    does_current_user(user_id){
      //console.log("jjjjjjjj")
      //console.log(user_id)
      //console.log(this.user.id)
        if(user_id == this.user.id){
          return true
        }
        return false
    },
    get_user(){
      var user = JSON.parse(this.$cookie.get('current-user'))
      return user;
    },
    /*
    get_profile_pic(user_id){
      console.log("hhhhhhhh")
      console.log("aaaaaa" + this.get_user_id())
      var docRef = db.collection("users").doc(user_id)
      console.log("iiiiiii")
      docRef.get().then((doc) => {
        console.log(doc.data)
      })
      console.log("jjjjjj")
      return ""
    },
    */
    addNewQweet() {
      console.log(this.user.id)
      let newQweet = {
        content: this.newQweetContent,
        user_id: this.user.id,
        date: Date.now(),
        liked: false,
      }
      // this.qweets.unshift(newQweet)
      db.collection('qweets').add(newQweet).then(function(docRef) {
        console.log('User document written with ID: ', docRef.id)
      }).catch(function(error) {
        console.error('Error adding document: ', error)
      })
      this.newQweetContent = ''
    },
    deleteQweet(qweet) {
      db.collection('qweets').doc(qweet.id).delete().then(function() {
        console.log('Document successfully deleted!');
      }).catch(function(error) {
        console.error('Error removing document: ', error);
      })
    },
    toggleLiked(qweet) {
      db.collection('qweets').doc(qweet.id).update({
        liked: !qweet.liked
      })
      .then(function() {
        console.log('Document successfully updated!')

      })
      .catch(function(error) {
        // The document probably doesn't exist.
        console.error('Error updating document: ', error)
      })

    },
    goToPostPage(qweet) {
      this.$router.push('/post/?id=' + qweet.id)
      //this.$router.push('/post/')
      //this.$router.push({ path: 'post', query: { id: qweet.id } })
      //this.$router.push({name: 'About', params: { postid: "11" }})
    },
    onScroll(){
      //console.log(window.scrollY)
      //console.log("scrolled")
      //let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
      //console.log(document.documentElement.scrollTop) 0
      //console.log(window.innerHeight) 306
      //alert(document.getElementById('app').scrollTop)
      
      //console.log(window.scrollY);
      //var position = document.getElementById('center_page').scrollHeight;
      //console.log(position)

      //console.log(document.documentElement.offsetHeight)
    }
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date())
    }
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll);

    db.collection('qweets').orderBy('date').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        let qweetChange = change.doc.data()
        qweetChange.profile_pic = ""
        qweetChange.id = change.doc.id
        //qweetChange.profile_pic = "https://i.pinimg.com/originals/bb/d3/f1/bbd3f101733f1a7d8bdc9c6b5aed7776.png"
        

        /*
        var post_user_doc = db.collection('users').doc(qweetChange.user_id)
        post_user_doc.get().then((doc) => {
            if (doc.exists) {
                console.log("Post user document data:", doc.data());
                qweetChange.profile_pic = post_user_doc.profile_pic
            } else {
                // doc.data() will be undefined in this case
                console.log("No such post user document! " + qweetChange.user_id);
                qweetChange.profile_pic = ""
            }
            console.log("aaaaaaa " + JSON.parse(post_user_doc))
            console.log("bbbbbbb1 " + JSON.stringify(post_user_doc)['profile_pic'])
        }).catch((error) => {
            console.log("Error getting document:", error);
            qweetChange.profile_pic = ""
        });
        */
       // retrieve a document
      db.collection('users').doc(qweetChange.user_id).get().then(snapshot => {
          const document = snapshot.data()
          //console.log("oooooooo")
          //console.log(document)
          if(1==1){ //(document.exists) {

              console.log(document.profile_pic)
              qweetChange.profile_pic = document.profile_pic
              qweetChange.user_name = document.firstname + ' ' + document.lastname;
              qweetChange.user_at = document.at
          }else{
              console.log("No such post user document! " + qweetChange.user_id);
              qweetChange.profile_pic = ""
          }
        }).catch((error) => {
            console.log("Error getting document:", error);
            qweetChange.profile_pic = ""
        });
        
        

        if (change.type === 'added') {
          //console.log('New qweet: ', qweetChange)
          this.qweets.unshift(qweetChange)
        }
        if (change.type === 'modified') {
          console.log('Modified qweet: ', qweetChange)
          let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id)
          Object.assign(this.qweets[index], qweetChange)
        }
        if (change.type === 'removed') {
          console.log('Removed qweet: ', qweetChange)
          let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id)
          this.qweets.splice(index, 1)
        }
      })
    })
  },
  beforeDestroy(){
    window.removeEventListener('scroll', this.onScroll)
  }
}
</script>

<style lang="sass">
.new-qweet
  textarea
    font-size: 19px
    line-height: 1.4 !important
.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4
.qweet:not(:first-child)
  border-top: 1px solid rgba(0, 0, 0, 0.12)
.qweet-content
  white-space: pre-line
.qweet-icons
  margin-left: -5px
</style>
