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
      if (this.orderList.length < MAXRESULTCOUNT) {
        this.foreceUpdate()
        return
      }
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
          this.isShowMore = this.orderList.length < data.result.totalCount
        },
        errFn: () => {
          this.foreceUpdate()
        }
      })
    }
  }
}
export default OrderMixin
