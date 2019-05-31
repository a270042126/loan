<template>
  <r-dialog ref="repayDialog" title="我要还款" :isDialogShow="isShow" @onClose="onClose">
    <div class="repay-div">
      <div class="input-group">
        <label>还款金额</label>
        <input v-model="repayGross" placeholder="还款金额...."/>
      </div>
      <div class="pay-redio" style="margin-bottom: 10px">
        <input type="radio" v-model="payType" value="0" /><label>支付宝</label>
      </div>
      <button class="simple-btn remark_btn" @click="createRepayClick">创建还款</button>
    </div>
  </r-dialog>
</template>

<script>
import { request } from '@/utils'
import { url } from '@/const'
import { baseMixin } from '@/mixins'
export default {
  name: 'OrderOperate',
  mixins: [baseMixin],
  props: {
    isDialogShow: {
      default: false
    },
    order: Object
  },
  data () {
    return {
      payType: 0,
      repayGross: 0,
      isShow: false
    }
  },
  watch: {
    isDialogShow (newValue) {
      this.isShow = newValue
    },
    order (newValue) {
      this.repayGross = newValue.needRepayGross
    }
  },
  methods: {
    onClose () {
      this.isShow = false
      this.$emit('onClose')
    },
    createRepayClick () {
      const params = {
        orderId: this.order.id,
        repayGross: this.repayGross
      }
      request({
        type: 'post',
        path: url.Loan.RepayOrder,
        data: params,
        fn: data => {
          this.$emit('onRefresh')
          if (data.success) {
            const id = data.result.id
            const orderId = data.result.orderId
            window.location.href = url.baseUrl + url.Alipay.WapPay +
              `?orderId=${id}&returnUrl=${url.domainUrl}?orderId=${orderId}`
          }
        },
        errFn: () => {
          this.hideT()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
.repay-div{
  .input-group{
    display: flex;
    flex-direction: column;
    padding: 10px 0;
    font-size: @font_size_3;
    label{
      color: @light_gray2;
      padding: 5px 5px;
    }
    input {
      flex: 1;
      border: 1px solid @light_gray;
      padding: 10px 5px;
    }
  }
  .radio{
    display: flex;
    align-items: center;
    margin: 5px 0;
  }
}
</style>
