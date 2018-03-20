<template lang="pug">
  f7-page
    f7-navbar
      f7-nav-left(back-link="返回", back-link-url="/book/")
      f7-nav-title 全部座位
      f7-nav-right
    f7-block(v-for="room in building.buildingRooms" :key="room.roomId", strong)
      f7-block-header {{ room.room }}
      f7-row(no-gap)
        f7-col.text-align-center(width="20", v-for="seat in avalibleSeats(room)" :key="seat.id")
          f7-link(icon-only, icon-f7="home_fill", class="color-green")
          p.no-margin {{ seat.name }}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { LibrarySeat, LibraryBuilding, LibraryRoom, LibraryRoomData } from '../../models/LibraryModel';
import axios,{ AxiosResponse, AxiosProxyConfig, AxiosPromise } from 'axios'
import { RestResponse } from '../../models/RestResponse';
import { LayoutByDateData } from "../../models/LayoutByDateData";

@Component
export default class BookByAll extends Vue {
  buildingID: string | number = this.$f7route.params.buildingID;
  bookDate: string = this.$f7route.params.bookDate;

  /**
   * 获取场馆对象
   */
  get building() {
    var buildingID = this.buildingID;
    return this.$sysparams.buildings.find(value => {
      return value.buildingID == buildingID;
    })
  }

  /**
   * 可选座位
   */
  avalibleSeats(room: LibraryRoom) {
    return room.roomSeats.filter(value => {
      return value.status === "FREE"
    })
  }

  /**
   * 挂载之前的生命周期钩子
   */
  async mounted() {
    // Fetch data.
    var buildingID = this.buildingID;
    var bookDate = this.bookDate;
    if (!(this.building.buildingRooms && this.building.buildingRooms.length > 0)) {
      // Show preloader with toast;
      var preloaderToast = this.$f7.toast.create({
        icon: '<div class="preloader" />',
        text: "正在加载数据",
        position: 'center'
      })
      preloaderToast.open();
      // 请求服务器获取数据
      try {
        await this.building.fetchRooms();
        for (let i = 0; i < this.building.buildingRooms.length; i++) {
          const room = this.building.buildingRooms[i];
          try {
            if (!(room.roomSeats && room.roomSeats.length > 0)) {
              await room.fetchSeats(bookDate);
            }
          } catch (error) {
            this.$f7.toast.create({
              text: `获取${room.room}的座位信息失败：${error}`,
              position: "top",
              cancelTimeout: 2000
            })
          } finally {
            await this.$delay(500);
          }
        }
        preloaderToast.close();
      } catch (error) {
        this.$f7.toast.create({
          text: "获取房间信息失败：" + error,
          position: "top",
          cancelTimeout: 2000
        })
      }
    }
  }
}
</script>

