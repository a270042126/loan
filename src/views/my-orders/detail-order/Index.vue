<template>
  <base-page :navOptions="{title: '详细订单',isBack: true}">
    <better-scroll :bounce="false">
      <div class="order">
        <DetailOrderHeader :current="getStatusNum"/>
        <div class="space"></div>
        <div class="remind">
          <div class="title">{{`${order.applyGross}`}}元</div>
          <div class="status">{{order.statusName}}</div>
          <!--<div class="desc">原因：尊敬的客户，由于您本次提交的某些信息不符合我们的审核标准，您的借款已被取消</div>-->
          <div>
            <button v-if=" getStatusNum >= 4" @click="reapplyClick">重新借款</button>
            <button class="verify-btn" v-if="getStatusNum === 0"  @click="gotoVerifyClick">前往认证</button>
            <button class="cancel-btn" v-if="getStatusNum >= 0 && getStatusNum <= 2" @click="cancelClick">取消订单</button>
            <button v-if="getStatusNum === 3"  @click="repayClick">我要还款</button>
            <button class="renewal_btn" v-if="getStatusNum === 3 && isRenewalEnable"  @click="renewalClick">我要续期</button>
          </div>
        </div>
        <div class="space"></div>
        <div class="detail-list">
          <detail-order-cell title="单号" :text="order.id"/>
          <detail-order-cell title="借款金额" :text="`${order.applyGross}元`"/>
          <detail-order-cell title="借款天数" :text="`${order.applyTerm}`"/>
          <detail-order-cell title="续期记录" text="查看续期" :arrow="true" @onClick="openRenewallist"/>
          <detail-order-cell title="签约时间" :text="getCreationTime"/>
          <detail-order-cell title="利息费用" :text="`${order.interestFee}元`"/>
          <detail-order-cell title="综合服务费用" :text="`${order.serviceFee}元`"/>
          <detail-order-cell title="放款金额" :text="`${order.loanGross}元`"/>
          <detail-order-cell title="应还金额" :text="`${order.agreedRepayGross}元`"/>
          <detail-order-cell title="还款记录" text="查看还款" :arrow="true" @onClick="openRecordllist"/>
          <detail-order-cell title="应还时间" :text="getAgreedRepayTime"/>
        </div>
      </div>
    </better-scroll>
    <r-dialog ref="renewalListDialog" title="续期记录" height="400px">
      <better-scroll :crollbar="{fade: false}">
        <template v-for="(item, index) in order.renewals">
          <detail-order-re-l-cell :key="index" :item="item" @onChange="onRefresh"/>
        </template>
      </better-scroll>
    </r-dialog>
    <r-dialog ref="recordListDialog" title="还款记录" height="400px">
      <better-scroll :crollbar="{fade: false}">
        <template v-for="(item, index) in order.records">
          <detial-order-record-cell :key="index" :item="item" />
        </template>
      </better-scroll>
    </r-dialog>
    <order-operate :id="order.id" ref="orderOperate" @onRefresh="onRefresh"/>
  </base-page>
</template>

<script>
import moment from 'moment'
import { request, common } from '@/utils'
import { url } from '@/const'
import { baseMixin } from '@/mixins'
import DetailOrderHeader from './components/DetailOrderHeader'
import DetailOrderCell from './components/DetailOrderCell'
import DetailOrderReLCell from './components/DetailOrderReLCell'
import DetialOrderRecordCell from './components/DetialOrderRecordCell'
import OrderOperate from '@/components/order/OrderOperate'
export default {
  name: 'OrderDetail',
  mixins: [baseMixin],
  data () {
    return {
      isRenewalEnable: false,
      renewals: [],
      remark: '',
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
      return common.getStatusNum(this.order.statusName)
    },
    getCreationTime () {
      let time = this.order.creationTime
      return this.order && time ? moment(time).format('YYYY-MM-DD') : ''
    },
    getAgreedRepayTime () {
      let time = this.order.agreedRepayTime
      return this.order && time ? moment(time).format('YYYY-MM-DD') : ''
    }
  },
  methods: {
    onRefresh () {
      this.getDetailOrder()
      this.sendNotification()
    },
    // 跳转认证
    gotoVerifyClick () {
      this.$router.replace({ name: 'verify' })
    },
    // 取消订单点击
    cancelClick () {
      this.$refs.orderOperate.cancelClick()
    },
    renewalClick () {
      this.$refs.orderOperate.renewalClick()
    },
    openRecordllist () {
      this.$refs.recordListDialog.open()
    },
    openRenewallist () {
      this.$refs.renewalListDialog.open()
    },
    // 跨页刷新
    sendNotification () {
      this.bus.$emit('myOrdersRefresh')
    },
    // 还款
    repayClick () {},
    // 跳转重新借款
    reapplyClick () {
      this.$router.replace({ name: 'loan-product' })
    },
    // 获取订单
    getDetailOrder () {
      const id = this.$route.query.id
      request({
        type: 'post',
        path: url.GetOrderDetail,
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
    OrderOperate,
    DetailOrderCell,
    DetailOrderHeader,
    DetailOrderReLCell,
    DetialOrderRecordCell
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
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
    & > div:last-child{
      text-align: center;
      padding-top: 10px;
      button{
        background: #ff8303;
        color: #fff;
        font-size: @font_size_2;
        width: 90px;
        height: 34px;
        border-radius: 4px;
      }
      .cancel-btn{
        padding: 0 15px;
        background: none;
        color: @light_gray2;
      }
      .renewal_btn{
        margin-left: 15px;
        -webkit-tap-highlight-color:transparent;
      }
    }
  }
  .detail-list{
    padding: 10px 0 40px 0;
  }
}
</style>
