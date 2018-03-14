<template>
  <!-- App -->
  <div id="app">

    <!-- Statusbar -->
    <f7-statusbar></f7-statusbar>

    <!-- Main View -->
    <f7-view id="main-view" url="/" main></f7-view>

  </div>
</template>

<script>
import Layout from './components/Layout.vue'
export default {
  components: {
    'main-layout': Layout
  }
}
</script>
