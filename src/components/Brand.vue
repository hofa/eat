<template>
  <x-header>品牌录入</x-header>
<!--   <div class="vux-demo">
    <img class="logo" src="../assets/vux_logo.png">
    <h1>{{ msg }}</h1>
  </div> -->


  <group title="Add">
    <x-input title="品牌" placeholder="请输入品牌" :min=2 :max=24 :value.sync="name"></x-input>
    <x-button @click="save">保存</x-button>
  </group>

  <!-- <divider style="padding-top:30px;">当前品牌</divider> -->
  <group title="Lists">
    <div>
      <switch :title.sync="i.name" :value.sync="i.display" v-for="i in list" @change="update(i._id, i.display)"> </switch>
    </div>
  </group>

</template>

<script>
import Divider from 'vux/src/components/divider'
import XInput from 'vux/src/components/x-Input'
import XButton from 'vux/src/components/x-Button'
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
    Switch,
    XButton,
    Divider
  },
  data () {
    return {
      list: [],
      name: ""
    }
  },
  ready() {
    this.lists()
  },
  methods: {
    lists: function() {
      this.$http.get(config.server + 'brand').then((response) => {
        // success callback
        this.list = response.data.data
      }, (response) => {
        // error callback
      });
    },
    save: function() {
      console.log('save')
      this.$http.post(config.server + 'brand', {'name': this.name}).then((response) => {
        // success callback
        this.lists()
        this.name = ''
      }, (response) => {
        // error callback
      });
    },
    update: function(id, display) {
      this.$http.put(config.server + 'brand', {'display': display, 'id': id}).then((response) => {
        // success callback

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
