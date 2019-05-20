<template>
  <base-page :navOptions="navOptions">
    <better-scroll :bounce="false">
      <div class="order">
        <DetailOrderHeader :current="getStatusNum"/>
        <div class="space"></div>
        <div class="remind">
          <div class="title">{{`${order.applyGross}`}}元</div>
          <div class="status">{{order.statusName}}</div>
          <!--<div class="desc">原因：尊敬的客户，由于您本次提交的某些信息不符合我们的审核标准，您的借款已被取消</div>-->
          <div>
            <button v-if="getStatusNum === -1 || getStatusNum >= 4" @click="reapplyClick">重新借款</button>
            <button class="verify-btn" v-if="getStatusNum === 0"  @click="gotoVerifyClick">前往认证</button>
            <button class="cancel-btn" v-if="getStatusNum >= 0 && getStatusNum <= 2" @click="cancelClick">取消订单</button>
            <button v-if="getStatusNum === 3"  @click="repayClick">我要还款</button>
            <button class="renewal_btn" v-if="getStatusNum === 3 && order.isRenewalAllowed"  @click="renewalClick">我要续期</button>
          </div>
        </div>
        <div class="space"></div>
        <div class="detail-list">
          <detail-order-cell title="单号" :text="order.id"/>
          <detail-order-cell title="借款人" :text="order.alreadyVerifyName"/>
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
    <r-dialog ref="cancelOrderDialog" title="取消订单" height="220px">
      <div class="cancel-order">
        <textarea v-model="remark" placeholder="备注...." class="remark">
        </textarea>
        <button class="simple-btn remark_btn" @click="remarkClick">提交</button>
      </div>
    </r-dialog>
    <r-dialog ref="renewalDialog" title="选择续期" height="200px">
      <div class="renewal">
        <better-scroll class="scroll" :crollbar="{fade: false}">
          <template v-for="(item, key) in renewals">
            <detail-order-re-cell :key="key" :item="item" :check="selectRenewal === key"
                                  @onChange="selectRenewalClick(key)"/>
          </template>
        </better-scroll>
        <div class="btns">
          <button @click="renewalCancelClick">取消</button>
          <button @click="renewalOkClick">确定</button>
        </div>
      </div>
    </r-dialog>
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
  </base-page>
</template>

<script>
import moment from 'moment'
import { request } from 'js/utils'
import { url } from 'js/const'
import { baseMixin } from 'js/mixins'
import DetailOrderHeader from './components/DetailOrderHeader'
import DetailOrderCell from './components/DetailOrderCell'
import DetailOrderReCell from './components/DetailOrderReCell'
import DetailOrderReLCell from './components/DetailOrderReLCell'
import DetialOrderRecordCell from './components/DetialOrderRecordCell'
export default {
  name: 'OrderDetail',
  mixins: [baseMixin],
  data () {
    return {
      navOptions: {
        title: '详细订单',
        isBack: true
      },
      selectRenewal: -1,
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
    console.log('this.onRefresh()')
    this.getDetailOrder()
  },
  computed: {
    getStatusNum () {
      switch (this.order.statusName) {
        case '已拒绝':
          return -1
        case '已取消':
          return -1
        case '待认证':
          return 0
        case '待审核':
          return 1
        case '待放款':
          return 2
        case '待还款':
          return 3
        case '已还款':
          return 4
        case '已完成':
          return 5
        default:
          return -1
      }
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
    openRecordllist () {
      this.$refs.recordListDialog.open()
    },
    openRenewallist () {
      this.$refs.renewalListDialog.open()
    },
    // 续期确认提交
    renewalOkClick () {
      if (this.selectRenewal < 0) {
        this.errorT('请选择续期')
      } else {
        this.$refs.renewalDialog.close()
        this.loadingT()
        const params = {
          renewalId: this.renewals[this.selectRenewal].id,
          orderId: this.order.id
        }
        request({
          type: 'post',
          path: url.RenewalOrder,
          data: params,
          fn: data => {
            this.hideT()
            this.successT('续期成功')
            this.onRefresh()
          },
          errFn: () => {
            this.hideT()
          }
        })
        this.selectRenewal = ''
      }
    },
    // 续期取消
    renewalCancelClick () {
      this.$refs.renewalDialog.close()
    },
    // 选择续期
    selectRenewalClick (key) {
      this.selectRenewal = key
    },
    // 续期
    renewalClick () {
      this.$refs.renewalDialog.open()
      request({
        type: 'post',
        path: url.GetProductRenewals,
        fn: data => {
          this.renewals = data.result.items
        }
      })
    },
    // 跨页刷新
    sendNotification () {
      this.bus.$emit('myOrdersRefresh')
    },
    // 还款
    repayClick () {},
    // 取消订单
    remarkClick () {
      this.loadingT()
      const params = {
        remark: this.remark,
        id: this.order.id
      }
      request({
        type: 'post',
        path: url.CancelOrder,
        data: params,
        fn: data => {
          this.hideT()
          this.successT('取消成功')
          this.$refs.cancelOrderDialog.close()
          this.onRefresh()
        },
        errFn: () => {
          this.hideT()
        }
      })
    },
    // 跳转认证
    gotoVerifyClick () {
      this.$router.replace({ name: 'verify' })
    },
    // 跳转重新借款
    reapplyClick () {
      this.$router.replace({ name: 'loan-product' })
    },
    // 取消订单点击
    cancelClick () {
      this.$refs.cancelOrderDialog.open()
    },
    // 获取订单
    getDetailOrder () {
      const id = this.$route.query.id
      request({
        type: 'post',
        path: url.GetOrderDetail,
        data: { id: id },
        fn: data => {
          this.order = data.result
        },
        errFn: () => {
        }
      })
    }
  },
  components: {
    DetailOrderCell,
    DetailOrderHeader,
    DetailOrderReCell,
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
        width: 80px;
        height: 34px;
        border-radius: 4px;
      }
      .cancel-btn{
        margin-left: 15px;
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
.cancel-order{
  .remark{
    border: 1px solid @light_gray2;
    width: 95%;
    height: 80px;
    padding: 4px;
    font-size: @font_size_2;
  }
  .remark_btn{
    display: block;
    font-size: @font_size_2 !important;
    margin: 20px auto 0 auto;
  }
}
.renewal{
  .scroll{
    height: 180px;
  }
  .btns{
    text-align: center;
    margin-top: 10px;
    button{
      width: 40%;
      height: 34px;
      line-height: 34px;
      background: @theme_primary;
    }
    button:last-child{
      margin-left: 10px;
    }
  }
}
</style>
