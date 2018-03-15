<template lang="pug">
  f7-page
    f7-tabs
      f7-tab#home(tab-active)
        home-page
      f7-tab#book
        book-page(:bookType="bookType")
      f7-tab#auto
        book-page
    f7-toolbar(tabbar, labels, bottom-md)
      f7-link(tab-link="#home", text="我的", icon-f7="person", tab-link-active)
      f7-link(tab-link="#book", text="预约", icon-f7="search")
      f7-link(tab-link="#auto", text="抢座", icon-f7="clock")
</template>

<script lang="ts">
import Vue from 'vue'
import HomePage from './HomePage.vue'
import BookPage from './BookPage.vue'
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
