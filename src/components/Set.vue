<template>
  <x-header>设置</x-header>
<!--   <div class="vux-demo">
    <img class="logo" src="../assets/vux_logo.png">
    <h1>{{ msg }}</h1>
  </div> -->


  <group title="Set">
    <x-input title="姓名" placeholder="请输入姓名" is-type=china-name :value.sync="name" @change="update"></x-input>
    <switch title="消息通知" :value.sync="notification" @change="update"> </switch>
  </group>

  <group title="Feature">
    <cell title="品牌录入" is-link v-link="{path:'/brand'}"></cell>
    <cell title="菜谱录入" is-link v-link="{path:'/carte'}"></cell>
    <cell title="历史订单" is-link v-link="{path:'/today'}"></cell>
    <cell title="二维码" is-link v-link="{path:'/code'}"></cell>
  </group>

  <div>
    <tabbar>
      <tabbar-item v-link="{path:'/'}">
        <img slot="icon" src="https://o84lhz5xo.qnssl.com/master/src/assets/demo/icon_nav_button.png">
        <span slot="label">我的</span>
      </tabbar-item >
      <tabbar-item v-link="{path:'/top'}">
        <img slot="icon" src="https://o84lhz5xo.qnssl.com/master/src/assets/demo/icon_nav_article.png">
        <span slot="label">吃吃吃</span>
      </tabbar-item>
      <tabbar-item v-link="{path:'/set'}" selected>
        <img slot="icon" src="https://o84lhz5xo.qnssl.com/master/src/assets/demo/icon_nav_cell.png">
        <span slot="label">设置</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import XInput from 'vux/src/components/x-Input'
import XHeader from 'vux/src/components/x-header'
import Group from 'vux/src/components/group'
import Cell from 'vux/src/components/cell'
import Switch from 'vux/src/components/Switch'
import { Tabbar, TabbarItem }  from 'vux/src/components/tabbar'
import config from '../config'
export default {
  components: {
    Group,
    Cell,
    XHeader,
    Tabbar,
    TabbarItem,
    XInput,
    Switch
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'Hello World!',
      notification: true,
      name: "",
    }
  },
  ready() {
    this.info()
  },
  methods: {
    info: function() {
      this.$http.get(config.server + 'user').then((response) => {
        // success callback
        // this.lists()
        this.notification = response.data.data.notification
        this.name = response.data.data.name
      }, (response) => {
        // error callback
      });
    },

    update: function () {
      this.$http.put(config.server + 'user', {'name': this.name, 'notification': this.notification}).then((response) => {
        // success callback
        // this.lists()
        // this.name = ''
      }, (response) => {
        // error callback
      });
    }
  }
}
</script>

<style>
@import '~vux/dist/vux.css';
.st {
  position: fixed;
  bottom: 0;
}
.vux-demo {
  text-align: center;
}

.logo {
  width: 100px;
  height: 100px
}
</style>
