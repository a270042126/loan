<template>
  <base-page :navOptions="{ isBack: true, isFixed: true}" :style="template.hasTemplate ? 'background:' + template.background : ''">
    <better-scroll class="login">
      <img v-if="template.hasTemplate" :src="baseUrl + '/File/Download?id=' + template.registerImage"  alt=""/>
      <img v-else src="../assets/images/bg-login.png"  alt=""/>
      <ul class="from">
        <li :style="`background:${template.inputColor ? template.inputColor : ''};
        border-color:${template.buttonColor ? template.buttonColor : ''}`">
          <input type="text"
                 placeholder="手机号码"
                 v-model.trim="user.username"
                :style="`color:${template.fontColor ? template.fontColor : ''}`"/>
        </li>
        <li class="code" v-show="isRegister"
            :style="`background:${template.inputColor ? template.inputColor : ''};
            border-color:${template.buttonColor ? template.buttonColor : ''}`">
          <input type="text"
                 placeholder="验证码"
                 v-model.trim="user.code"
                 :style="`color:${template.fontColor ? template.fontColor : ''}`"/>
          <div v-if="timerCount === 0"
               class="code_btn"
               @click="codeClick"
               :style="`background:${template.buttonColor ? template.buttonColor : ''};
            color:${template.inputColor ? template.inputColor : ''}`"
               v-stat="{category:'按钮点击事件', action:'登录', name: '验证码'}">
            获取验证码
          </div>
          <div v-else class="code_btn">
            {{timerCount + 's'}}
          </div>
        </li>
        <li :style="`background:${template.inputColor ? template.inputColor : ''};
        border-color:${template.buttonColor ? template.buttonColor : ''}`">
          <input type="password"
                 placeholder="请输入密码"
                 v-model.trim="user.password"
                 :style="`color:${template.fontColor ? template.fontColor : ''}`"/>
        </li>
        <li :style="template.hasTemplate ? 'background:' + template.background : ''">
          <cube-button
            class="submit"
            @click="loginClick"
            :style="`background:${template.buttonColor ? template.buttonColor : ''};
            color:${template.inputColor ? template.inputColor : ''}`"
            v-stat="{category:'按钮点击事件', action:'登录', name: '立即登录'}">立即登录</cube-button>
        </li>
      </ul>
      <div class="register" @click="registerClick"
           v-stat="{category:'按钮点击事件', action:'登录', name: '注册'}">
        {{isRegister ?  '账号密码登录' : '还没有账号？立即注册'}}
      </div>
    </better-scroll>
    <!--<remote-js :js-url="'https://p-huohuodai.jxstudio.cn/Gateway/Credit/XinyanScripts?callback=dfCallBack'" :js-load-call-back="loadRongJs"/>-->
  </base-page>
</template>

<script>
import { baseMixin } from '@/mixins'
import { request, validate, apid, storage } from '@/utils'
import { url } from '@/const'
import 'assets/lib/gt'
import { mapActions, mapGetters } from 'vuex'
// import RemoteJs from '@/components/RemoteJs'
const TIME_COUNT = 30
let captchaClient = ''
let captchaResponse = ''
export default {
  name: 'Login',
  mixins: [baseMixin],
  data () {
    return {
      isLoginClick: false,
      isRegister: false,
      timerCount: 0,
      user: {
        username: '',
        password: '',
        code: ''
      },
      template: ''
    }
  },
  computed: {
    ...mapGetters(['baseUrl'])
  },
  mounted () {
    this.user.username = storage.get('loginName')
    this.getTemplate()
    this.initGeetest()
  },
  methods: {
    async getTemplate () {
      const refereeId = await storage.get('refereeId')
      if (refereeId) {
        request({
          type: 'post',
          path: url.AffiliateTemplate.GetRegisterTemplate,
          data: { id: refereeId },
          fn: data => {
            this.template = data.result
          }
        })
      }
    },
    registerClick () {
      this.isRegister = !this.isRegister
      this.user.password = ''
    },
    initGeetest () {
      const that = this
      request({
        type: 'post',
        path: url.InitGeetest,
        data: { values: {} },
        fn: data => {
          window.initGeetest({
            gt: data.result.gt,
            challenge: data.result.challenge,
            offline: !data.result.success,
            new_captcha: data.result.new_captcha,
            https: true,
            width: '100%',
            product: 'bind'
          }, function (captchaObj) {
            captchaClient = captchaObj
            captchaObj.onReady(function () {
              // H.addCls(H.byId('wait'), 'none');
              // captchaObj.appendTo(H.byId('captcha-box'));
            }).onSuccess(function () {
              let d = captchaObj.getValidate()
              captchaResponse = d.geetest_challenge + '#' + d.geetest_validate + '#' + d.geetest_seccode + '#' + data.result.sessionKey
              if (!that.isLoginClick) {
                that.codeClick()
              } else {
                that.loginClick()
              }
            })
          })
        }
      })
    },

    // 按钮计时
    loginShowTime () {
      if (!this.timer) {
        this.timerCount = TIME_COUNT
        this.timer = setInterval(() => {
          if (this.timerCount > 0 && this.timerCount <= TIME_COUNT) {
            this.timerCount--
          } else {
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    },
    codeClick () {
      this.isLoginClick = false
      if (!this.user.username) {
        this.errorT('请输入手机号码')
        return
      }

      if (!validate.isPhone(this.user.username)) {
        this.errorT('手机号码有误')
        return
      }
      if (!captchaClient.getValidate()) {
        // 弹出验证框
        captchaClient.verify()
        this.errorT('请完成手势验证')
        return
      }

      const params = {
        phoneNumber: this.user.username,
        captchaResponse: captchaResponse
      }
      request({
        type: 'post',
        path: url.AuthenticateBySms,
        data: params,
        fn: data => {
          this.successT('验证码已经发送')
          captchaClient.reset()
          this.loginShowTime()
        },
        errFn: () => {
          captchaClient.reset() // 调用该接口进行重置
        }
      })
    },

    async loginClick () {
      this.isLoginClick = true
      if (!this.loginCheck(this.user)) {
        return
      }
      let params
      if (this.isRegister) {
        params = {
          phoneNumber: this.user.username,
          code: this.user.code,
          password: this.user.password
        }
      } else {
        params = {
          userNameOrEmailAddress: this.user.username,
          password: this.user.password
        }
      }
      const creditToken = await storage.get('creditToken')
      params.creditToken = creditToken
      request({
        type: 'post',
        path: (this.isRegister) ? url.AuthenticateBySms : url.Authenticate,
        data: params,
        fn: async data => {
          storage.set('loginName', this.user.username)
          this.setMatomoUserId(this.user.username)
          const userKeys = data.result
          await this.setToken(userKeys)
          this.successT('登录成功')
          apid.sendEvent('user', { type: 'login' })
          apid.initService()
          if (apid.systemType() === 'web') {
            this.$router.replace({ name: 'download' })
          } else {
            this.$router.goBack()
          }
        },
        errFn: () => {
          console.log('无效。。。。。。。。。。。')
          captchaClient.reset() // 调用该接口进行重置
        }
      })
    },

    loginCheck (user) {
      if (!user.username) {
        this.errorT('请输入手机号码')
        return false
      }
      if (!validate.isPhone(user.username)) {
        this.errorT('手机号码有误')
        return false
      }
      if (!this.isRegister) {
        if (!user.password) {
          this.errorT('请输入密码')
          return false
        }
        if (user.password.length < 6) {
          this.errorT('密码格式错误')
          return false
        }
      } else {
        if (!user.code) {
          this.errorT('请输入短信验证码')
          return false
        }
      }
      if (!captchaClient.getValidate() && !this.isRegister) {
        // 弹出验证框
        captchaClient.verify()
        return false
      }
      return true
    },
    setMatomoUserId (username) {
      this.$matomo.setUserId(username)
    },
    ...mapActions([
      'setToken'
    ])
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.container{
  height: 100%;
  background: @login_bg;
  .login{
    height: 100%;
    img{width: 100%}
    background: none;
    display: flex;
    flex-direction: column;
    .from{
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      li{
        width: 80%;
        margin-bottom: 14px;
        background: @login_input_bg;
        border-radius: 1.8rem;
        border:1px solid @login_input_border_color;
        overflow: hidden;
        display: flex;
        input{
          flex: 1;
          margin: 0 24px;
          display: block;
          height: 44px;
          width: 0;
          font-size: @font_size_1;
          background: none;
          color: @login_color;
        }
        input::-webkit-input-placeholder{
          color:@login_input_placeholder_color
        }
      }
      li.code{
        position: relative;
        .code_btn{
          position: absolute;
          top: 3px;
          right: 3px;
          background:@login_button_bg;
          color: @login_button_color;
          height: 36px;
          width: 100px;
          text-align: center;
          line-height: 36px;
          font-size: @font_size_1;
          border-radius: 18px;
        }
        input {
          margin: 0 120px 0 24px;
        }
      }
      li:hover {
        border: 1px solid transparent;
      }
      li:last-child{
        border: none;
        .submit{
          width: 100%;
          height: 48px;
          border-radius: 24px;
          background: @login_button_bg;
          font-size: @font_size_2;
          color: @login_button_color;
        }
      }
    }
    .register{
      font-size: @font_size_1;
      color: @login_color;
      text-align: center;
      padding-bottom: 12%;
    }
  }
}
</style>
