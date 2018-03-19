<template lang="pug">
  f7-page
    f7-navbar(:title="title")
    f7-toolbar(tabbar, labels, bottom-md)
      f7-link(href="/", text="我的", icon-f7="person", tab-link-active, route-tab-id="home", tab-link, @click="title = '我的信息'")
      f7-link(href="/book/?bookType=new", text="预约", icon-f7="search", route-tab-id="book", tab-link, @click="title = '预约座位'")
      f7-link(href="/auto/", text="抢座", icon-f7="clock", route-tab-id="auto", tab-link)
    f7-tabs(routable)
      f7-tab#home(tab-active)
      f7-tab#book
      f7-tab#auto
</template>

<script lang="ts">
import Vue from 'vue'
import HomePage from './home.vue'
import BookPage from './book.vue'
import axios from 'axios'

export default Vue.extend({
  name: "Layout",
  components: {
    'home-page': HomePage,
    'book-page': BookPage
  },
  data() {
    return {
      bookType: "new",
      title: "我的信息"
    }
  },
  beforeCreate() {
    if (!this.$sysparams.token || this.$sysparams.token == "") {
      this.$f7router.navigate('/login/', {
        history: false
      })
    }
  }
})
</script>