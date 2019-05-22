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
  methods: {
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
    getOrders () {
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
          // if (this.orderList.length < data.result.totalCount) {
          //   this.$refs.scroll.openPullUp()
          // } else {
          //   this.$refs.scroll.closePullUp()
          // }
        },
        errFn: () => {
          this.foreceUpdate()
        }
      })
    }
  }
}
export default OrderMixin
