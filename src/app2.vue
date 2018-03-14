<template lang="pug">
  #app
    f7-statusbar
    router-view(main)
</template>


<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: "app",
})
</script>
