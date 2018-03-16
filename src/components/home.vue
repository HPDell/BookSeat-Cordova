<template lang="pug">
  f7-page
    f7-navbar
      f7-nav-left
      f7-nav-title 我的信息
      f7-nav-right
    f7-block-title 基本信息
    f7-list
      f7-list-item(title="学号", :after="user.userID")
      f7-list-item(title="姓名", :after="user.userName")
    f7-block-title 座位信息
    f7-list
      f7-list-item(title="场馆", :after="user.building")
      f7-list-item(title="楼层", :after="user.floor")
      f7-list-item(title="房间", :after="user.room")
      f7-list-item(title="座位号", :after="user.seatID")
      f7-list-item(title="开始时间", :after="user.startTime")
      f7-list-item(title="结束时间", :after="user.endTime")
    f7-block-title 操作
    f7-list
      f7-list-button(title="释放")
      f7-list-button(title="改签")
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import Framework7 from 'framework7/dist/framework7.esm.bundle.js'
import params from '../plugin/vue-book-sys-webparams'

@Component
export default class HomePage extends Vue {
  user = {
    userID: params.userID,
    userName: params.userName
  }
  seat = {
    building: "",
    floor: "",
    room: "",
    seatID: "",
    startTime: "",
    endTime: ""
  }
  beforeCreate() {
    
  }
}
</script>
