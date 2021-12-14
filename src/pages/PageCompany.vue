<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
          <div class="row">
            <q-item-section avatar top>
              <q-avatar size="xl">
                <img :src="company.pic">
              </q-avatar>
            </q-item-section>
          </div>
          <div class="row">
            <q-item-section>
              <q-item-label class="text-subtitle1">
                <strong>{{company.name}}</strong>
                <span class="text-grey-7">
                  {{company.name}}
                  <!--<br class="lt-md">&bull; {{ get_post().date | relativeDate }}-->
                </span>
              </q-item-label>
              <q-item-label class="qweet-content text-body1">{{company.current_price}}</q-item-label>
            </q-item-section>
          </div>
            
        
      </div>

      <q-separator
        class="divider"
        color="grey-2"
        size="10px"
      />
    <!--
    <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            v-model="newQweetContent"
            class="new-qweet"
            placeholder="Share your opinion on the post"
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
            label="Post"
            rounded
            unelevated
            no-caps
          />
        </div>
    </div>
    -->
   
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
                
                <img :src="qweet.user.profile_pic">
              </q-avatar>
            </q-item-section>
            
            <q-item-section>
              <q-item-label class="text-subtitle1">
                <strong>{{qweet.user.name}}</strong>
                <span class="text-grey-7">
                  {{qweet.user.at}}
                  <!--<br class="lt-md">&bull; {{ qweet.date }} //| relativeDate }}-->
                </span>
              </q-item-label>
              <q-item-label class="qweet-content text-body1">{{ qweet.content }}</q-item-label>
              <div class="qweet-icons row justify-between q-mt-sm">
                <q-btn
                  color="grey"
                  icon="far fa-comment"
                  size="sm"
                  flat
                  round
                  @click="goToPostPage(qweet)"
                />
                <q-btn
                  color="grey"
                  icon="fas fa-retweet"
                  size="sm"
                  flat
                  round
                />
                <q-btn
                  @click="toggleLiked(qweet)"
                  :color="qweet.liked ? 'pink' : 'grey'"
                  :icon="qweet.liked ? 'fas fa-heart' : 'far fa-heart'"
                  size="sm"
                  flat
                  round
                />
                <q-btn
                  @click="deleteQweet(qweet)"
                  color="grey"
                  icon="fas fa-trash"
                  size="sm"
                  flat
                  round
                />
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
import { parse } from 'date-fns/esm'


export default {
  name: 'PageCompany',
  data() {
    //this.render_page()
    //var post = this.get_post_data()

    //this.render_page(post.id)
        var user = this.get_user()
        var company = this.get_company_data()
        this.company = company    
        //this.render_page(company.id)
    
    return {
      postuser: {id: "", name: "", at: "", profile_pic: ""},
      user: user,
      company: company,
      newQweetContent: '',
      qweets: [
        // {
        //   id: 'ID1',
        //   content: 'Be your own hero, its cheaper than a movie ticket.',
        //   date: 1611653238221,
        //   liked: false
        // },
      ]
    }
  },
  methods: {
    get_user(){
      var user = JSON.parse(this.$cookie.get('current-user'))
      return user;
    },
    addNewQweet() {
      let newQweet = {
        content: this.newQweetContent,
        user_id: this.user.id,
        date: Date.now(),
        //liked: false
      }
      // this.qweets.unshift(newQweet)
      db.collection('qweets').doc(this.post.id).collection('comments').add(newQweet).then(function(docRef) {
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
    },
    get_company_data(){
        var company = {id: "", name: "", user_id: "", current_price: "", pic: ""}
        company.id = this.$route.query.id
        db.collection('companies').doc(company.id).get().then(snapshot => {
            const document = snapshot.data()
            company.name = document.name;
            company.current_price = document.current_price;
            company.pic = document.company_pic;
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        return company
    },
    render_page(post_id){
        /*
        db.collection('qweets').doc(post_id).get().then(snapshot => {
            const document = snapshot.data()
            this.postuser.id = document.user_id
            db.collection('users').doc(this.postuser.id).get().then(snps => {
                    const doc = snps.data()
                    this.postuser.name = doc.firstname + ' ' + doc.lastname
                    this.postuser.at = doc.at
                    this.postuser.profile_pic = doc.profile_pic
            })
        })

        
        db.collection('qweets').doc(post_id).collection('comments').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                //console.log(change.doc.data())
                let commentChange = change.doc.data()
                
                commentChange.id = change.doc.id;
                
                commentChange.user = {id: "", name: "", profile_pic: ""}
                commentChange.user.id = change.doc.data().user_id

                db.collection('users').doc(commentChange.user.id).get().then(snps => {
                    const doc = snps.data()
                    commentChange.user.name = doc.firstname + ' ' + doc.lastname
                    commentChange.user.at = doc.at
                    commentChange.user.profile_pic = doc.profile_pic
                })

                if (change.type === 'added') {
                //console.log('New qweet: ', qweetChange)
                this.qweets.unshift(commentChange)
                }
                if (change.type === 'modified') {
                console.log('Modified qweet: ', commentChange)
                let index = this.qweets.findIndex(qweet => qweet.id === commentChange.id)
                Object.assign(this.qweets[index], commentChange)
                }
                if (change.type === 'removed') {
                console.log('Removed qweet: ', commentChange)
                let index = this.qweets.findIndex(qweet => qweet.id === commentChange.id)
                this.qweets.splice(index, 1)
                }
            })
        })
        */

    }
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date())
    }
  },

   beforeMount() {
       this.$watch(
           () =>  this.$route.query, //this.$route.query.id,
           (query) => {               
                this.qweets = []
                this.user = this.get_user()
                this.company = {}
                this.newQweetContent = ''
               //console.log("hiiiiii " + query.id);
                //this.render_page()
                var company = this.get_company_data()
                this.company = company    
                this.render_page(query.id)


           },
       )
       //this.$route.query.id
    /*
    db.collection('comments').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        let qweetChange = change.doc.data()
        qweetChange.profile_pic = ""
        qweetChange.id = change.doc.id
        //qweetChange.profile_pic = "https://i.pinimg.com/originals/bb/d3/f1/bbd3f101733f1a7d8bdc9c6b5aed7776.png"
        
        
       // retrieve a document
      db.collection('users').doc(qweetChange.user_id).get().then(snapshot => {
          const document = snapshot.data()
          if(1==1){ //(document.exists) {
              console.log(document.profile_pic)
              qweetChange.profile_pic = document.profile_pic
          }else{
              console.log("No such post user document! " + qweetChange.user_id);
              qweetChange.profile_pic = "https://i.pinimg.com/originals/bf/e5/fd/bfe5fd63c5124fbb3730c5b9e2d3bc01.png"
          }
        }).catch((error) => {
            console.log("Error getting document:", error);
            qweetChange.profile_pic = "https://i.pinimg.com/originals/bf/e5/fd/bfe5fd63c5124fbb3730c5b9e2d3bc01.png"
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
    */
  },
  beforeDestroy(){
      alert(1)
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