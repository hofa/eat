<template>
  <x-header>历史订单</x-header>
  <!-- <inline-calendar :value.sync="date" v-if="calendar"></inline-calendar> -->
  <group title="">
    <calendar :value.sync="date" title="选择日期"></calendar>
    <div v-for="i in lists">
      <divider>{{i[0].brandId.name}}</divider>
      <div v-for="j in i">
      <cell :title="j.created | date-formatter 'YYYY-MM-DD'" :inline-desc="" :value="j.userId.name + ' ' + j.carteId.name + ' ' + j.carteId.price.toString() + ' 元'"></cell>
      </div>
    </div>
    <cell title="导出日订单" is-link @click="exportDay"></cell>
    <cell title="导出月订单" is-link @click="exportMonth"></cell>
    <divider style="padding-bottom:80px;"></divider>
  </group>

</template>

<script>
import Divider from 'vux/src/components/divider'
import InlineCalendar from 'vux/src/components/inline-calendar'
import Calendar from 'vux/src/components/calendar'
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
    Divider,
    InlineCalendar,
    Calendar
  },
  filters: {
    DateFormatter
  },
  data () {
    return {
      // lists: {"ff": [{"a": 1}, {"b": 1}], "kk": [{"a": 1}]},
      // lists: [{"a": 1}, {"b": 1}],
      lists: [],
      page: 1,
      dis: true,
      date: 'TODAY',
      calendar: false
    }
  },
  ready() {
    // this.getOrder()
  },
  methods: {
    exportDay: function() {
      var token = this.$cookie.get("t")
      window.location.href=config.server + "order/export/day.csv?t=" + token+ '&date=' + this.date
    },
    exportMonth: function() {
      var token = this.$cookie.get("t")
      window.location.href=config.server + "order/export/month.csv?t=" + token+ '&date=' + this.date
    },
    getOrder: function() {
      this.$http.get(config.server + 'order?type=person&date='+this.date).then((response) => {
        var temp = {}
        for(let i in response.data.data) {

          var brand = response.data.data[i].brandId.name
          // console.log('brand', brand)
          if (temp.hasOwnProperty(brand)) {
            temp[brand].push(response.data.data[i])
            // console.log('temp2', temp[brand])
          } else {
            temp[brand] = []
            temp[brand].push(response.data.data[i])
            // console.log('temp1', temp[brand])
          }
        }
        this.lists = temp
        // console.log('temp', temp)
        // for (var i in temp) {
        //   for (var j in temp[j]) {
        //     console.log()
        //   }
        // }
      }, (response) => {
        // error callback
      });
    },
  },
  watch: {
    date: function (old, val) {
      this.getOrder()
    }
  }
}
</script>

<style>
@import '~vux/dist/vux.css';
</style>
