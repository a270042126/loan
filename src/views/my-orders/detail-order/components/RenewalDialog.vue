<template>
  <r-dialog ref="renewalListDialog" title="续期记录" :isDialogShow="isShow" @onClose="onClose">
    <better-scroll :data="renewals" :crollbar="{fade: false}" class="renewal-scroll">
      <template v-for="(item, key) in renewals">
        <div class="cell" :key="key">
          <div class="_flex">
            <div>天数</div>
            <div class="term">{{item.renewalDays}}天</div>
          </div>
          <div class="_flex">
            <div>利率</div>
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
            <div class="create-time">{{item.creationTime | dateFormat}}</div>
          </div>
          <div class="pay" v-if="!item.isCancelled && !item.isCompleted">
            <div class="pay-redio">
              <input type="radio" v-model="payType" value="0" /><label>支付宝</label>
            </div>
            <div style="text-align: right">
              <button @click="renewalPayClick(item)">支付</button>
              <button @click="renewalCancelClick(item)">取消</button>
            </div>
          </div>
          <div v-else style="text-align: right">
            <div class="status" @click="renewalCancelClick">{{item.isCancelled?'已取消':'已完成' }}</div>
          </div>
        </div>
      </template>
    </better-scroll>
  </r-dialog>
</template>
<script>
import { request } from '@/utils'
import { url } from '@/const'
import { baseMixin } from '@/mixins'
import DialogOperateMixin from '@/mixins/dialog-operate-mixins'
export default {
  name: 'RenewalCell',
  mixins: [baseMixin, DialogOperateMixin],
  props: {
    renewals: Array
  },
  methods: {
    renewalPayClick (item) {
      this.gotoAlipay(item.id, this.id)
    },
    renewalCancelClick (item) {
      this.alertT('你确定取消续期吗？', () => {
        const params = {
          remark: '',
          id: item.id
        }
        request({
          type: 'post',
          path: url.Loan.CancelRenewalOrder,
          data: params,
          fn: data => {
            if (data.success) {
              this.successT('续期取消成功')
            }
            this.onRefresh()
          },
          errFn: () => {
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.renewal-scroll{
  height: 250px;
}
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
