<template>
  <base-page :navOptions="{ title: '手机认证', isBack: true}">
    <better-scroll>
      <div class="phone-verify">
        <text-input title="手机号" v-model="form.phone" :readonly="true"  placeholder="请输入手机号"/>
        <text-input title="验证码" v-model="form.code" placeholder="请输入验证码">
          <button class="code-btn" :disabled="codeNum > 0" @click="codeClick">
            {{(codeNum > 0) ?  codeNum + '秒重试' : '获取验证码'}}
          </button>
        </text-input>
        <button class="simple-btn" @click="verifyClick">认证</button>
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
import TextInput from '@/components/TextInput'
import { mapGetters } from 'vuex'
import { request } from 'js/utils'
import { url } from 'js/const'
import { baseMixin } from 'js/mixins'
export default {
  name: 'PhoneVerify',
  components: { TextInput },
  mixins: [baseMixin],
  data () {
    return {
      form: {
        phone: '',
        code: ''
      },
      codeNum: 0
    }
  },
  computed: {
    ...mapGetters([
      'userKeys'
    ])
  },
  mounted () {
    this.form.phone = this.userKeys.userName
  },
  methods: {
    startTime () {
      this.codeNum = 60
      if (!this.timer) {
        this.timer = setInterval(() => {
          this.codeNum -= 1
          if (this.codeNum <= 0) {
            this.stopTime()
          }
        }, 1000)
      }
    },
    stopTime () {
      if (this.timer) {
        clearInterval(this.timer)
      }
    },
    codeClick () {
      request({
        type: 'post',
        path: url.UserVerify.AuthOperatorRequest,
        fn: (res) => {
          this.startTime()
        },
        errFn: () => {
          this.stopTime()
        }
      })
    },
    verifyClick () {
      if (!this.form.code.trim()) {
        this.errorT('请输入验证码')
      } else {
        request({
          type: 'post',
          path: url.UserVerify.AuthOperatorSubmit,
          data: { code: this.form.code },
          fn: () => {
            this.successT('认证成功')
          },
          errFn: () => {}
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
.phone-verify{
  padding: 40px 0;
  .code-btn{
    background: @theme_primary;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    border-radius: 4px;
    margin-left: 10px;
    color: white;
  }
  .simple-btn{
    width: 90%;
    margin: 40px auto;
  }
}
</style>
