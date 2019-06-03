<template>
  <base-page :navOptions="{title: '详细订单',isBack: true}">
    <better-scroll :bounce="false">
      <div class="order">
        <DetailOrderHeader :current="getStatusNum"/>
        <div class="space"></div>
        <order-status :order="order" @onRepay="repayClick" @onRenewal="renewalClick"/>
        <div class="space"></div>
        <div class="detail-list">
          <detail-order-cell title="单号" :text="order.id"/>
          <detail-order-cell title="借款金额" :text="`${order.applyGross}元`"/>
          <detail-order-cell title="借款天数" :text="`${order.applyTerm}`"/>
          <detail-order-cell title="应还金额" :text="`${order.needRepayGross}元`"/>
          <detail-order-cell title="应还时间" :text="order.agreedRepayTime|dateFormat"/>
          <detail-order-cell title="还款记录" text="查看还款" :arrow="true" @onClick="openRecordllist"/>
          <detail-order-cell title="续期记录" text="查看续期" :arrow="true" @onClick="openRenewallist"/>
          <detail-order-cell title="利息费用" :text="`${order.interestFee}元`"/>
          <detail-order-cell title="综合服务费用" :text="`${order.serviceFee}元`"/>
          <detail-order-cell title="放款金额" :text="`${order.loanGross}元`"/>
          <detail-order-cell title="签约时间" :text="order.creationTime | dateFormat"/>
        </div>
      </div>
    </better-scroll>
    <renewal-dialog
      :renewals="order.renewals"
      :isDialogShow="isRenewalShow"
      @onRefresh="onRefresh"
      :id="order.id"
      @onClose="isRenewalShow = false"/>
    <repayments-dialog
      :repayments="order.repayments"
      :isDialogShow="isRepaymentsShow"
      @onRefresh="onRefresh"
      :id="order.id"
      @onClose="isRepaymentsShow = false"/>
    <select-renewal-dialog
      :id="order.id"
      :isDialogShow="isSelectRenewalShow"
      @onRefresh="onRefresh"
      @onClose="isSelectRenewalShow = false"/>
    <order-repay
      :isDialogShow="isOrderOperateShow"
      :order="order"
      @onRefresh="onRefresh"
      @onClose="isOrderOperateShow = false"/>
  </base-page>
</template>

<script>
import { request } from '@/utils'
import { url } from '@/const'
import { baseMixin } from '@/mixins'
import DetailOrderHeader from './components/DetailOrderHeader'
import DetailOrderCell from './components/DetailOrderCell'
import RenewalDialog from './components/RenewalDialog'
import RepaymentsDialog from './components/RepaymentsDialog'
import SelectRenewalDialog from '@/components/order/SelectRenewalDialog'
import OrderRepay from '@/components/order/OrderRepay'
import statusData from '@/data/status-data'
import OrderStatus from '@/components/order/OrderStatus'
export default {
  name: 'OrderDetail',
  mixins: [baseMixin],
  data () {
    return {
      isRepaymentsShow: false,
      isOrderOperateShow: false,
      isSelectRenewalShow: false,
      isRenewalEnable: false,
      isRenewalShow: false,
      order: {
        id: '',
        alreadyVerifyName: '',
        applyGross: 0,
        applyTerm: 0,
        agreedRepayGross: 0,
        needVerifyName: '',
        statusName: '',
        loanGross: 0,
        interestFee: 0,
        serviceFee: 0,
        isRenewalAllowed: false
      }
    }
  },
  mounted () {
    this.getDetailOrder()
  },
  computed: {
    getStatusNum () {
      return statusData[this.order.statusName]
    }
  },
  methods: {
    onRefresh () {
      this.isSelectRenewalShow = false
      this.isOrderOperateShow = false
      this.isRepaymentsShow = false
      this.isRenewalShow = false
      this.getDetailOrder()
      this.sendNotification()
    },

    renewalClick () {
      this.isSelectRenewalShow = true
    },
    openRecordllist () {
      this.isRepaymentsShow = true
    },
    openRenewallist () {
      this.isRenewalShow = true
    },
    // 跨页刷新
    sendNotification () {
      this.bus.$emit('myOrdersRefresh')
    },
    // 还款
    repayClick () {
      this.isOrderOperateShow = true
    },
    // 获取订单
    getDetailOrder () {
      const id = this.$route.query.id
      request({
        type: 'post',
        path: url.Loan.GetOrderDetail,
        data: { id: id },
        fn: data => {
          const order = data.result
          this.isRenewalEnable = order.isRenewalAllowed
          const renewals = order.renewals
          if (renewals) {
            renewals.some((item) => {
              if (!item.isCancelled && !item.isCompleted) {
                this.isRenewalEnable = false
                return true
              } else {
                this.isRenewalEnable = true
              }
            })
          }
          this.order = order
        },
        errFn: () => {
        }
      })
    }
  },
  components: {
    OrderStatus,
    OrderRepay,
    SelectRenewalDialog,
    DetailOrderCell,
    DetailOrderHeader,
    RenewalDialog,
    RepaymentsDialog
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.cube-radio{
  padding: 0;
}
.order{
  background: white;
  .space {
    border-top: 10px solid @light_gray;
  }
  .remind{
    padding: 10px @space1;
    .title{
      font-size: @font_size_4;
      font-weight: bold;
      text-align: center;
      padding: 5px 0;
    }
    .status{
      text-align: center;
      color: @theme_color3;
    }
    .desc{
      padding: 4px 0;
      line-height: 20px;
      color: @light_gray2;
    }
    .operate{
      text-align: center;
      padding-top: 10px;
      display: flex;
      justify-content: center;
      button{
        background: #ff8303;
        color: #fff;
        font-size: @font_size_2;
        padding: 10px;
        border-radius: 4px;
        margin-left: 10px;
      }
      button:first-child {
        margin-left: 0;
      }
      .cancel-btn{
        padding: 0;
        background: none;
        color: @light_gray2;
      }
    }
  }
  .detail-list{
    padding: 10px 0 40px 0;
  }
}

</style>
