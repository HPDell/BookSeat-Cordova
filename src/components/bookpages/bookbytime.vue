<template lang="pug">
  f7-page
    f7-navbar
      f7-nav-left(back-link="返回", back-link-url="/book/")
      f7-nav-title 全部座位
      f7-nav-right
    f7-list(from)
      f7-list-item(smart-select, title="开始时间", :smart-select-params="{data-open-in: 'sheet'")
        select(name="startTime" v-model="startTime")
          option(v-for="start in startTimeList" :value="start.id" :key="start.id") {{ start.value }}
      f7-list-item(smart-select, title="结束时间", :smart-select-params="{data-open-in: 'sheet'")
        select(name="endTime" v-model="endTime")
          option(v-for="end in endTimeList" :value="end.id" :key="end.id") {{ end.value }}
      f7-list-button(title="查询")
    f7-block-title 座位列表
    f7-block(strong, v-for="room in selectedRoomsSeats", :key="room.roomId")
      f7-block-header {{ room.room }}
      f7-row
        f7-col(v-for="seat in roomAvalibleList(room)", :key="seat.id", width="20")
          f7-link(icon-only, icon-f7="home_fill", class="color-green")
          p.no-margin {{ seat.name }}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { LibrarySeat, LibraryBuilding, LibraryRoom, LibraryRoomData, LibrarySeatTime } from '../../models/LibraryModel';
import axios,{ AxiosResponse, AxiosProxyConfig, AxiosPromise } from 'axios'
import { RestResponse } from '../../models/RestResponse';
import { LayoutByDateData } from "../../models/LayoutByDateData";
import moment from 'moment';

@Component
export default class BookByAll extends Vue {
  buildingID: string | number = this.$f7route.params.buildingID;
  targetStartTime: string = "";
  targetEndTime: string = "";
  bookDate: string = this.$f7route.params.bookDate;
  selectedRoomsSeats: Array<LibraryRoom> = [];

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
   * 获取房间列表
   */
  get roomList() {
    return this.building.buildingRooms;
  }

  roomAvalibleList(room: LibraryRoom) {
    var startTime = this.targetStartTime;
    var endTime = this.endTimeList;
    var fullfillStartTime = room.roomSeats.filter((value, index) => {
      return value.startTimes.map(time => {
        return time.id
      }).findIndex(time => {
        return time === startTime;
      }) > -1;
    })
  }

  /**
   * 开始时间列表
   */
  get startTimeList() {
    var startTimes: Array<LibrarySeatTime> = [];
    var hour = moment().hour();
    for (let i = hour < 22 ? hour : 8; i < 22 ; i++) {
      for (let j = 0; j < 60; j += 30) {
        startTimes.push(new LibrarySeatTime({
          hour: i,
          minute: j
        }))
      }
    }
    return startTimes;
  }

  /**
   * 结束时间列表
   */
  get endTimeList() {
    return this.startTimeList.slice(1).concat([new LibrarySeatTime({
      hour: 22,
      minute: 0
    })]);
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