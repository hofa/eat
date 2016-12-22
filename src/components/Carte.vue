<template>
  <x-header>设置</x-header>
<!--   <div class="vux-demo">
    <img class="logo" src="../assets/vux_logo.png">
    <h1>{{ msg }}</h1>
  </div> -->


  <group title="Add">
    <selector title="品牌" :options="brandList" :value.sync="brandId"></selector>
    <selector title="分类" :options="typeList" :value.sync="typeId"></selector>
    <x-input title="菜名" placeholder="输入菜名" :min=2 :max=12 :value.sync="name"></x-input>
    <x-input title="价钱" placeholder="输入价钱(元)" :value.sync="price"></x-input>
    <x-button @click="save">保存</x-button>
  </group>
   <!-- <divider style="padding-top:30px;"></divider> -->
  <group title="Menus">
    <div >

      <switch :title="i.name +' '+ i.price.toString()+'元'" :value.sync="i.display" v-for="i in carteList" @change="update(i._id, i.display)"> </switch>

    </div>
    <divider style="padding-bottom:80px;"></divider>
  </group>
</template>

<script>
import Divider from 'vux/src/components/divider'
import Selector from 'vux/src/components/selector'
import XInput from 'vux/src/components/x-Input'
import XNumber from 'vux/src/components/x-Number'
import XHeader from 'vux/src/components/x-header'
import Group from 'vux/src/components/group'
import Cell from 'vux/src/components/cell'
import Switch from 'vux/src/components/Switch'
import { Tabbar, TabbarItem }  from 'vux/src/components/tabbar'
import config from '../config'
import XButton from 'vux/src/components/x-Button'
export default {
  components: {
    Group,
    Cell,
    XHeader,
    Tabbar,
    TabbarItem,
    XInput,
    XNumber,
    Switch,
    Selector,
    XButton,
    Divider
  },
  data () {
    return {
      name: "",
      typeId: "1",
      brandList: [],
      typeList: [{key: "1", value: '饭'}, {key: "2", value: '粉/面'}, {key: "3", value: '汤'}, {key: "4", value: '饮料'}, {key: "5", value: '小菜'}],
      brandId: "",
      price: "",
      carteList: [],
    }
  },
  ready () {
    this.brandLists()
  },
  methods: {
    brandLists: function() {
      this.$http.get(config.server + 'brand?display=true').then((response) => {
        // success callback
        var temp = []
        for(var i in response.data.data) {
          temp.push({key: response.data.data[i]['_id'], value: response.data.data[i]['name']})
        }
        this.brandList = temp
      }, (response) => {
        // error callback
      });
    },
    carteLists: function() {

      this.$http.get(config.server + 'carte?brandId='+this.brandId+'&type='+this.typeId).then((response) => {
        // success callback
        this.carteList = response.data.data
      }, (response) => {
        // error callback
        this.loadingShow = false
        this.msg = '服务器异常'
        this.show2 = true
      });
      // console.log(temp1)
    },
    save: function() {
      console.log('save')
      this.$http.post(config.server + 'carte', {'name': this.name, 'price': this.price, 'type': this.typeId, 'brandId': this.brandId}).then((response) => {
        // success callback
        // this.lists()
        this.name = ''
      }, (response) => {
        // error callback
      });
    },
    update: function(id, display) {
      this.$http.put(config.server + 'carte', {'display': display, 'id': id}).then((response) => {
        // success callback

      }, (response) => {
        // error callback
      });
    }
  },
  watch: {
    'typeId': function (val, oldVal) {
      this.carteLists()
    },
    'brandId': function (val, oldVal) {
      this.carteLists()
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
