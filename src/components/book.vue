<template lang="pug">
  div
    f7-block-title 选择场馆
    f7-list
      f7-list-item(v-for="building in buildings" :key="building.buildingID" :title="building.buildingName", radio, name="targetBuildingID", :value="building.buildingID", :checked="targetBuildingID == building.buildingID", @change="targetBuildingID = $event.target.value")
    f7-block-title 选择日期
    f7-list
      f7-list-item(v-for="(bookDate, index) in avalibleDates" :key="index" :title="bookDate", radio, name="bookDate", :value="bookDate", :checked="targetDate == bookDate" @change="targetDate = $event.target.value")
    f7-block-title 查询方式
    f7-list
        f7-list-item(title="全部", :link="getBookUrl('byall')")
        f7-list-item(title="按时段查询", :link="getBookUrl('bytime')")
        f7-list-item(title="按房间查询", :link="getBookUrl('byroom')")
</template>


<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { LibraryBuilding, BuildingFilterData } from "../models/LibraryModel";
import { RestResponse } from "../models/RestResponse";
import axios,{ AxiosResponse } from "axios";

@Component<BookPage>({
  watch: {
    buildings: function (newValue:Array<LibraryBuilding>) {
      this.$sysparams.buildings = newValue;
    },
    avalibleDates: function (newValue:Array<string>) {
      this.$sysparams.avalibleDates = newValue;
    }
  }
})
export default class BookPage extends Vue {
  targetBuildingID: number = -1;
  targetDate: string = "";
  buildings: Array<LibraryBuilding> = this.$sysparams.buildings;
  avalibleDates: Array<string> = this.$sysparams.avalibleDates;
  // @ts-ignore
  bookType: string = this.$f7router.currentRoute.query.bookType;
  /**
   * 获取预定页面链接
   * @param type 预定方式（预定或改签）
   * @param method 选择方法
   */
  getBookUrl(method) {
    // @ts-ignore
    return ['/book', this.bookType, method, this.targetBuildingID, this.targetDate, ""].join("/");
  }

  /**
   * 获取场馆
   */
  async fetchBuildings() {
    try {
      var buildings_rest: AxiosResponse<RestResponse<BuildingFilterData>> = await axios({
        url: "rest/v2/free/filters"
      });
      if (buildings_rest.data.status == "success") {
        this.buildings = buildings_rest.data.data.buildings.map((value) => {
          return new LibraryBuilding(value);
        })
        this.avalibleDates = buildings_rest.data.data.dates;
      } else {
        throw "服务器返回错误";
      }
    } catch (error) {
      // @ts-ignore
      this.$f7.toast.create({
        text: "获取场馆数据失败：" + error,
        position: "center" ,
        closeTimeout: 2000
      }).open();
    }
  }
  async mounted() {
    console.log("[book] bookType: ", this.bookType)
    if (!(this.$sysparams.buildings && this.$sysparams.buildings.length > 0)) {
      await this.fetchBuildings();
    }
  }
}
</script>
