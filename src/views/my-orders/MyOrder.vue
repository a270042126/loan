<template>
  <base-page :navOptions="{ title: '我的订单', isBack: true}">
    <my-order-filter />
    <better-scroll :data="orderList" ref="scroll"
                    :pullUpLoad="isShowMore"
                    :pullDownRefresh="true"
                 @pulling-down="onPullingDown"
                 @pulling-up="onPullingUp">
      <div class="loading" v-if="isLoading">
        <loading />
      </div>
      <div v-else class="content">
        <template v-for="(item, index) in orderList">
          <my-orders-cell :key="index" :item="item"/>
        </template>
        <div v-if="!isLoading && orderList.length === 0" class="empty">
          <img src="../../assets/images/error-order.png">
          <router-link :to="{path:'loan-product'}">
            <cube-button>前往借款</cube-button>
          </router-link>
        </div>
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
import MyOrdersCell from './components/MyOrdersCell'
import MyOrderFilter from './components/MyOrderFilter'
import { request } from 'js/utils'
import { url } from 'js/const'
import { baseMixin } from 'js/mixins'
const MAXRESULTCOUNT = 25
export default {
  name: 'MyOrders',
  mixins: [baseMixin],
  data () {
    return {
      isShowMore: false,
      orderList: [],
      skipCount: 0
    }
  },
  mounted () {
    this.getOrders()
    this.accapceNotification()
  },
  destroyed () {
    this.bus.$off('myOrdersRefresh')
  },
  methods: {
    accapceNotification () {
      const that = this
      this.bus.$on('myOrdersRefresh', () => {
        console.log('myOrdersRefresh')
        that.onPullingDown()
      })
    },
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
  },
  components: {
    MyOrdersCell,
    MyOrderFilter
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.cube-scroll-wrapper{
  background: @light_gray;
}
.content{
  padding-top: 20px;
  .empty {
    a{
      width: 100%;
      button{
        color: black;
        background: @theme_primary;
      }
    }
  }
}
</style>
