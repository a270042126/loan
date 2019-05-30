import { request } from '@/utils'
import { url } from '@/const'

const orderOperateMixin = {
  methods: {
    createRepayRequest (id, repayGross) {
      const params = {
        orderId: id,
        repayGross: repayGross
      }
      request({
        type: 'post',
        path: url.Loan.RepayOrder,
        data: params,
        fn: data => {
          if (data.success) {
            const id = data.result.id
            const orderId = data.result.orderId
            const payUrl = url.baseUrl + url.Alipay.WapPay +
              `?orderId=${id}&returnUrl=${url.domainUrl}/detail-order?id=${orderId}`
            window.location.href = payUrl
          }
          this.$refs.repayDialog.close()
          this.onRefresh()
        },
        errFn: () => {
          this.hideT()
        }
      })
    }
  }
}
export default orderOperateMixin
