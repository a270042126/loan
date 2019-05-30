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
          <div class="operate">
            <button v-if=" getStatusNum >= 4" @click="reapplyClick">重新借款</button>
            <button class="verify-btn" v-if="getStatusNum === 0"  @click="gotoVerifyClick">前往认证</button>
            <div v-if="getStatusNum === 3">
              <button @click="repayClick">我要还款</button>
            </div>
            <button class="renewal_btn" v-if="getStatusNum === 3 && isRenewalEnable"  @click="renewalClick">我要续期</button>
            <button class="cancel-btn" v-if="getStatusNum >= 0 && getStatusNum <= 2"  @click="cancelOrderClick">取消订单</button>
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
          <detail-order-cell title="应还金额" :text="`${order.needRepayGross}元`"/>
          <detail-order-cell title="还款记录" text="查看还款" :arrow="true" @onClick="openRecordllist"/>
          <detail-order-cell title="应还时间" :text="getAgreedRepayTime"/>
        </div>
      </div>
    </better-scroll>
    <r-dialog ref="renewalListDialog" title="续期记录">
      <better-scroll :crollbar="{fade: false}" class="renewal-scroll">
        <template v-for="(item, index) in order.renewals">
          <renewal-cell :key="index" :item="item" @onChange="onRefresh"/>
        </template>
      </better-scroll>
    </r-dialog>
    <r-dialog ref="recordListDialog" title="还款记录">
      <better-scroll :crollbar="{fade: false}" class="record-scroll">
        <template v-for="(item, index) in order.repayments">
          <repayments-cell :key="index" :item="item" @onCancelRepay="cancelRepayClick(item)"/>
        </template>
      </better-scroll>
    </r-dialog>
    <r-dialog ref="cancelOrderDialog" :title="cancelType === 0 ? '取消订单' : '取消还款'">
      <div class="cancel-order">
        <textarea v-model="remark" placeholder="备注...." class="remark">
        </textarea>
        <button class="simple-btn remark_btn" @click="sureCancelClick">提交</button>
      </div>
    </r-dialog>
    <r-dialog ref="renewalDialog" title="选择续期">
      <div class="renewal">
        <better-scroll class="scroll" :crollbar="{fade: false}">
          <cube-radio-group @input="selectRenewalClick">
            <cube-radio
              v-for="(item, key) in renewals"
              :key="key"
              :option="{value: key}">
              <select-renewal-cell :item="item"/>
            </cube-radio>
          </cube-radio-group>
        </better-scroll>
        <div class="pay-redio">
          <input type="radio" v-model="payType" value="0" /><label>支付宝</label>
        </div>
        <div class="btns">
          <button @click="renewalCancelClick">取消</button>
          <button @click="renewalOkClick">创建续期</button>
        </div>
      </div>
    </r-dialog>
    <r-dialog ref="repayDialog" title="我要还款">
      <div class="repay-div">
        <div class="input-group">
          <label>还款金额</label>
          <input v-model="repayGross" placeholder="还款金额...."/>
        </div>
        <div class="pay-redio" style="margin-bottom: 10px">
          <input type="radio" v-model="payType" value="0" /><label>支付宝</label>
        </div>
        <button class="simple-btn remark_btn" @click="createRepayClick">创建还款</button>
      </div>
    </r-dialog>
  </base-page>
</template>

