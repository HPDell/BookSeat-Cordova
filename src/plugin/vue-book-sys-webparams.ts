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
    this.userID = "";
    this.userName = "";
    this.userPassword = "";
    this.host = "seat.lib.whu.edu.cn";
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