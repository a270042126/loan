<template>
  <base-page :navOptions="{ isBack: true, isFixed: true}">
    <better-scroll class="login">
      <img src="../assets/images/bg-login.png">
      <ul class="from">
        <li>
          <input type="text" placeholder="手机号码" v-model.trim="user.username" />
        </li>
        <li class="code" v-show="isRegister">
          <input type="text" placeholder="验证码" v-model.trim="user.code"/>
          <div v-if="timerCount === 0" class="code_btn" @click="codeClick" >
            获取验证码
          </div>
          <div v-else class="code_btn">
            {{timerCount + 's'}}
          </div>
        </li>
        <li><input type="password" placeholder="请输入密码" v-model.trim="user.password"/></li>
        <li><cube-button class="submit" @click="loginClick">立即登录</cube-button></li>
      </ul>
      <div class="register" @click="registerClick">
        {{isRegister ?  '账号密码登录' : '还没有账号？立即注册'}}
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
import { baseMixin } from '@/mixins'
import { request, validate, apid, storage } from '@/utils'
import { url } from '@/const'
import 'assets/lib/gt'
import { mapActions } from 'vuex'
const TIME_COUNT = 30
let captchaClient = ''
let captchaResponse = ''
export default {
  name: 'Login',
  mixins: [baseMixin],
  data () {
    return {
      isRegister: false,
      timerCount: 0,
      user: {
        username: '',
        password: '',
        code: ''
      }
    }
  },
  mounted () {
    this.user.username = storage.get('loginName')
    this.initGeetest()
  },

  methods: {
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
              console.log('ready')
              // H.addCls(H.byId('wait'), 'none');
              // captchaObj.appendTo(H.byId('captcha-box'));
            }).onSuccess(function () {
              let d = captchaObj.getValidate()
              captchaResponse = d.geetest_challenge + '#' + d.geetest_validate + '#' + d.geetest_seccode + '#' + data.result.sessionKey
              if (that.isRegister) {
                that.codeClick()
              } else {
                that.loginClick()
              }
            })
          })
          console.log(data.result)
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

    // .获取短信验证码
    codeClick () {
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
      this.loadingT()
      request({
        type: 'post',
        path: url.AuthenticateBySms,
        data: params,
        fn: data => {
          this.successT('验证码已经发送')
          this.loginShowTime()
        },
        errFn: () => {
        }
      })
    },

    loginClick () {
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
      this.loadingT('正在提交...')
      request({
        type: 'post',
        path: (this.isRegister) ? url.AuthenticateBySms : url.Authenticate,
        data: params,
        fn: data => {
          storage.set('loginName', this.user.username)
          const userKeys = data.result
          this.setToken(userKeys)
          this.successT('登录成功')
          apid.sendEvent('user', { type: 'login' })
          this.$router.goBack()
        },
        errFn: () => {
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
      if (!captchaClient.getValidate()) {
        // 弹出验证框
        captchaClient.verify()
        this.errorT('请输入短信验证码')
        return false
      }
      return true
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
          background: @login_input_bg;
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
        border: 1px solid @login_input_border_hover_color;
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
