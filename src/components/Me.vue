<template>
  <x-header :left-options="{showBack: false}">我的</x-header>
<!--   <div class="vux-demo">
    <img class="logo" src="../assets/vux_logo.png">
    <h1>{{ today }}</h1>
  </div> -->
  <group title="Today">
    <cell title="今日订餐" :value.sync="today" is-link v-link="{path:'/order'}"></cell>
  </group>

  <group title="Cost">
    <cell title="本月合计" :value.sync="mouth" is-link v-link="{path:'/mouth'}"></cell>
    <cell title="总合计" :value.sync="total" is-link v-link="{path:'/total'}"></cell>
  </group>

  <div>
    <tabbar>
      <tabbar-item v-link="{path:'/'}" selected>
        <img slot="icon" src="https://o84lhz5xo.qnssl.com/master/src/assets/demo/icon_nav_button.png">
        <span slot="label">我的</span>
      </tabbar-item >
      <tabbar-item v-link="{path:'/top'}">
        <img slot="icon" src="https://o84lhz5xo.qnssl.com/master/src/assets/demo/icon_nav_article.png">
        <span slot="label">吃吃吃</span>
      </tabbar-item>
      <tabbar-item v-link="{path:'/set'}">
        <img slot="icon" src="https://o84lhz5xo.qnssl.com/master/src/assets/demo/icon_nav_cell.png">
        <span slot="label">设置</span>
      </tabbar-item>
    </tabbar>
  </div>

<toast type="success" :show.sync="show1" :time="1000">{{msg}}</toast>
<toast type="text" :show.sync="show2" :time="1000">{{msg}}</toast>
<loading :show="show" :text="text1"></loading>
</template>

<script>
import XHeader from 'vux/src/components/x-header'
import Group from 'vux/src/components/group'
import Cell from 'vux/src/components/cell'
import { Tabbar, TabbarItem }  from 'vux/src/components/tabbar'
import config from '../config'
import Toast from 'vux/src/components/toast'
import Loading from 'vux/src/components/loading'
export default {
  components: {
    Group,
    Cell,
    XHeader,
    Tabbar,
    TabbarItem,
    Toast,
    Loading
  },
  data () {
    return {
      msg: '',
      today: '暂未订餐',
      mouth: 0.00,
      total: 0.00,
      show1: false,
      show2: false,
      loadingShow: false,
      msg: '',
    }
  },
  ready() {
    let d = new Date()
    // this.today = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()
    // console.log(1)
    this.panel()
  },
  methods: {
    delayHide () {
      this.loadingShow = true
      setTimeout(() => {
        this.loadingShow = false
      }, 5000)
    },
    panel: function () {
      this.$http.get(config.server + 'order/panel').then((response) => {
        // success callback
        // success callback
        this.loadingShow = false
        // if (response.ok) {
          if (parseInt(response.data.code) == 0) {
            // setTimeout(() => {
            //   this.$route.router.go('/')
            // }, 500)

          // } else if (parseInt(response.data.code) == 1) {
          //   this.msg = '【'+ response.data.code + '】' + (typeof response.data.msg != 'undefined' ? response.data.msg : '')
          //   this.show2 = true
          //   setTimeout(() => {
          //     this.$route.router.go('/login')
          //   }, 1000)
            // this.today = response.data.data.today
            this.mouth = response.data.data.mouth + ' 元'
            this.total = response.data.data.total + ' 元'
            var temp = []
            for (var i in response.data.data.detail) {
              temp.push(response.data.data.detail[i].productName)
            }

            if (temp.length > 0) {
              this.today = temp.join("+")
            }
          } else {
            this.msg = '【'+ response.data.code + '】' + (typeof response.data.msg != 'undefined' ? response.data.msg : '')
            this.show2 = true
          }
        // }
      }, (response) => {
        // error callback
        this.loadingShow = false
        this.msg = '服务器异常'
        this.show2 = true
      });
    }
  }
}
</script>

<style>
@import '~vux/dist/vux.css';
.vux-demo {
  text-align: center;
}

.logo {
  width: 100px;
  height: 100px
}
</style>
