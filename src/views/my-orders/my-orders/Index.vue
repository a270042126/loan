<template>
  <base-page :navOptions="{ title: '我的订单', isBack: true}">
    <my-order-filter @filterChange="filterChange" :searchFlag="params.searchFlag"/>
    <better-scroll :data="orderList" ref="scroll"
                    :pullUpLoad="true"
                    :pullDownRefresh="true"
                 @pulling-down="onPullingDown"
                 @pulling-up="onPullingUp">
      <div class="content">
        <order-list :list="orderList" @onRepay="onRepay"/>
        <div v-if="!isLoading && orderList.length === 0" class="empty">
          <router-link :to="{path:'loan-product'}">
            <button class="simple-btn">前往借款</button>
          </router-link>
        </div>
      </div>
    </better-scroll>
    <order-repay :isDialogShow="isOrderOperate" :order="currentItem" @onRefresh="onRefresh" @onClose="isOrderOperate = false"/>
  </base-page>
</template>

<script>
import MyOrderFilter from './components/MyOrderFilter'
import { baseMixin, orderMixin } from '@/mixins'
import OrderList from '@/components/order/OrderList'
import OrderRepay from '@/components/order/OrderRepay'
export default {
  name: 'MyOrders',
  mixins: [baseMixin, orderMixin],
  data () {
    return {
      isOrderOperate: false,
      currentItem: {}
    }
  },
  mounted () {
    const searchFlag = this.$route.query.searchFlag
    this.params.searchFlag = searchFlag || 4
    this.onRefresh()
  },
  methods: {
    onRefresh () {
      this.isOrderOperate = false
      this.onPullingDown()
    },
    onRepay (item) {
      this.currentItem = item
      this.isOrderOperate = true
    },
    filterChange (value) {
      this.params.searchFlag = value
      this.onPullingDown()
    }
  },
  components: {
    OrderRepay,
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
