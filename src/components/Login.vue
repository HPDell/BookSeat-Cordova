<template>
  <f7-page>
    <f7-navbar>
      <f7-nav-left></f7-nav-left>
      <f7-nav-title>登录</f7-nav-title>
      <f7-nav-right></f7-nav-right>
    </f7-navbar>
    <f7-list form>
      <f7-list-item>
        <f7-label>ID</f7-label>
        <f7-input type="text" placeholder="请输入ID号" :value="userID" @input="userID = $event.target.value"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>密码</f7-label>
        <f7-input type="password" placeholder="请输入密码" :value="userPassword" @input="userPassword = $event.target.value"></f7-input>
      </f7-list-item>
    </f7-list>
    <f7-list>
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
        router.push("/");
      } else {
        app.toast.create({
          text: "登录失败：" + body.message,
          positon: "top",
          closeTimeout: 2000
        })
      }
    }).catch(reason => {
      app.preloader.hide();
      app.toast.create({
        text: "无法连接到服务器",
        positon: "top",
        closeTimeout: 2000
      })
    })
  }
}
</script>
