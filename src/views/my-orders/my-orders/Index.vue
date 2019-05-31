<template>
  <base-page :navOptions="{ title: '我的订单', isBack: true}">
    <my-order-filter @filterChange="filterChange" :searchFlag="params.searchFlag"/>
    <better-scroll :data="orderList" ref="scroll"
                    :pullUpLoad="true"
                    :pullDownRefresh="true"
                 @pulling-down="onPullingDown"
                 @pulling-up="onPullingUp">
      <div class="content">
        <order-list :list="orderList"/>
        <div v-if="!isLoading && orderList.length === 0" class="empty">
          <router-link :to="{path:'loan-product'}">
            <button class="simple-btn">前往借款</button>
          </router-link>
        </div>
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
import MyOrderFilter from './components/MyOrderFilter'
import { baseMixin, orderMixin } from '@/mixins'
import OrderList from '@/components/order/OrderList'
export default {
  name: 'MyOrders',
  mixins: [baseMixin, orderMixin],
  mounted () {
    const searchFlag = this.$route.query.searchFlag
    this.params.searchFlag = searchFlag || 4
    this.onPullingDown()
  },
  methods: {
    filterChange (value) {
      this.params.searchFlag = value
      this.onPullingDown()
    }
  },
  components: {
    OrderList,
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
