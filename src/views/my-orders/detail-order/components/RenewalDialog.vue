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
            <div v-if="payEnable">
              <ul class="pay-redio" style="margin-bottom: 10px">
                <template v-for="(item, key) in payList">
                  <li v-if="getPlatform(item)" :key="key">
                    <input type="radio" v-model="payType" :value="item.type"/><label>{{item.typeName}}</label>
                  </li>
                </template>
              </ul>
              <div style="text-align: right">
                <button @click="renewalPayClick(item)"
                        v-stat="{category:'按钮点击事件', action:'续期记录', name: '支付' + item.renewalDays}">支付</button>
                <button @click="renewalCancelClick(item)"
                        v-stat="{category:'按钮点击事件', action:'续期记录', name: '取消' + item.renewalDays}">取消</button>
              </div>
            </div>
            <p class="pay-mess" v-else>
              {{!isApp ? '暂无有效支付方式，请使用APP支付或联系工作人员' : '暂无有效支付方式，联系工作人员'}}
            </p>
          </div>
          <div v-else style="text-align: right">
            <div class="status" @click="renewalCancelClick"
                 v-stat="{category:'按钮点击事件', action:'续期记录', name: '取消' + item.renewalDays}">{{item.isCancelled?'已取消':'已完成' }}</div>
          </div>
        </div>
      </template>
    </better-scroll>
  </r-dialog>
</template>
<script>
import { request } from '@/utils'
import { url } from '@/const'
import { baseMixin, payMixin } from '@/mixins'
export default {
  name: 'RenewalCell',
  mixins: [baseMixin, payMixin],
  props: {
    renewals: Array,
    isDialogShow: {
      default: false
    },
    id: String
  },
  watch: {
    isDialogShow (newValue) {
      this.isShow = newValue
      this.getPaymentConfigs()
    }
  },
  data () {
    return {
      isShow: false,
      currentItem: ''
    }
  },
  methods: {
    onClose () {
      this.isShow = false
      this.$emit('onClose')
    },
    onRefresh () {
      this.$emit('onRefresh')
    },
    renewalPayClick (item) {
      const tempPage = window.open('', '_blank')
      this.gotoAlipay(item.id, this.id, tempPage)
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
