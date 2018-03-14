<template lang="pug">
  f7-page-content
    f7-navbar
      f7-nav-left
      f7-nav-title 我的信息
      f7-nav-right
    f7-list
      f7-list-item(title="基本信息", group-title)
      f7-list-item(title="学号", :after="user.userID")
      f7-list-item(title="姓名", :after="user.userName")
      f7-list-item(title="座位信息", group-title)
      f7-list-item(title="场馆", :after="user.building")
      f7-list-item(title="楼层", :after="user.floor")
      f7-list-item(title="房间", :after="user.room")
      f7-list-item(title="座位号", :after="user.seatID")
      f7-list-item(title="开始时间", :after="user.startTime")
      f7-list-item(title="结束时间", :after="user.endTime")
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HomePage extends Vue {
  user = {
    userID: "2014302590145",
    userName: "胡奕公"
  }
  seat = {
    building: "",
    floor: "",
    room: "",
    seatID: "",
    startTime: "",
    endTime: ""
  }
}
</script>
