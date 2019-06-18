<template>
  <r-dialog ref="payDialog" title="征信产品付款" :isDialogShow="isPayDialogShow" @onClose="onClose">
    <div class="repay-div">
      <div v-if="product" class="product">
        <label>支付价格：{{product.price}}</label>
      </div>
      <div class="pay-redio" style="margin-bottom: 10px">
        <input type="radio" v-model="payType" value="0" /><label>支付宝</label>
      </div>
      <button class="simple-btn remark_btn" @click="createRepayClick">创建订单</button>
    </div>
  </r-dialog>
</template>

<script>
import { isApp, url } from '@/const'
import { request, apid } from '@/utils'
import { baseMixin } from '@/mixins'
import { mapGetters } from 'vuex'
export default {
  name: 'CreditPayDialog',
  props: {
    isShow: Boolean,
    product: null
  },
  mixins: [baseMixin],
  data () {
    return {
      payType: 0,
      isPayDialogShow: false
    }
  },
  watch: {
    isShow (newValue) {
      this.isPayDialogShow = newValue
    },
    product (newValue) {}
  },
  computed: {
    ...mapGetters(['baseUrl'])
  },
  methods: {
    createRepayClick () {
      request({
        type: 'post',
        path: url.Credit.CreateCreditOrder,
        data: { productId: this.product.id },
        fn: data => {
          console.log(data)
          const id = data.result
          this.pay(id)
        },
        errFn: () => {
        }
      })
    },
    pay (id) {
      if (!isApp) {
        const domainUrl = `https://${document.domain}`
        const payUrl = this.baseUrl + url.Alipay.WapPay +
          `?orderId=${id}&returnUrl=${domainUrl}?from=credit-info`
        window.open(payUrl, '_blank')
        this.alertT('订单支付', () => {
          this.$emit('onRefresh')
        }, () => {
          this.onClose()
        }, '支付完成', '支付出问题')
      } else {
        request({
          type: 'get',
          path: url.Alipay.AppPay,
          data: {
            orderId: id
          },
          fn: (result) => {
            apid.payOrder(result, (ret, err) => {
              this.alertTT('支付结果', ret.code === '9000' ? '支付成功' : '支付失败')
              this.$emit('onRefresh')
            })
          }
        })
      }
    },
    onClose () {
      this.isPayDialogShow = false
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.product{
  label{
    font-size: @font_size_3;
  }
}
</style>
