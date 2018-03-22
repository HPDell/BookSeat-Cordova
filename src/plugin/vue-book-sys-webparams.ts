import { LibraryBuilding } from "../models/LibraryModel";

export class VueBookSysWebParams {
  token: string;
  userID: string;
  userName: string;
  userPassword: string;
  host: string;
  buildings: Array<LibraryBuilding>;
  avalibleDates: Array<string>;
  constructor(options?) {
    this.token = "";
    this.userID = window.localStorage.getItem("userID");
    this.userName = "";
    this.userPassword = window.localStorage.getItem("userPassword");
    this.host = localStorage.getItem("host");
    this.buildings = new Array<LibraryBuilding>();
    this.avalibleDates = new Array<string>();
    if (options) {
      for (const key in options) {
        if (options.hasOwnProperty(key)) {
          this[key] = options[key];
        }
      }
    }
  }
  install(Vue, options) {
    // @ts-ignore
    Vue.prototype.$sysparams = new VueBookSysWebParams();
    Vue.prototype.$delay = function (timeout:number) {
      return new Promise((resolve => {
        setTimeout(() => {
          resolve();
        }, timeout);
      }))
    }
  }
  setOption(options) {
    if (options) {
      for (const key in options) {
        if (options.hasOwnProperty(key)) {
          this[key] = options[key];
        }
      }
    }
  }
}