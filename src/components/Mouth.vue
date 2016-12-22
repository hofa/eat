<template>
  <x-header>本月统计</x-header>
  <group title="">
    <!-- <cell title="共" value="333RMB"></cell> -->
    <div v-for="i in lists">
    <cell :title="i.created | date-formatter 'YYYY-MM-DD'" :inline-desc="" :value="i.productName.toString() + ' ' + i.price.toString() + ' 元'"></cell>
    </div>
    <!-- <divider v-if="dis" @click="getOrder">加载更多</divider> -->
    <divider style="padding-bottom:80px;"></divider>
  </group>

</template>

<script>
import Divider from 'vux/src/components/divider'
import XHeader from 'vux/src/components/x-header'
import Group from 'vux/src/components/group'
import Cell from 'vux/src/components/cell'
import DateFormatter from './timestampFormatter.js'
import { Tabbar, TabbarItem }  from 'vux/src/components/tabbar'
import config from '../config'
// import moment

export default {
  components: {
    Group,
    Cell,
    XHeader,
    Tabbar,
    TabbarItem,
    Divider
  },
  filters: {
    DateFormatter
  },
  data () {
    return {
      lists: [],
      page: 1,
      dis: true,
    }
  },
  ready() {
    this.getOrder()
  },
  methods: {
    getOrder: function() {
      this.$http.get(config.server + 'order?type=mouth&page=' + this.page).then((response) => {
        if (this.page == 1) {
          this.lists = response.data.data
        } else {
          this.lists = this.lists.concat(response.data.data)
        }

        if (response.data.data.length == 0) {
          this.dis = false
        }
        console.log(this.lists)
        this.page++
      }, (response) => {
        // error callback
      });
    },
  }
}
</script>

<style>
@import '~vux/dist/vux.css';
</style>
