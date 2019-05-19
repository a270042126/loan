import { request } from 'js/utils'
import { url } from 'js/const'
const MAXRESULTCOUNT = 25
const OrderMixin = {
  data () {
    return {
      isShowMore: false,
      orderList: [],
      skipCount: 0
    }
  },
  methods: {
    onPullingUp () {
      if (this.orderList.length < MAXRESULTCOUNT) {
        this.foreceUpdate()
        return
      }
      this.skipCount = this.skipCount + MAXRESULTCOUNT
      this.getOrders(this.skipCount)
    },
    onPullingDown () {
      this.skipCount = 0
      this.getOrders(this.skipCount)
    },
    // 取消刷新
    foreceUpdate () {
      if (this.$refs.scroll) {
        this.$refs.scroll.forceUpdate()
      }
    },
    getOrders (skipCount) {
      const params = {
        skipCount: skipCount,
        maxResultCount: MAXRESULTCOUNT
      }
      request({
        type: 'post',
        path: url.GetOrders,
        data: params,
        fn: data => {
          this.isLoading = false
          if (skipCount > 0) {
            this.orderList = this.orderList.concat(data.result.items)
          } else {
            this.orderList = data.result.items
          }
          this.isShowMore = this.orderList.length < data.result.totalCount
        },
        errFn: () => {
          this.isLoading = false
          this.foreceUpdate()
        }
      })
    }
  }
}
export default OrderMixin
