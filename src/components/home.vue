<template lang="pug">
  div
    f7-navbar
      f7-nav-left
      f7-nav-title 我的信息
      f7-nav-right
    f7-block-title 基本信息
    f7-list
      f7-list-item(title="学号", :after="user.userID")
      f7-list-item(title="姓名", :after="user.userName")
      f7-list-item(title="状态", :after="user.status")
    f7-block-title 座位信息
    f7-list(v-if="hasSeatInfo")
      f7-list-item(title="预约情况", :after="seat.status")
      f7-list-item(title="场馆", :after="seat.building")
      f7-list-item(title="楼层", :after="seat.floor")
      f7-list-item(title="房间", :after="seat.room")
      f7-list-item(title="座位号", :after="seat.seatNumber")
      f7-list-item(title="开始时间", :after="seat.startTime")
      f7-list-item(title="结束时间", :after="seat.endTime")
      f7-list-item(title="离馆时间", :after="seat.leaveTime" v-if="seat.leaveTime")
    f7-block(v-else) 无
    template(v-if="hasSeatInfo")
      f7-block-title 操作
      f7-list
        f7-list-button(title="释放")
        f7-list-button(title="改签")
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import axios from 'axios'
import { RestResponse } from "../models/RestResponse";
import { UserData } from "../models/UserData";
import { UserReservationData, UserReservation } from "../models/UserReservationData";

@Component
export default class HomePage extends Vue {
  user = {
    userID: this.$sysparams.userID,
    userName: this.$sysparams.userName,
    status: ""
  }
  seat = {
    building: "",
    floor: "",
    room: "",
    seatID: 0,
    seatNumber: 0,
    startTime: "",
    endTime: "",
    leaveTime: null
  }
  get hasSeatInfo() {
    return this.seat.seatID > 0
  }
  async beforeMount() {
    if (!(this.$sysparams.token && this.$sysparams.token != "")) {
      return;
    }
    // Fetch data.
    try {
      var user_response = await axios({
        url: "/rest/v2/user/",
        method: "GET"
      });
      var user_rest: RestResponse<UserData> = user_response.data;
      if (user_rest.status == "success") {
        this.user.userName = user_rest.data.name;
        this.user.status = user_rest.data.status;
      } else {
        throw "请求不正确";
      }
    } catch (error) {
      // @ts-ignore
      this.$f7.toast.create({
        text: "获取用户信息失败",
        position: "top",
        cancelTimeout: 2000
      })
    }
    try {
      var reservation_response = await axios({
        url: "/rest/v2/user/reservations",
        method: "GET"
      });
      var reservation_rest: RestResponse<Array<UserReservationData>> = reservation_response.data;
      if (reservation_rest.status == "success") {
        var reservation = new UserReservation(reservation_rest.data.pop());
        this.seat.building = reservation.building;
        this.seat.floor = reservation.floor + "层";
        this.seat.room = reservation.room;
        this.seat.seatID = reservation.seatId;
        this.seat.seatNumber = reservation.seatNumber;
        this.seat.startTime = reservation.begin;
        this.seat.endTime = reservation.end;
        this.seat.leaveTime = reservation.awayBegin;
      } else {
        throw "服务器返回错误"
      }
    } catch (error) {
      // @ts-ignore
      this.$f7.toast.create({
        text: "获取用户信息失败",
        position: "top",
        closeTimeout: 2000
      }).open();
    }
  }
}
</script>
