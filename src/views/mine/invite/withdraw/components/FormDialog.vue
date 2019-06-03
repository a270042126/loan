<template>
  <r-dialog ref="renewalListDialog" title="提现" :isDialogShow="isShow" @onClose="onClose">
    <b-text-input placeholder="请输入提现金额" v-model="form.applyAmount"/>
    <b-text-input placeholder="请输入收款账号" v-model="form.paymentAccount"/>
    <div class="radio-group">
      <label><input type="radio" v-model="form.paymentMethod" :value="2"/>支付宝</label>
      <label><input type="radio" v-model="form.paymentMethod" :value="3"/>微信</label>
      <label><input type="radio" v-model="form.paymentMethod" :value="4"/>网银</label>
    </div>
    <div class="btns">
      <button @click="sumbitClick">我要提现</button>
    </div>
  </r-dialog>
</template>

<script>
import BTextInput from '@/components/BTextInput'
import { FormValidate, request } from '@/utils'
import { baseMixin } from '@/mixins'
import { url } from '@/const'
export default {
  name: 'FormDialog',
  components: { BTextInput },
  mixins: [baseMixin],
  props: {
    isDialogShow: {
      default: false
    }
  },
  data () {
    return {
      isShow: false,
      form: {
        applyAmount: '',
        paymentMethod: 2,
        paymentAccount: ''
      },
      rules: {
        applyAmount: [
          { require: true, message: '请输入提现金额' },
          { rule: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '请输入有效金额' }
        ],
        paymentAccount: [
          { require: true, message: '请输入收款账号' }
        ]
      }
    }
  },
  watch: {
    isDialogShow (newValue) {
      this.isShow = newValue
    }
  },
  methods: {
    sumbitClick () {
      const reslult = FormValidate.checkForm(this.form, this.rules)
      if (reslult.length) {
        this.toastT(reslult[0].message)
      } else {
        request({
          type: 'post',
          path: url.Affiliate.CreateEarningApply,
          data: this.form,
          fn: data => {
            if (data.success) {
              this.successT('提现订单创建成功')
            }
            this.onRefresh()
            this.onClose()
          },
          errFn: () => {
          }
        })
      }
    },
    onClose () {
      this.isShow = false
      this.$emit('onClose')
    },
    onRefresh () {
      this.$emit('onRefresh')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
.radio-group{
  display: flex;
  align-items: center;
  margin: 20px 0 0 10px;
  label{
    display: flex;
    align-items: center;
    margin-right: 10px;
    input{
      margin-right: 2px;
    }
  }
}
.btns{
  text-align: center;
  padding-top: 20px;
  button{
    background: @theme_primary;
    color: white;
    width: 90%;
    padding: 10px;
  }
}
</style>
