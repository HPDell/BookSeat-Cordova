<template lang="pug">
  f7-page
    f7-navbar
      f7-nav-left(back-link="返回", back-link-url="/book/")
      f7-nav-title 全部座位
      f7-nav-right
    div(v-for="room in building.buildingRooms", :key="room.roomId")
      f7-block-title {{ room.room }}
      f7-block
        f7-row
          f7-col.text-align-center(width="20", v-for="seat in room.roomSeats" :key="seat.id")
            f7-link(icon-only, icon-f7="home_fill", :class='{"color-green": seat.status === "FREE","color-red": seat.status !== "FREE"}')
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
  get building() {
    var buildingID = this.buildingID;
    return this.$sysparams.buildings.find(value => {
      return value.buildingID == buildingID;
    })
  }
  /**
   * 获取房间数据
   * @param buildingID 场馆ID
   */
  async fetchRooms(buildingID: number): Promise<Array<LibraryRoom>> {
    try {
      var room_rest: AxiosResponse<RestResponse<Array<LibraryRoomData>>> = await axios({
        url: `/rest/v2/room/stats2/${buildingID}/`,
        method: "GET"
      })
      if (room_rest.status === 200 && room_rest.data.status == "success") {
        if (room_rest.data.data && room_rest.data.data.length > 0) {
          return room_rest.data.data.map(value => {
            return new LibraryRoom(value);
          });
        } else {
          throw "服务器已响应，但无返回值";
        }
      } else {
        throw "服务器返回错误";
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取座位
   * @param roodId 房间号
   * @param bookDate 预定日期
   */
  async fetchSeat(roomId: number, bookDate: string) {
    try {
      var seat_rest: AxiosResponse<RestResponse<LayoutByDateData>> = await axios({
        url: `/rest/v2/room/layoutByDate/${roomId}/${bookDate}/`,
        method: "GET"
      })
      if (seat_rest.status === 200 && seat_rest.data.status === "success") {
        if (seat_rest.data.data) {
          var layout = seat_rest.data.data.layout;
          var seats = new Array<LibrarySeat>();
          for (const key in layout) {
            if (layout.hasOwnProperty(key)) {
              const element = layout[key];
              if (key == "1") { console.log("Layout element: ", JSON.stringify(element)); }
              if (element.type == "seat" && element.status == "FREE") {
                seats.push(new LibrarySeat(element));
              }
            }
          }
          return seats;
        } else {
          throw "服务器已成功响应，但没有返回数据"
        }
      }
    } catch (error) {
      throw "服务器无响应"
    }
  }
  /**
   * 挂载之前的生命周期钩子
   */
  async mounted() {
    // Show preloader with toast;
    var preloaderToast = this.$f7.toast.create({
      icon: '<div class="preloader" />',
      text: "正在加载数据",
      position: 'center'
    })
    preloaderToast.open();
    // Fetch data.
    var buildingID = this.buildingID;
    var bookDate = this.bookDate;
    if (!(this.building.buildingRooms && this.building.buildingRooms.length > 0)) {
      // 请求服务器获取数据
      try {
        this.building.buildingRooms = await this.fetchRooms(parseInt(buildingID.toString()));
        for (let i = 0; i < this.building.buildingRooms.length; i++) {
          const room = this.building.buildingRooms[i];
          try {
            room.roomSeats = await this.fetchSeat(room.roomId, bookDate);
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

