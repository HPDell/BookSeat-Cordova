<template lang="pug">
  f7-page
    f7-tabs
      f7-tab#home(tab-active)
        home-page
      f7-tab#book
        div
    f7-toolbar(tabbar, labels, bottom-md)
      f7-link(tab-link="#home", text="我的", icon-f7="person", tab-link-active)
      f7-link(tab-link="#book", text="预约", icon-f7="search")
</template>

<script lang="ts">
import Vue from 'vue'
import HomePage from './HomePage.vue'
export default Vue.extend({
  name: "Layout",
  components: {
    'home-page': HomePage
  },
  mounted: function () {
    
  }
})
</script>
