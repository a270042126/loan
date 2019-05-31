import { url } from '@/const'
const DialogOperateMixin = {
  props: {
    isDialogShow: {
      default: false,
      id: String
    }
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
      window.location.href = payUrl
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
