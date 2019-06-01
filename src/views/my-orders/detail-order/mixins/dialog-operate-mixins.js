import { url } from '@/const'
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
  watch: {
    isDialogShow (newValue) {
      this.isShow = newValue
    }
  },
  methods: {
    gotoAlipay (itemId, orderId) {
      const payUrl = url.baseUrl + url.Alipay.WapPay +
        `?orderId=${itemId}&returnUrl=${url.domainUrl}?orderId=${orderId}`
      window.open(payUrl, '_blank')
      this.alertT('订单支付', () => {
        this.onRefresh()
      }, () => {
        this.onClose()
      }, '支付完成', '支付出问题')
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
