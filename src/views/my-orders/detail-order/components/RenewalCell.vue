<template>
  <div class="cell">
    <div class="_flex">
      <div>天数</div>
      <div class="term">{{item.renewalDays}}天</div>
    </div>
    <div class="_flex">
      <div>利息</div>
      <div class="rate">{{item.renewalRate}}</div>
    </div>
    <div class="_flex">
      <div>服务费用</div>
      <div class="renewal-fee">{{item.renewalFee}}元</div>
    </div>
    <div class="_flex">
      <div>合计费用</div>
      <div class="total-fee">{{item.totalFee}}元</div>
    </div>
    <div class="_flex">
      <div>续期时间</div>
      <div class="create-time">{{getCreationTime}}</div>
    </div>
    <div class="pay" v-if="!item.isCancelled && !item.isCompleted">
      <div class="pay-redio">
        <input type="radio" v-model="payType" value="0" /><label>支付宝</label>
      </div>
      <div style="text-align: right">
        <button @click="renewalPayClick">支付</button>
        <button @click="renewalCancelClick">取消</button>
      </div>
    </div>
    <div v-else style="text-align: right">
      <div class="status" @click="renewalCancelClick">{{item.isCancelled?'已取消':'已完成' }}</div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { request } from '@/utils'
import { url } from '@/const'
import { baseMixin } from '@/mixins'
export default {
  name: 'RenewalCell',
  mixins: [baseMixin],
  props: {
    item: {}
  },
  data () {
    return {
      payType: 0
    }
  },
  computed: {
    getCreationTime () {
      return moment(this.item.creationTime).format('YYYY-MM-DD')
    }
  },
  methods: {
    renewalPayClick () {
      const payUrl = url.baseUrl + url.Alipay.WapPay +
        `?orderId=${this.item.id}&returnUrl=${url.domainUrl}/detail-order?id=${this.item.orderId}`
      window.location.href = payUrl
    },
    renewalCancelClick () {
      this.loadingT()
      const params = {
        remark: '',
        id: this.item.id
      }
      request({
        type: 'post',
        path: url.Loan.CancelRenewalOrder,
        data: params,
        fn: data => {
          if (data.success) {
            this.successT('续期取消成功')
          }
          this.$emit('onChange')
        },
        errFn: () => {
          this.hideT()
        }
      })
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
  }
  button{
    background: @theme_primary;
    font-size: @font_size_1;
    margin: 10px 0 0 10px;
    color: white;
    padding: 8px 15px;
  }
  button:first-child {
    margin-left: 0;
  }
  .status {
    color: @light_gray2;
  }
}
</style>
