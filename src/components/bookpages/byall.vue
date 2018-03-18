<template lang="pug">
  f7-page
    f7-navbar
      f7-nav-left(back-link="返回", back-link-url="/book/")
      f7-nav-title 全部座位
      f7-nav-right
    template(v-for="room in building")
      f7-block-title {{ room.room }}
      f7-block
        f7-row
          f7-col(width="20", v-for="seat in room.roomSeats")
            f7-link(icon-only, icon-f7="home_fill", :class="seatClass(seat)")
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { LibrarySeat, LibraryBuilding } from '../../models/LibraryModel';

@Component
export default class BookByAll extends Vue {
  building: LibraryBuilding = this.$sysparams.buildings.find((value) => {
    return value.buildingID === 0;
  })
  seatClass(seat: LibrarySeat) {
    return {
      green: seat.status === "FREE",
      red: seat.status !== "FREE"
    }
  }
}
</script>

