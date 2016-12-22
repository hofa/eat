<template>
  <x-header>订餐</x-header>
<!--   <div class="vux-demo">
    <img class="logo" src="../assets/vux_logo.png">
    <h1>{{ msg }}</h1>
  </div> -->


  <group title="Preference">
    <selector title="品牌" :options="brandList" :value.sync="brandId"></selector>
    <selector title="分类" :options="typeList" :value.sync="type"></selector>
  </group>

  <group title="Menus">
    <radio :options="menus" :value.sync="menuValue"></radio>
  </group>
  <divider style="padding-bottom:80px;"></divider>
  <toast type="success" :show.sync="show1" :time="1000">{{msg}}</toast>
  <toast type="text" :show.sync="show2" :time="1000">{{msg}}</toast>
  <loading :show="show" :text="text1"></loading>

  <confirm :show.sync="showConfirm" confirm-text="确定" cancel-text="取消" title="操作提示" @on-confirm="onAction('确认')" @on-cancel="onAction('取消')">
    <p style="text-align:center;">{{msg}}, 是否取消旧订单</p>
  </confirm>


    <tabbar>
      <tabbar-item v-link="{path:'/'}">
        <img slot="icon" src="https://o84lhz5xo.qnssl.com/master/src/assets/demo/icon_nav_button.png">
        <span slot="label">我的</span>
      </tabbar-item >
      <tabbar-item v-link="{path:'/top'}" selected>
        <img slot="icon" src="https://o84lhz5xo.qnssl.com/master/src/assets/demo/icon_nav_article.png">
        <span slot="label">吃吃吃</span>
      </tabbar-item>
      <tabbar-item v-link="{path:'/set'}">
        <img slot="icon" src="https://o84lhz5xo.qnssl.com/master/src/assets/demo/icon_nav_cell.png">
        <span slot="label">设置</span>
      </tabbar-item>
    </tabbar>

</template>

