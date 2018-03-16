<template lang="pug">
  f7-page
    f7-tabs(routable)
      f7-tab#home(tab-active)
      f7-tab#book
      f7-tab#auto
    f7-toolbar(tabbar, labels, bottom-md)
      f7-link(tab-link="/", text="我的", icon-f7="person", tab-link-active, route-tab-id="home")
      f7-link(tab-link="/book/", text="预约", icon-f7="search", route-tab-id="book")
      f7-link(tab-link="/auto/", text="抢座", icon-f7="clock", route-tab-id="auto")
</template>

<script lang="ts">
import Vue from 'vue'
import HomePage from './home.vue'
import BookPage from './book.vue'
import params from '../plugin/vue-book-sys-webparams'

export default Vue.extend({
  name: "Layout",
  components: {
    'home-page': HomePage,
    'book-page': BookPage
  },
  data() {
    return {
      bookType: "new"
    }
  },
  beforeMount() {
    if (params.userID == "") {
      // this.$f7router.navigate('/login/')
    }
  }
})
</script>
