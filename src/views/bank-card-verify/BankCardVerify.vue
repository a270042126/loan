<template>
  <base-page :navOptions="{ title: '设置银行卡', isBack: true}">
    <better-scroll>
      <div class="quota-info" v-if="quotaName">
        <h2>借款金额(元)<br>
        <span>{{quotaName}}</span></h2>
        <p>{{getNowDate}}, 为期{{termName}}</p>
      </div>
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
        </div>
      </div>
      <div class="sumbit">
        <button class="simple-btn" @click="sumbitClick">立即提交</button>
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
import { request, FormValidate } from 'js/utils'
import { url } from 'js/const'
import moment from 'moment'
import TextInput from '@/components/TextInput'
import { baseMixin } from 'js/mixins'
export default {
  name: 'BankCardVerify',
  components: { TextInput },
  mixins: [baseMixin],
  data () {
    return {
      quotaName: this.$route.query.quotaName || '',
      termName: this.$route.query.termName || '',
      form: {
        name: '',
        bankCardNumber: '',
        identityCardNumber: ''
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
  computed: {
    getNowDate () {
      return moment().format('YYYY-MM-DD')
    }
  },
  methods: {
    sumbitClick () {
      this.$router.replace({
        name: 'create-order',
        query: this.$route.query
      })
      const result = FormValidate.checkForm(this.form, this.rules)
      if (result.length > 0) {
        this.errorT(result[0].message)
      } else {
        this.loadingT()
        request({
          type: 'post',
          data: this.form,
          path: url.UserVerify.AuthBaseInfo,
          fn: () => {
            this.successT('提交成功')
            this.$router.goBack()
            if (this.$route.query.quotaName) {
              this.$router.replace({
                name: 'create-order',
                query: this.$route.query
              })
            }
          },
          errFn: () => {
            this.hideT()
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
.quota-info{
  padding: 20px;
  background: white;
  margin-bottom: 20px;
  h2{
    text-align: center;
    font-size: @font_size_4;
    span{
      font-weight: bold;
      margin-top: 10px;
      color: @theme_primary;
      font-size: @font_size_7;
    }
  }
  p{
    color: @light_gray2;
    text-align: center;
    padding-top: 10px;
    font-size: @font_size_3;
  }
}
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