<script>
import Divider from 'vux/src/components/divider'
import Selector from 'vux/src/components/selector'
import XInput from 'vux/src/components/x-Input'
import XHeader from 'vux/src/components/x-header'
import Group from 'vux/src/components/group'
import Cell from 'vux/src/components/cell'
import Switch from 'vux/src/components/Switch'
import Radio from 'vux/src/components/radio'
import { Tabbar, TabbarItem }  from 'vux/src/components/tabbar'
import Toast from 'vux/src/components/toast'
import Loading from 'vux/src/components/loading'
import Confirm from 'vux/src/components/confirm'
import config from '../config'
export default {
  components: {
    Group,
    Cell,
    XHeader,
    Tabbar,
    TabbarItem,
    XInput,
    Switch,
    Selector,
    Radio,
    Toast,
    Loading,
    Confirm,
    Divider
  },
  data () {
    return {
      type: "1",
      brandList: [],
      typeList: [{key: "1", value: '饭'}, {key: "2", value: '粉/面'}, {key: "3", value: '汤'}, {key: "4", value: '饮料'}, {key: "5", value: '小菜'}],
      brandId: "",
      carteList: [],
      carteId: "",
      menus:[],
      menusKey:[],
      menuValue:'',
      show1: false,
      show2: false,
      loadingShow: false,
      msg: '',
      orders: [],
      refreshMenusValue: true,
      showConfirm: false,
    }
  },
  ready () {
    this.brandLists()
  },
  methods: {
    onAction: function($msg) {
      if ($msg == '确认') {
        this.orders.detail = []
        // this.refreshMenusValue = false
        this.menuValue = ''

        this.$http.get(config.server + 'order/remove').then((response) => {
          // success callback
          // if (response.data.code == 0) {
          //   this.msg = response.data.msg
          //   this.show2 = true
          // } else {
          //   this.menuValue = ''
          //   this.msg = response.data.msg
          //   this.show2 = true
          //   this.changeOrder()
          // }
        }, (response) => {
          // error callback
          this.loadingShow = false
          this.msg = '服务器异常'
          this.show2 = true
        })
      }
      this.showConfirm = false
    },
    brandLists: function() {
      this.$http.get(config.server + 'brand?display=true').then((response) => {
        // success callback
        // this.brandList = []
        var temp = []
        for(var i in response.data.data) {
          temp.push({key: response.data.data[i]['_id'], value: response.data.data[i]['name']})
        }
        this.brandList = temp
        if (this.brandList.length > 0) {
          // console.log('default', this.brandList[0]['key'])
          this.brandId = this.brandList[0]['key']
        }
      }, (response) => {
        // error callback
      });
    },
    carteLists: function() {
      var temp1 = []
      var temp2 = []
      this.$http.get(config.server + 'carte?display=true&brandId='+this.brandId+'&type='+this.type).then((response) => {
        // success callback
        for (let i in response.data.data) {
          temp2.push(response.data.data[i]._id)
          temp1.push((parseInt(i) + 1) + '.' + response.data.data[i].name+' '+response.data.data[i].price+' 元')
        }
        this.menus = temp1
        this.menusKey = temp2
        this.panel()
      }, (response) => {
        // error callback
        this.loadingShow = false
        this.msg = '服务器异常'
        this.show2 = true
      });
      // console.log(temp1)
    },
    order: function(carteId, count) {
      this.$http.post(config.server + 'order', {'carteId': carteId, 'count': count}).then((response) => {
        // success callback
        console.log(response.data.code)
        if (response.data.code == 0) {
          this.msg = response.data.msg
          this.show2 = true
        } else if (response.data.code == 99994) {
          this.menuValue = ''
          this.msg = response.data.msg
          this.showConfirm = true
        }  else if (response.data.code == 55555) {
          this.menuValue = ''
          this.msg = response.data.msg
          this.show2 = true
          setTimeout(() => {
            this.$route.router.go('/set')
          }, 2500)
        } else {
          this.menuValue = ''
          this.msg = response.data.msg
          this.show2 = true
          this.changeOrder()
          // this.msg = response.data.msg
          // this.menuValue = ''
          // this.showConfirm = true
        }
      }, (response) => {
        // error callback
        this.loadingShow = false
        this.msg = '服务器异常'
        this.show2 = true
      });
    },
    panel: function () {
      this.$http.get(config.server + 'order/panel').then((response) => {
        // success callback
        this.loadingShow = false
        if (parseInt(response.data.code) == 0) {
          this.orders = response.data.data
          this.changeOrder()
        } else {
          this.msg = '【'+ response.data.code + '】' + (typeof response.data.msg != 'undefined' ? response.data.msg : '')
          this.show2 = true
        }
      }, (response) => {
        // error callback
        this.loadingShow = false
        this.msg = '服务器异常'
        this.show2 = true
      });
    },
    changeOrder: function() {
      for (var i in this.orders.detail) {
        if (this.orders.detail[i].brandId == this.brandId && this.orders.detail[i].type == this.type) {
          var k = this.menusKey.indexOf(this.orders.detail[i]['carteId'])
          this.refreshMenusValue = false
          this.menuValue = this.menus[k]
          break;
        }
      }
    }
  },
  watch: {
    'type': function (val, oldVal) {
      this.carteLists()
    },
    'brandId': function (val, oldVal) {
      this.carteLists()
    },
    'menuValue': function (val, oldVal) {
      if (!this.refreshMenusValue) {
        this.refreshMenusValue = true
        return
      }

      if (val == '' || val == null || val == oldVal){
        return
      }

      if (val.length > 0) {
        console.log('选中', val, this.menus.indexOf(val))
        var key = this.menus.indexOf(val)
        if (key != -1) {
          console.log('order:', this.menusKey[key])
          this.order(this.menusKey[key], 1)
        }
      }
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
.weui_tabbar{ position: fixed; }
</style>
