<template>
  <div>
    <r-dialog ref="recordListDialog" title="还款记录" :isDialogShow="isShow" @onClose="onClose">
      <better-scroll :data="repayments" :crollbar="{fade: false}" class="record-scroll">
        <template v-for="(item, key) in repayments">
          <div class="cell" :key="key">
            <div class="_flex">
              <div>还款订单号</div>
              <div class="term">{{item.id}}</div>
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
            <div class="_flex" v-if="item.isCompleted">
              <div>完成时间</div>
              <div>{{item.completedTime|dateFormat}}</div>
            </div>
            <div class="_flex" v-if="item.isCancelled">
              <div>取消时间</div>
              <div>{{item.cancelledTime|dateFormat}}</div>
            </div>
            <div class="_flex operate" v-if="!item.isCompleted && !item.isCancelled">
              <div v-if="payEnable">
                <ul class="pay-redio" style="margin-bottom: 10px">
                  <template v-for="(item, key) in payList">
                    <li v-if="getPlatform(item)" :key="key">
                      <input type="radio" v-model="payType" :value="item.type"/><label>{{item.typeName}}</label>
                    </li>
                  </template>
                </ul>
                <button class="cancel-btn" @click="okRepayClick(item)"
                        v-stat="{category:'按钮点击事件', action:'还款记录', name: '支付'}">支付</button>
                <button class="cancel-btn" @click="cancelRepayClick(item)"
                        v-stat="{category:'按钮点击事件', action:'还款记录', name: '取消还款'}">取消还款</button>
              </div>
              <p class="pay-mess" v-else>
                {{!isApp ? '暂无有效支付方式，请使用APP支付或联系工作人员' : '暂无有效支付方式，联系工作人员'}}
              </p>
            </div>
            <div v-else class="status">
              <p v-if="item.isCompleted">已完成</p>
              <p v-if="item.isCancelled">已取消</p>
            </div>
          </div>
        </template>
      </better-scroll>
    </r-dialog>
    <r-dialog ref="cancelOrderDialog" title="取消还款" :isDialogShow="isCancelShow" @onClose="isCancelShow = false">
      <div class="cancel-order">
        <textarea v-model="remark" placeholder="备注...." class="remark">
        </textarea>
        <button class="simple-btn remark_btn" @click="sureCancelClick"
                v-stat="{category:'按钮点击事件', action:'还款记录', name: '取消还款提交'}">提交</button>
      </div>
    </r-dialog>
  </div>
</template>

<script>
import { request, common } from '@/utils'
import { url } from '@/const'
import { baseMixin, payMixin } from '@/mixins'
export default {
  name: 'RepaymentsCell',
  mixins: [baseMixin, payMixin],
  props: {
    repayments: Array,
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
      remark: '',
      isCancelShow: false,
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
    sureCancelClick () {
      common.trackEvent('按钮点击事件', '我的订单', '取消还款')
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
          this.isCancelShow = false
          this.onRefresh()
        },
        errFn: () => {
        }
      })
      this.currentItem = ''
    },
    okRepayClick (item) {
      common.trackEvent('按钮点击事件', '我的订单', '还款支付')
      const tempPage = window.open('', '_blank')
      this.gotoAlipay(item.id, this.id, tempPage)
    },
    cancelRepayClick (item) {
      this.currentItem = item
      this.isCancelShow = true
      this.onClose()
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.record-scroll{
  height: 300px;
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
    .remark{
      width: 140px;
      text-align: right;
      font-size: @font_size_1;
    }
  }
  .status{
    justify-content: flex-end;
    color: @light_gray2;
    text-align: right;
    padding-top: 5px;
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
      color: white;
    }
    button:first-child{
      margin-left: 0;
    }
  }
}
</style>
