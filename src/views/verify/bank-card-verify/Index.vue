<template>
  <base-page :navOptions="{ title: '银行卡', isBack: true}">
    <better-scroll>
      <div class="bank-card">
        <div class="title">
          <div></div>
          <p></p>
          <h2>本人银行卡</h2>
          <p></p>
          <div></div>
        </div>
        <div>
          <text-input title="姓名" placeholder="请输入姓名" v-model="form.name"/>
          <text-input title="身份证" placeholder="请输入身份证" v-model="form.identityCardNumber"/>
          <text-input title="银行卡" placeholder="请输入银行卡" v-model="form.bankCardNumber"/>
          <text-area-input title="银行卡开户行" placeholder="请输入银行卡开户行" v-model="form.bankCardName"/>
        </div>
      </div>
      <div class="sumbit">
        <button class="simple-btn" @click="sumbitClick"
                v-stat="{category:'按钮点击事件', action:'银行卡', name: '立即提交'}">立即提交</button>
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
import TextInput from '@/components/TextInput'
import TextAreaInput from '@/components/TextAreaInput'
import { FormValidate, request, storage } from '@/utils'
import { url } from '@/const'
import { baseMixin } from '@/mixins'

export default {
  name: 'BankCardVerify',
  components: { TextAreaInput, TextInput },
  mixins: [baseMixin],
  data () {
    return {
      form: {
        name: '',
        bankCardNumber: '',
        identityCardNumber: '',
        bankCardName: ''
      },
      rules: {
        name: [
          { require: true, message: '名字不能为空' }
        ],
        bankCardNumber: [
          { require: true, message: '银行卡不能为空' }
        ],
        identityCardNumber: [
          { require: true, message: '身份证不能为空' }
        ]
      }
    }
  },
  mounted () {
    this.getIsAuthBaseInfo()
  },
  methods: {
    getIsAuthBaseInfo () {
      request({
        type: 'post',
        path: url.UserVerify.IsAuthBaseInfo,
        fn: (data) => {
          const result = data.result
          this.form.name = result.fullName
          this.form.bankCardName = result.bankCardName
          this.form.identityCardNumber = result.identityCardNumber
          this.form.bankCardNumber = result.bankCardNumber
        },
        errFn: () => {
        }
      })
    },
    // 跨页刷新
    sendNotification () {
      this.bus.$emit('verifyRefresh')
    },
    async sumbitClick () {
      const result = FormValidate.checkForm(this.form, this.rules)
      if (result.length > 0) {
        this.errorT(result[0].message)
      } else {
        this.form.creditToken = await storage.get('creditToken')
        request({
          type: 'post',
          data: this.form,
          path: url.UserVerify.AuthBank,
          fn: () => {
            this.successT('提交成功')
            this.sendNotification()
            if (this.$route.query.quotaId) {
              this.$router.replace({
                name: 'create-order',
                query: this.$route.query
              })
            } else {
              this.$router.goBack()
            }
          },
          errFn: () => {
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
.bank-card{
  background: white;
  padding: 20px 0;
  .title{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    h2{
      padding: 0 5px;
      font-size: @font_size_4;
    }
    & > div{
      height: 1px;
      width: 100px;
      background: @light_gray3;
    }
    & > p {
      width: 6px;
      height: 6px;
      border-radius: 3px;
      background: @light_gray3;
    }
  }
}
.sumbit{
  text-align: center;
  padding: 30px 0;
}
</style>
