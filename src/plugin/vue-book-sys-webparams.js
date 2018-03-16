import Vue from 'vue'

function VueBookSysWebParams(options) {
  this.token = "";
  this.userID = "";
  this.userName = "";
  this.userPassword = "";
  this.host = "seat.lib.whu.edu.cn";
  this.token = "";
  if (options) {
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        this[key] = options[key];
      }
    }
  }
  this.install = function () {
    Vue.sysParams = this;
  }
}

VueBookSysWebParams.prototype.setOption = function (options) {
  if (options) {
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        this[key] = options[key];
      }
    }
  }
}

export default new VueBookSysWebParams();