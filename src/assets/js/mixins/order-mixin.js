import { request } from 'js/utils'
import { url } from 'js/const'
const MAXRESULTCOUNT = 25
const OrderMixin = {
  data () {
    return {
      isShowMore: false,
      orderList: [],
      params: {
        sorting: '',
        maxResultCount: MAXRESULTCOUNT,
        skipCount: 0
      }
    }
  },
  mounted () {
    this.accapceNotification()
  },
  destroyed () {
    this.bus.$off('myOrdersRefresh')
  },
  methods: {
    accapceNotification () {
      const that = this
      this.bus.$on('myOrdersRefresh', () => {
        that.onPullingDown()
      })
    },
    onPullingUp () {
      this.params.skipCount = this.params.skipCount + MAXRESULTCOUNT
      this.getOrders()
    },
    onPullingDown () {
      this.params.skipCount = 0
      this.getOrders()
    },
    // 取消刷新
    foreceUpdate () {
      if (this.$refs.scroll) {
        this.$refs.scroll.forceUpdate()
      }
    },
    getOrders (callBack) {
      const params = this.params
      request({
        type: 'post',
        path: url.GetOrders,
        data: params,
        fn: data => {
          if (this.params.skipCount > 0) {
            this.orderList = this.orderList.concat(data.result.items)
          } else {
            this.orderList = data.result.items
          }
          if (callBack && typeof callBack === 'function') {
            callBack()
          }
        },
        errFn: () => {
          this.foreceUpdate()
        }
      })
    }
  }
}
export default OrderMixin
