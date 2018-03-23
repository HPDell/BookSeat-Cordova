<template lang="pug">
  f7-page
    f7-navbar(title="选择时间", back-link="返回")
    f7-list
      f7-list-item(smart-select, title="开始时间", :smart-select-params="{'openIn': 'sheet'}")
        select(name="startTime" v-model="startTime")
          option(v-for="start in startTimeList" :value="start.id" :key="start.id") {{ start.value }}
      f7-list-item(smart-select, title="结束时间", :smart-select-params="{'openIn': 'sheet'}")
        select(name="endTime" v-model="endTime")
          option(v-for="end in endTimeList" :value="end.id" :key="end.id") {{ end.value }}
      f7-list-button(title="提交", @click="submit()")
      f7-block-footer(v-if="bookType == 'changeTime'") 改签所提供的时间是当日所有预约座位的合法时间，不是该座位的可用时间，座位是否可用需自行确认。
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import axios,{ AxiosResponse } from 'axios'
import { LibrarySeat, LibrarySeatTime, LibrarySeatData } from '../../models/LibraryModel';
import { RestResponse } from '../../models/RestResponse';
import * as moment from 'moment';

@Component<SelectTime>({
  watch: {
    startTime: async function (newValue:string) {
      if (this.bookType == "new") {
        this.endTimeList = await this.targetSeat.fetchEndTime(this.date, new LibrarySeatTime({
          id: newValue
        }))
      } else {
        
      }
    }
  }
})
export default class SelectTime extends Vue {
  params = this.$f7route.params;
  query = this.$f7route.query;
  bookType: string = "";
  startTime: string = "";
  endTime: string = "";
  date: string = "";
  buildingID: number = 0;
  roomID: number = 0;
  seatID: number = 0;
  targetSeat: any = {};
  startTimeList: LibrarySeatTime[] = [];
  endTimeList: LibrarySeatTime[] = [];

  async created() {
    this.date = this.params.bookDate;
    this.seatID = this.params.seatID;
    this.bookType = this.params.bookType;
    this.buildingID = this.query.buildingID;
    this.roomID = this.query.roomID;
  }

  createStartTimes() {
    var now = moment();
    var hour = now.hour();
    var minute = now.minute();
    var startTimeList: LibrarySeatTime[] = [];
    if (minute < 30) {
      startTimeList.push(new LibrarySeatTime({
        hour: hour,
        minute: 30
      }))
    }
    for (let h = hour + 1; h < 22; h++) {
      startTimeList.push(new LibrarySeatTime({
        hour: h,
        minute: 0
      }));
      startTimeList.push(new LibrarySeatTime({
        hour: h,
        minute: 30
      }));
      this.startTimeList = startTimeList;
    }
  }

  createEndTimes() {
    var endTimeList: LibrarySeatTime[] = this.startTimeList.map(value => {
      return new LibrarySeatTime(value);
    })
    endTimeList.push(new LibrarySeatTime({
      hour: 22,
      minute: 0
    }));
    this.endTimeList = endTimeList.slice(1);
  }

  async mounted() {
    if (this.bookType == "new") {
      // 获取座位数据
      var seatID = this.seatID;
      var buildingID = this.buildingID;
      var roomID = this.roomID;
      var seat = this.$sysparams.buildings.find(value => {
        return value.buildingID == buildingID;
      }).buildingRooms.find(value => {
        return value.roomId == roomID;
      }).roomSeats.find(value => {
        return value.id == seatID;
      });
      if (!(seat.startTimes && seat.startTimes.length > 0)) {
        await seat.fetchStartTime(this.date);
        this.startTimeList = seat.startTimes;
      }
      this.targetSeat = seat;
    } else if (this.bookType == "changeTime") {
      this.createStartTimes();
      this.createEndTimes();
    }
  }

  /**
   * 释放座位
   */
  async releaseSeat() {
    var url = this.query.status !== "ABSERVED" ? "/rest/v2/stop/" : `/rest/v2/cancel/${this.query.reservationID}/`
    axios({
      url: url,
      method: "GET"
    }).then(response => {
      var success = this.$f7.toast.create({
        text: "已取消预约",
        position: "center",
        closeTimeout: 2000
      }).open();
    }).catch(reason => {
      this.$f7.toast.create({
        text: "取消预约失败" + reason,
        position: "center" ,
        closeTimeout: 2000
      }).open();
    })
  }

  /**
   * 执行座位预定
   */
  async bookSeat() {
    try {
      var book_rest: AxiosResponse<RestResponse<any>> = await axios({
        url: "/rest/v2/freeBook",
        method: "POST",
        data: `"t=1&startTime=${this.startTime == "now" ? -1 : this.startTime}&endTime=${this.endTime}&seat=${this.seatID}&date=${this.date}&t2=2"`
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
        });
      }
    } catch (error) {
      this.$f7.toast.create({
        text: `预约失败: ${error}`,
        position: "center",
        closeTimeout: 2000
      });
    }
  }

  async submit() {
    switch (this.bookType) {
      case "chageTime":
        await this.releaseSeat();
      case "new":
        await this.bookSeat();
        break;
      default:
        break;
    }
  }
}
</script>
