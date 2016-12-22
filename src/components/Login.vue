<template>
  <x-header :left-options="{showBack: false}">登录</x-header>
  <group title="">
    <x-input title="" type="password" placeholder="门禁口令" :value.sync="password"></x-input>
    <x-button type="primary" @click="login" style="margin-top:2rem">登录</x-button>
    <toast type="success" :show.sync="show1" :time="1000">{{msg}}</toast>
    <toast type="text" :show.sync="show2" :time="1000">{{msg}}</toast>
    <loading :show="show" :text="text1"></loading>

    <alert :show.sync="show3" title="登录成功" button-text="GO!">
      <p style="text-align:center;">进入首页</p>
    </alert>
  </group>

</template>

<script>
import Divider from 'vux/src/components/divider'
import Alert from 'vux/src/components/alert'
import XHeader from 'vux/src/components/x-header'
import Group from 'vux/src/components/group'
import Cell from 'vux/src/components/cell'
import { Tabbar, TabbarItem }  from 'vux/src/components/tabbar'
import XInput from 'vux/src/components/x-Input'
import XButton from 'vux/src/components/x-Button'
import Toast from 'vux/src/components/toast'
import Loading from 'vux/src/components/loading'
import config from '../config'
export default {
  components: {
    Group,
    Cell,
    XHeader,
    Tabbar,
    TabbarItem,
    Divider,
    XInput,
    XButton,
    Toast,
    Loading,
    Alert
  },
  data () {
    return {
      password: '',
      show1: false,
      show2: false,
      loadingShow: false,
      msg: '',
      show3: false
    }
  },
  ready() {
  },
  methods: {
    delayHide () {
      this.loadingShow = true
      setTimeout(() => {
        this.loadingShow = false
      }, 5000)
    },
    login: function () {

      this.delayHide()
      if (typeof this.$route.query.wxopenid == 'undefined') {
        this.msg = '异常登录'
        this.show2 = true
        return
      }
      this.$http.post(config.server + 'user/login', {'loginname': this.$route.query.wxopenid, 'password': this.password}).then((response) => {
        // success callback
        this.loadingShow = false
        if (response.status == 200) {
          if (response.data.code == 0) {
            this.msg = '登录成功'
            this.show3 = true

            // var cookietime = new Date()
            // cookietime.setTime(cookietime.getTime() + (7 * 86400 * 1000))
            // this.$cookie.set("t", response.data.data.token, {expires: cookietime, path: "/"})
            localStorage.setItem("t", response.data.data.token)
            setTimeout(() => {
              this.$route.router.go('/')
            }, 500)
          } else {
            this.msg = '【'+ response.data.code + '】' + (typeof response.data.msg != 'undefined' ? response.data.msg : '')
            this.show2 = true
          }
        }

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
@import '~vux/src/styles/1px.less';
</style>
