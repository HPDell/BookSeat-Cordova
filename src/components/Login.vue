<template>
  <f7-page style="padding: 40px 0px;">
    <f7-login-screen-title>自习助手的助手</f7-login-screen-title>
    <f7-list form inset>
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
    </f7-list>
    <f7-list inset>
      <f7-list-button @click="login">登录</f7-list-button>
    </f7-list>
  </f7-page>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import router from '../router';
import params from '../plugin/vue-book-sys-webparams';
import Framework7 from 'framework7/dist/framework7.esm.bundle.js';
import axios from 'axios';
import { RestResponse } from '../models/RestResponse';
import { LoginData } from "../models/LoginData";

@Component
export default class Login extends Vue {
  userID: string = "";
  userPassword: string = "";
  host: string = params.host;
  vm: Vue;
  login(): void {
    // 显示加载符
    var app = new Framework7();
    app.preloader.show();
    axios({
      method: "GET",
      url: `http://${params.host}/rest/auth`,
      params: {
        username: this.userID,
        password: this.userPassword
      }
    }).then(response => {
      app.preloader.hide();
      var body: RestResponse<LoginData> = response.data;
      console.log(body);
      if (body.status == "success") {
        params.token = body.data.token;
        params.userID = this.userID;
        // params.userPassword = this.userPassword;
        // @ts-ignore
        this.$f7router.navigate("/");
      } else {
        app.toast.create({
          text: "登录失败：" + body.message,
          position: "top",
          closeTimeout: 2000
        }).open();
      }
    }).catch(reason => {
      app.preloader.hide();
      app.toast.create({
        text: "无法连接到服务器",
        position: "top",
        closeTimeout: 2000
      }).open();
    })
  }
}
</script>
