<template lang="pug">
  div
    f7-list(form, inline-labels)
      f7-list-item(smart-select, title="场馆", :smart-select-params="{'openIn': 'sheet'}")
        select(name="buildingID" v-model="buildingID")
          option(v-for="building in buildingList" :value="building.buildingID" :key="building.buildingID") {{ building.buildingName }}
      f7-list-item(smart-select, title="房间", :smart-select-params="{'openIn': 'sheet'}")
        select(name="roomID" v-model="roomID")
          option(v-for="room in roomList" :value="room.roomId" :key="room.roomId") {{ room.room }}
      f7-list-item(smart-select, title="座位", :smart-select-params="{'openIn': 'sheet'}")
        select(name="seatID" v-model="seatID")
          option(v-for="seat in seatList" :value="seat.id" :key="seat.id") {{ seat.name }}
      f7-list-item(smart-select, title="日期", :smart-select-params="{'openIn': 'sheet'}")
        select(name="bookDate" v-model="bookDate")
          option(v-for="date in avalibleDates" :value="date" :key="date") {{ date }}
      f7-list-item(smart-select, title="开始时间", :smart-select-params="{'openIn': 'sheet'}")
        select(name="startTime" v-model="startTime")
          option(v-for="start in avalibleStartTimes" :value="start.id" :key="start.id") {{ start.value }}
      f7-list-item(smart-select, title="结束时间", :smart-select-params="{'openIn': 'sheet'}")
        select(name="endTime" v-model="endTime")
          option(v-for="end in avalibleEndTimes" :value="end.id" :key="end.id") {{ end.value }}
      f7-list-button(title="预定", @click="autoBookSeats")
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import axios, {AxiosResponse} from 'axios';
import { RestResponse } from '../models/RestResponse';
import { BuildingFilterData, LibraryBuilding, LibrarySeatTime, LibraryRoom, LibrarySeat } from '../models/LibraryModel';
import * as moment from 'moment';

@Component({
  watch: {
    buildingID: async function (newValue:string) {
      var buildingID = this.buildingID;
      var building: LibraryBuilding = this.buildingList.find(value => {
        return value.buildingID == buildingID;
      });
      if (building) {
        if (!(building.buildingRooms && building.buildingRooms.length > 0)) {
          await building.fetchRooms();
        }
        this.roomList = building.buildingRooms;
      }
    },
    roomID: async function (newValue:string) {
      var roomID = this.roomID;
      var room: LibraryRoom = this.roomList.find(value => {
        return value.roomId == roomID
      });
      if (room) {
        if (!(room.roomSeats && room.roomSeats.length > 0)) {
          await room.fetchSeats(this.today);
        }
        this.seatList = room.roomSeats;
      }
    }
  }
})
export default class AutoBook extends Vue {
  buildingID: string | number = "";
  roomID: string | number = "";
  seatID: string | number = "";
  bookDate: string | number = "";
  startTime: string | number = "";
  endTime: string | number = "";

  today = moment().format("YYYY-MM-DD");
  schedule = moment().hour(22).minute(15).second(0).millisecond(500);
  
  buildingList: LibraryBuilding[] = [];
  roomList: LibraryRoom[] = [];
  seatList: LibrarySeat[] = [];
  get avalibleDates() {
    return [
      moment().add(1, 'd').format("YYYY-MM-DD")
    ]
  }
  get avalibleStartTimes() {
    var startTimes: Array<LibrarySeatTime> = [];
    var hour = moment().hour();
    for (let i = 8; i < 22 ; i++) {
      for (let j = 0; j < 60; j += 30) {
        startTimes.push(new LibrarySeatTime({
          hour: i,
          minute: j
        }))
      }
    }
    return startTimes;
  }
  get avalibleEndTimes() {
    var endTimes: Array<LibrarySeatTime> = [];
    var hour = moment().hour();
    for (let i = 8; i < 22 ; i++) {
      for (let j = 0; j < 60; j += 30) {
        endTimes.push(new LibrarySeatTime({
          hour: i,
          minute: j
        }))
      }
    }
    endTimes.push(new LibrarySeatTime({
      hour: 22,
      minute: 0
    }));
    return endTimes.slice(1);
  }

  /**
   * 获取场馆
   */
  async fetchBuildings() {
    try {
      var buildings_rest: AxiosResponse<RestResponse<BuildingFilterData>> = await axios({
        url: "rest/v2/free/filters"
      });
      if (buildings_rest.data.status == "success") {
        this.$sysparams.buildings = buildings_rest.data.data.buildings.map((value) => {
          return new LibraryBuilding(value);
        })
        this.buildingList = this.$sysparams.buildings;
      } else {
        throw "服务器返回错误";
      }
    } catch (error) {
      // @ts-ignore
      this.$f7.toast.create({
        text: "获取场馆数据失败：" + error,
        position: "center" ,
        closeTimeout: 2000
      }).open();
    }
  }

  async bookSeat() {
    try {
      var book_rest: AxiosResponse<RestResponse<any>> = await axios({
        url: "/rest/v2/freeBook",
        method: "POST",
        data: `"t=1&startTime=${this.startTime == "now" ? -1 : this.startTime}&endTime=${this.endTime}&seat=${this.seatID}&date=${this.bookDate}&t2=2"`
      })
      if (book_rest.status == 200 && book_rest.data.status == "success") {
        var toast = this.$f7.toast.create({
          text: `已成功预约`,
          position: "center"
        })
        toast.open();
        await this.$delay(2000);
        toast.close();
        this.$f7router.navigate("/")
      } else {
        this.$f7.toast.create({
          text: `预约失败: ${book_rest.data.message}`,
          position: "center",
          closeTimeout: 2000
        }).open();
      }
    } catch (error) {
      this.$f7.toast.create({
        text: `预约失败: ${error}`,
        position: "center",
        closeTimeout: 2000
      }).open();
    }
  }

  async autoBookSeats() {
    var progress = 0;
    var dialog = this.$f7.dialog.progress("等待开始", 0);
    var now = moment();
    this.schedule = moment().hour(22).minute(15).second(0).millisecond(0);
    if (now.isBefore(this.schedule)) {
      var diff = Math.ceil(this.schedule.diff(now) / 1000);
      dialog.setText(diff + "s");
      for (let i = 1; i <= diff; i++) {
        await this.$delay(1000);
        dialog.setText(diff - i + "s");
        dialog.setProgress(i / diff * 100);
      }
      this.$f7.dialog.close();
    }
    // await this.$delay(this.schedule.diff(now));
    this.bookSeat();
  }

  async mounted() {
    var now  = moment();
    this.schedule = moment().hour(22).minute(15).second(0).millisecond(500);
    if (this.schedule.isBefore(now)) {
      this.$f7.toast.create({
        text: "已过抢座时间",
        position: "center",
        closeTimeout: 2000
      }).open();
    }
    await this.fetchBuildings();
  }
}

</script>
