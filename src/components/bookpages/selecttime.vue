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
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import axios,{ AxiosResponse } from 'axios'
import { LibrarySeat, LibrarySeatTime } from '../../models/LibraryModel';
import { RestResponse } from '../../models/RestResponse';

@Component<SelectTime>({
  watch: {
    startTime: async function (newValue:string) {
      this.endTimeList = await this.targetSeat.fetchEndTime(this.date, new LibrarySeatTime({
        id: newValue
      }))
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
  endTimeList: LibrarySeatTime[] = [];

  get startTimeList() {
    return this.targetSeat.startTimes;
  }

  async created() {
    this.date = this.params.bookDate;
    this.seatID = this.params.seatID;
    this.bookType = this.params.bookType;
    this.buildingID = this.query.buildingID;
    this.roomID = this.query.roomID;
  }

  async mounted() {
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
    }
    this.targetSeat = seat;
  }

  async submit() {
    switch (this.bookType) {
      case "new":
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
              cancelTimeout: 2000
            });
          }
        } catch (error) {
          this.$f7.toast.create({
            text: `预约失败: ${error}`,
            position: "center",
            cancelTimeout: 2000
          });
        }
        break;
      default:
        break;
    }
  }
}
</script>
