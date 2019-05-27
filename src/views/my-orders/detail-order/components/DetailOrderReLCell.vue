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
    <div v-if="!item.isCancelled && !item.isCompleted" style="text-align: right">
      <button class="cancel" @click="renewalCancelClick">取消</button>
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
  name: 'DetailOrderReLCell',
  mixins: [baseMixin],
  props: {
    item: {}
  },
  computed: {
    getCreationTime () {
      return moment(this.item.creationTime).format('YYYY-MM-DD')
    }
  },
  methods: {
    renewalCancelClick () {
      this.loadingT()
      const params = {
        remark: '',
        id: this.item.orderId
      }
      request({
        type: 'post',
        path: url.CancelRenewalOrder,
        data: params,
        fn: data => {
          this.hideT()
          this.successT('续期取消成功')
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
  .cancel{
    background: @theme_primary;
    font-size: @font_size_1;
    margin-top: 10px;
    color: white;
    padding: 8px 15px;
  }
  .status{
    color: @light_gray2;
  }
}
</style>
