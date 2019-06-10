import { url, isApp } from '@/const'
import { mapGetters } from 'vuex'
import { request, apid } from '@/utils'
const DialogOperateMixin = {
  props: {
    isDialogShow: {
      default: false
    },
    id: String
  },
  data () {
    return {
      isShow: false,
      payType: 0,
      currentItem: ''
    }
  },
  computed: {
    ...mapGetters(['baseUrl'])
  },
  watch: {
    isDialogShow (newValue) {
      this.isShow = newValue
    }
  },
  methods: {
    gotoAlipay (itemId, orderId) {
      if (!isApp) {
        const payUrl = this.baseUrl + url.Alipay.WapPay +
          `?orderId=${itemId}&returnUrl=${url.domainUrl}?orderId=${orderId}`
        window.open(payUrl, '_blank')
        this.alertT('订单支付', () => {
          this.onRefresh()
        }, () => {
          this.onClose()
        }, '支付完成', '支付出问题')
      } else {
        request({
          type: 'get',
          path: url.Alipay.AppPay,
          data: {
            orderId: itemId
          },
          fn: (result) => {
            apid.payOrder(result, (ret, err) => {
              this.alertTT('支付结果', ret.code === '9000' ? '支付成功' : '支付失败')
              this.onRefresh()
            })
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
export default DialogOperateMixin
