<template>
  <div class="cell">
    <div class="_flex">
      <div>借款订单号</div>
      <div class="term">{{item.orderId}}</div>
    </div>
    <div class="_flex">
      <div>还款金额</div>
      <div>{{item.repayGross}}元</div>
    </div>
    <div class="_flex">
      <div>是否完成</div>
      <div>{{item.isCompleted ? '是' : '否'}}</div>
    </div>
    <div class="_flex">
      <div>是否取消</div>
      <div>{{item.isCancelled ? '是' : '否'}}</div>
    </div>
    <div class="_flex">
      <div>完成时间</div>
      <div>{{getCompletedTime}}</div>
    </div>
    <div class="_flex operate" v-if="!item.isCompleted && !item.isCancelled">
      <div class="pay-redio">
        <input type="radio" v-model="payType" value="0" /><label>支付宝</label>
      </div>
      <button class="cancel-btn" @click="okRepayClick">支付</button>
      <button class="cancel-btn" @click="cancelRepayClick">取消还款</button>
    </div>
  </div>
</template>

<script>
import { url } from '@/const'
import moment from 'moment'
export default {
  name: 'RepaymentsCell',
  props: {
    item: {}
  },
  data () {
    return {
      payType: 0
    }
  },
  computed: {
    getCompletedTime () {
      if (this.item.completedTime) {
        return moment(this.item.completedTime).format('YYYY-MM-DD HH:MM')
      } else {
        return '无'
      }
    }
  },
  methods: {
    okRepayClick () {
      const payUrl = url.baseUrl + url.Alipay.WapPay +
        `?orderId=${this.item.id}&returnUrl=${url.domainUrl}/detail-order?id=${this.item.orderId}`
      window.location.href = payUrl
    },
    cancelRepayClick () {
      this.$emit('onCancelRepay')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.cell {
  text-align: center;
  font-size: @font_size_2;
  border-bottom: 1px solid @light_gray;
  padding: 10px 0;
  ._flex{
    line-height: 20px;
    display: flex;
    justify-content: space-between;
    .remark{
      width: 140px;
      text-align: right;
      font-size: @font_size_1;
    }
  }
  ._flex:last-child {
    justify-content: flex-end;
    margin-top: 10px;
  }
  .operate{
    align-items: center;
    & > div{
      flex: 1;
      display: flex;
      align-items: center;
    }
    button{
      background: @theme_primary;
      padding: 5px 10px;
      margin-left: 10px;
    }
    button:first-child{
      margin-left: 0;
    }
  }
}
</style>
