<template lang="pug">
  f7-page
    f7-navbar
      f7-nav-left
      f7-nav-title 预约座位
      f7-nav-right
    f7-block-title 选择场馆
    f7-list
      f7-list-item(v-for="building in buildings" :title="building.buildingName", radio, name="targetBuildingID", :value="building.buildingID", :checked="targetBuildingID == building.buildingID", @change="targetBuildingID = $event.target.value")
    f7-block-title 查询方式
    f7-list
        f7-list-item(title="全部", :link="'/book/' + bookType +'/byall/'")
        f7-list-item(title="按时段查询", :link="'/book/' + bookType +'/bytime/'")
        f7-list-item(title="按房间查询", :link="'/book/' + bookType +'/byroom/'")
</template>


<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { LibraryBuilding, BuildingFilterData } from "../models/LibraryModel";
import { RestResponse } from "../models/RestResponse";
import params from '../plugin/vue-book-sys-webparams'
import axios,{ AxiosResponse } from "axios";

@Component({
  props: {
    bookType: String
  }
})
export default class BookPage extends Vue {
  targetBuildingID: number;
  buildings: Array<LibraryBuilding> = params.buildings;
  async fetchBuildings() {
    try {
      var buildings_rest: AxiosResponse<RestResponse<BuildingFilterData>> = await axios({
        url: "rest/v2/free/filters"
      });
      if (buildings_rest.data.status == "success") {
        this.buildings = buildings_rest.data.data.buildings.map((value) => {
          return new LibraryBuilding(value);
        })
      } else {
        throw "服务器返回错误";
      }
    } catch (error) {
      // @ts-ignore
      this.$f7.toast.create({
        text: "获取场馆数据失败：" + error,
        position: "top" 
      }).open();
    }
  }
  mounted() {
    if (!(this.buildings && this.buildings.length > 0)) {
      this.fetchBuildings();
    }
  }

}
</script>
