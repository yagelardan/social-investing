<template>
  <q-page class="q-pa-lg">
    <h4 class="q-mt-none q-mb-md text-weight-bold">About Qwitter</h4>
    <div class="text-body1">
      <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sunt similique molestias dolore, ab libero eius? Voluptatum quaerat architecto ex blanditiis, perspiciatis dolor quisquam labore fuga repellendus minima! Maxime, provident est.</p>
      <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sunt similique molestias dolore, ab libero eius? Voluptatum quaerat architecto ex blanditiis, perspiciatis dolor quisquam labore fuga repellendus minima! Maxime, provident est.</p>
    </div>
  </q-page>
</template>

<script>
//console.log(this.$route)
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const product = urlParams.get('post')
console.log("aaaaa")
console.log(this.$route.query.page)


export default {
  name: 'PageAbout'
}
</script>
