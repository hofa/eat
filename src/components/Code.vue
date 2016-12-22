<template>
  <x-header>二维码登录</x-header>
  <group title="">
    <divider>请在公司WIFI下, 使用微信打开</divider>
    <divider><img src="../assets/code.png"></divider>
    <divider>或点击链接: <a href="http://m.ubi001.com/carte">http://m.ubi001.com/carte</a></divider>
  </group>

</template>

<script>
import Divider from 'vux/src/components/divider'
import XHeader from 'vux/src/components/x-header'
import Group from 'vux/src/components/group'
import Cell from 'vux/src/components/cell'
import config from '../config'
export default {
  components: {
    Group,
    Cell,
    XHeader,
    Divider
  },
  data () {
    return {
    }
  },
  ready() {
  },
  methods: {
  }
}
</script>

<style>
@import '~vux/dist/vux.css';
@import '~vux/src/styles/1px.less';
</style>
