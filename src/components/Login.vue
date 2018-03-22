<template>
  <f7-page id="login-page">
    <f7-login-screen-title>自习助手的助手</f7-login-screen-title>
    <f7-list form inset inline-labels form-store-data>
      <f7-list-item>
        <f7-label>ID</f7-label>
        <f7-input type="text" placeholder="请输入ID号" :value="userID" @input="userID = $event.target.value"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>密码</f7-label>
        <f7-input type="password" placeholder="请输入密码" :value="userPassword" @input="userPassword = $event.target.value"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>服务器地址</f7-label>
        <f7-input type="text" placeholder="地址" :value="host" @input="host = $event.target.value"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <span slot="title">记住该地址</span>
        <f7-toggle slot="after" type="text" name="remember" value="remember" :checked="remember" @change="remember = $event.target.checked"></f7-toggle>
      </f7-list-item>
    </f7-list>
    <f7-list inset>
      <f7-list-button @click="login">登录</f7-list-button>
      <!-- <f7-list-button @click="test">测试</f7-list-button> -->
    </f7-list>
  </f7-page>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import axios from 'axios';
import { RestResponse } from '../models/RestResponse';
import { LoginData } from "../models/LoginData";
import * as moment from 'moment';

@Component
export default class Login extends Vue {
  userID: string = this.$sysparams.userID;
  userPassword: string = this.$sysparams.userPassword;
  host: string = localStorage.host || this.$sysparams.host;
  vm: Vue;
  remember: boolean = true;

  /**
   * 登录
   */
  login(): void {
    console.log(JSON.stringify(this.$sysparams))
    if (!this.$sysparams) {
      return;
    }
    // 显示加载符
    this.$f7.preloader.show();
    axios({
      method: "GET",
      url: `https://${this.host}:8443/rest/auth`,
      params: {
        username: this.userID,
        password: this.userPassword
      }
    }).then(response => {
      this.$f7.preloader.hide();
      var body: RestResponse<LoginData> = response.data;
      console.log(body);
      if (body.status == "success") {
        // Save parameters.
        this.$sysparams.token = body.data.token;
        this.$sysparams.userID = this.userID;
        this.$sysparams.userPassword = this.userPassword;
        this.$sysparams.host = this.host;
        this.$sysparams.token = body.data.token;
        // Store datas.
        localStorage.setItem("host", this.host);
        localStorage.setItem("userID", this.userID);
        localStorage.setItem("userPassword", this.userPassword);
        // Set axios defaults.
        axios.defaults.baseURL = `https://${this.$sysparams.host}:8443/`;
        axios.defaults.headers.common['token'] = this.$sysparams.token;
        // @ts-ignore
        this.$f7router.navigate("/", {
          history: false
        });
      } else {
        this.$f7.toast.create({
          text: "登录失败：" + body.message,
          position: "center",
          closeTimeout: 2000
        }).open();
      }
    }).catch(reason => {
      this.$f7.preloader.hide();
      this.$f7.toast.create({
        text: "无法连接到服务器：" + reason,
        position: "center",
        closeTimeout: 2000
      }).open();
    })
  }

  /**
   * 是否记住服务器地址
   * @param remember 是否记住
   */
  rememberChanged(remember: Boolean) {
    console.log(`是否记住：${remember}`)
  }

  async test() {
    var progress = 0;
    var dialog = this.$f7.dialog.progress("等待开始", 0);
    var now = moment();
    var schedule = moment().add(1, 'm').second(0).millisecond(0);
    console.log("now", now.format("hh:mm:ss"))
    console.log("schedule", schedule.format("hh:mm:ss"))
    var diff = Math.ceil(schedule.diff(now) / 1000);
    dialog.setText(diff + " s");
    for (let i = 1; i <= diff; i++) {
      await this.$delay(1000);
      dialog.setText(diff - i + "s");
      dialog.setProgress(i / diff * 100);
    }
    this.$f7.dialog.close();
  }
}
</script>

<style scoped>
#login-page {
  padding: 40px 0px;
}
</style>
