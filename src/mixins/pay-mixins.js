import { url, isApp } from '@/const'
import { mapGetters } from 'vuex'
import { request, apid } from '@/utils'
const payMixin = {
  data () {
    return {
      payType: 2,
      payList: [],
      payEnable: false,
      isApp: isApp
    }
  },
  computed: {
    ...mapGetters(['baseUrl'])
  },
  methods: {
    getPaymentConfigs () {
      request({
        type: 'post',
        path: url.PaymentConfig.GetPaymentConfigs,
        fn: data => {
          const items = data.result.items
          items.some(item => {
            if (this.getPlatform(item)) {
              this.payEnable = true
              return true
            }
          })
          this.payList = items
        },
        errFn: () => {
        }
      })
    },
    getPlatform (item) {
      const platform = apid.systemType()
      if (platform === 'web') return item.hasWeb
      if (platform === 'android') return item.hasAndroid
      if (platform === 'ios') return item.hasIos
      else {
        return false
      }
    },
    gotoAlipay (itemId, orderId, browser, query) {
      if (!isApp) {
        const domainUrl = `https://${document.domain}`
        let payUrl = this.baseUrl + url.Alipay.WapPay +
          `?orderId=${itemId}&returnUrl=${domainUrl}`
        if (query) {
          payUrl += query
        } else {
          payUrl += `?orderId=${orderId}`
        }
        if (!browser) {
          window.open(payUrl, '_blank')
        } else {
          browser.location = payUrl
        }
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
    onRefresh () {},
    onClose () {}
  }
}
export default payMixin
