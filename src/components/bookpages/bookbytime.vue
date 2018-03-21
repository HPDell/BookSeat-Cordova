<template lang="pug">
  f7-page
    f7-navbar
      f7-nav-left(back-link="返回", back-link-url="/book/")
      f7-nav-title 全部座位
      f7-nav-right
    f7-list(from)
      f7-list-item(smart-select, title="开始时间", :smart-select-params="{'openIn': 'sheet'}")
        select(name="startTime" v-model="targetStartTime")
          option(v-for="start in startTimeList" :value="start.id" :key="start.id") {{ start.value }}
      f7-list-item(smart-select, title="结束时间", :smart-select-params="{'openIn': 'sheet'}")
        select(name="endTime" v-model="targetEndTime")
          option(v-for="end in endTimeList" :value="end.id" :key="end.id") {{ end.value }}
      f7-list-button(title="查询", @click="searchSeats")
    f7-block-title 座位列表
    f7-block(strong, v-for="room in selectedRoomsSeats", :key="room.roomId")
      f7-block-header {{ room.room }}
      f7-row
        f7-col(v-for="seat in room.roomSeats", :key="seat.id", width="20")
          f7-link(icon-only, icon-f7="home_fill", class="color-green", :href="getBookHref(room, seat)")
          p.no-margin {{ seat.name }}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { LibrarySeat, LibraryBuilding, LibraryRoom, LibraryRoomData, LibrarySeatTime } from '../../models/LibraryModel';
import axios,{ AxiosResponse, AxiosProxyConfig, AxiosPromise } from 'axios'
import { RestResponse } from '../../models/RestResponse';
import { LayoutByDateData } from "../../models/LayoutByDateData";
import * as moment from 'moment';

@Component
export default class BookByAll extends Vue {
  params: {
    bookType: string,
    buildingID: string,
    bookDate: string
  } = this.$f7route.params;
  query = this.$f7route.query;
  targetStartTime: string = "";
  targetEndTime: string = "";
  selectedRoomsSeats: Array<LibraryRoom> = [];
  bookDate: string = "";
  buildingID: string | number = "";

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
   * 获取预约链接
   * @param room 房间
   * @param seat 座位
   */
  getBookHref(room: LibraryRoom, seat: LibrarySeat) {
    var url = `/selecttime/${this.params.bookType}/${this.bookDate}/${seat.id}/?`
    switch (this.params.bookType) {
      case "change":
        url += `reserveID=${this.query.reserveID}&`
      case "new":
        url += `buildingID=${this.params.buildingID}&roomID=${room.roomId}&`
        break;
      default:
        break;
    }
    return url.substring(0, url.length - 2);
  }

  /**
   * 可选座位
   */
  avalibleSeats(room: LibraryRoom) {
    var startTime = this.targetStartTime;
    var endTime = this.targetEndTime;
    return room.roomSeats.filter(seat => {
      return seat.status === "FREE" && (seat.startTimes.findIndex(time => {
        return time.id == startTime
      }) > -1) && (seat.endTimes.findIndex(time => {
        return time.id == endTime
      }) > -1);
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
      this.$f7.dialog.preloader("正在加载数据")
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
        this.$f7.dialog.close();
      } catch (error) {
        this.$f7.dialog.close();
        this.$f7.toast.create({
          text: "获取房间信息失败：" + error,
          position: "top",
          cancelTimeout: 2000
        })
      }
    }
  }

  /***
   * 搜索座位
   */
  async searchSeats() {
    var building = this.building;
    var bookDate = this.bookDate;
    var targetStartTime = this.targetStartTime;
    console.log(targetStartTime);
    this.$f7.dialog.preloader("正在加载数据");
    for (const room of building.buildingRooms) {
      if (!(room.roomSeats && room.roomSeats.length > 0)) {
        try {
          await room.fetchSeats(bookDate);
        } catch (error) {
          console.log(error);
        }
      }
      for (const seat of room.roomSeats) {
        if (!(seat.startTimes && seat.startTimes.length > 0)) {
          try {
            await seat.fetchStartTime(bookDate);
          } catch (error) {
            console.log(error)
          }
        }
        try {
          // @ts-ignore
          seat.createEndTime(bookDate, {
            id: targetStartTime
          });
        } catch (error) {
          console.log(error)
        }
      }
    }
    var vm = this;
    this.selectedRoomsSeats = building.buildingRooms.map(value => {
      var newValue = new LibraryRoom(value);
      newValue.roomSeats = vm.avalibleSeats(value);
      return newValue;
    })
    this.$f7.dialog.close();
  }

  created() {
    this.bookDate = this.params.bookDate;
    this.buildingID = this.params.buildingID;
  }
}
</script>