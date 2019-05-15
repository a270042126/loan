<template>
  <div class="cell">
    <div class="_flex">
      <div>交易流水号</div>
      <div class="term">{{item.tradeId}}</div>
    </div>
    <div class="_flex">
      <div>应付金额</div>
      <div>{{item.totalGross}}</div>
    </div>
    <div class="_flex">
      <div>实付金额</div>
      <div>{{item.revenueGross}}元</div>
    </div>
    <div class="_flex">
      <div>手续费用</div>
      <div>{{item.fee}}元</div>
    </div>
    <div class="_flex">
      <div>付款时间</div>
      <div>{{getPaymentTime}}</div>
    </div>
    <div class="_flex">
      <div>备注</div>
      <div class="remark">{{item.remark}}</div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'DetialOrderReCCell',
  props: {
    item: {}
  },
  computed: {
    getPaymentTime () {
      if (this.item.paymentTime) {
        return moment(this.item.paymentTime).format('YYYY-MM-DD')
      } else {
        return '无'
      }
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
    .display-flex();
    .flex-justify-content-space-between();
    .remark{
      width: 140px;
      text-align: right;
      font-size: @font_size_1;
    }
  }
}
</style>