<script>
import moment from 'moment'
import { request, common } from '@/utils'
import { url } from '@/const'
import { baseMixin, orderOperateMixin } from '@/mixins'
import DetailOrderHeader from './components/DetailOrderHeader'
import DetailOrderCell from './components/DetailOrderCell'
import RenewalCell from './components/RenewalCell'
import RepaymentsCell from './components/RepaymentsCell'
import SelectRenewalCell from './components/SelectRenewalCell'
export default {
  name: 'OrderDetail',
  mixins: [baseMixin, orderOperateMixin],
  data () {
    return {
      isRenewalEnable: false,
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
      },
      renewals: [],
      remark: '',
      cancelType: 0,
      currentItem: '',
      repayGross: '',
      payType: 0
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
    createRepayClick () {
      this.createRepayRequest(this.order.id, this.repayGross)
    },
    // 跳转认证
    gotoVerifyClick () {
      this.$router.replace({ name: 'verify' })
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
    repayClick () {
      this.repayGross = this.order.needRepayGross
      this.$refs.repayDialog.open()
    },
    // 跳转重新借款
    reapplyClick () {
      if (this.$route.query.from === 'loan') {
        this.$router.goBack()
      } else {
        this.$router.replace({ name: 'loan-product' })
      }
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
          console.log(order)
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
    },

    cancelRepayClick (item) {
      this.currentItem = item
      this.cancelType = 1
      this.$refs.recordListDialog.close()
      this.openCancelDialog()
    },

    cancelOrderClick () {
      this.cancelType = 0
      this.openCancelDialog()
    },

    openCancelDialog () {
      this.remark = ''
      this.$refs.cancelOrderDialog.open()
    },

    // 取消订单
    sureCancelClick () {
      this.loadingT()
      if (this.cancelType === 0) {
        this.cancelOrderRequest()
      } else {
        this.cancelRepayRequest()
      }
    },

    cancelRepayRequest () {
      const params = {
        remark: this.remark,
        id: this.currentItem.id
      }
      request({
        type: 'post',
        path: url.Loan.CancelRepayOrder,
        data: params,
        fn: data => {
          if (data.success) {
            this.successT('取消还款成功')
          }
          this.$refs.cancelOrderDialog.close()
          this.onRefresh()
        },
        errFn: () => {
          this.hideT()
        }
      })
      this.currentItem = ''
    },

    cancelOrderRequest () {
      const params = {
        remark: this.remark,
        id: this.order.id
      }
      request({
        type: 'post',
        path: url.Loan.CancelOrder,
        data: params,
        fn: data => {
          if (data.success) {
            this.successT('取消订单成功')
          }
          this.$refs.cancelOrderDialog.close()
          this.onRefresh()
        },
        errFn: () => {
          this.hideT()
        }
      })
    },
    // 选择续期
    selectRenewalClick (key) {
      this.currentItem = this.renewals[key]
    },

    // 续期取消
    renewalCancelClick () {
      this.currentItem = ''
      this.$refs.renewalDialog.close()
    },
    // 续期
    renewalClick () {
      this.$refs.renewalDialog.open()
      request({
        type: 'post',
        path: url.Loan.GetProductRenewals,
        fn: data => {
          this.renewals = data.result.items
        }
      })
    },

    // 续期确认提交
    renewalOkClick () {
      if (!this.currentItem) {
        this.errorT('请选择续期')
      } else {
        this.$refs.renewalDialog.close()
        this.loadingT()
        const params = {
          renewalId: this.currentItem.id,
          orderId: this.order.id
        }
        request({
          type: 'post',
          path: url.Loan.RenewalOrder,
          data: params,
          fn: data => {
            if (data.success) {
              // this.successT('续期添加成功')
              console.log(data)
              const renewalId = data.result.id
              const orderId = data.result.orderId
              const payUrl = url.baseUrl + url.Alipay.WapPay +
                `?orderId=${renewalId}&returnUrl=${url.domainUrl}/detail-order?id=${orderId}`
              window.location.href = payUrl
            }
            this.onRefresh()
          },
          errFn: () => {
            this.hideT()
          }
        })
        this.currentItem = ''
      }
    }
  },
  components: {
    SelectRenewalCell,
    DetailOrderCell,
    DetailOrderHeader,
    RenewalCell,
    RepaymentsCell
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.cube-radio{
  padding: 0;
}
.renewal-scroll{
  height: 250px;
}
.record-scroll{
  height: 300px;
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
  position: relative;
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
