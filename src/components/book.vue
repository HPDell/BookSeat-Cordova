<template lang="pug">
  f7-page
    f7-navbar
      f7-nav-left
      f7-nav-title 预约座位
      f7-nav-right
    f7-block-title 选择场馆
    f7-list
      f7-list-item(title="总馆", radio, name="building", value="0", :checked="building === 0", @change="building = $event.target.value")
      f7-list-item(title="工学分馆", radio, name="building", value="1", :checked="building === 1", @change="building = $event.target.value")
      f7-list-item(title="信息科学分馆", radio, name="building", value="2", :checked="building === 2", @change="building = $event.target.value")
      f7-list-item(title="医学分馆", radio, name="building", value="3", :checked="building === 3", @change="building = $event.target.value")
    f7-block-title 查询方式
    f7-list
        f7-list-item(title="全部", :link="'/book/' + bookType +'/all/'")
        f7-list-item(title="按时段查询", :link="'/book/' + bookType +'/bytime/'")
        f7-list-item(title="按房间查询", :link="'/book/' + bookType +'/room/'")
</template>


<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  // props: {
  //   bookType: String
  // }
})
export default class BookPage extends Vue {
  building: number = null;
}
</script>
