<template lang="pug">
  f7-page
    f7-navbar
      f7-nav-left(back-link="返回", back-link-url="/book/")
      f7-nav-title 全部座位
      f7-nav-right
    f7-block(v-for="room in building.buildingRooms", :key="room.roomId")
      f7-block-header {{ room.room }}
      f7-row
        f7-col(width="20", v-for="seat in room.roomSeats" :key="seat.id")
          f7-link(icon-only, icon-f7="home_fill", :class="seatClass(seat)")
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { LibrarySeat, LibraryBuilding } from '../../models/LibraryModel';

export default class BookByAll extends Vue {
  // @ts-ignore
  buildingID: string | number = 1;
  get building() {
    var buildingID = this.buildingID;
    return this.$sysparams.buildings.find(value => {
      console.log("Building ID:", value.buildingID);
      console.log("Selected ID:", buildingID);
      return value.buildingID == buildingID;
    })
  }
  seatClass(seat: LibrarySeat) {
    return {
      green: seat.status === "FREE",
      red: seat.status !== "FREE"
    }
  }
  beforeCreate() {
    console.log("BeforeCreate")
  }
}
</script>

