<template>
  <r-dialog ref="repayDialog" title="我要还款" :isDialogShow="isShow" @onClose="onClose">
    <div class="repay-div">
      <div class="input-group">
        <label>还款金额</label>
        <input v-model="repayGross" placeholder="还款金额...."/>
      </div>
      <div v-if="payEnable">
        <ul class="pay-redio" style="margin-bottom: 10px">
          <template v-for="(item, key) in payList">
            <li v-if="getPlatform(item)" :key="key">
              <input type="radio" v-model="payType" :value="item.type"/><label>{{item.typeName}}</label>
            </li>
          </template>
        </ul>
        <button class="simple-btn remark_btn" @click="createRepayClick"
                v-stat="{category:'按钮点击事件', action:'订单', name: '创建还款'}">创建还款</button>
      </div>
      <p class="pay-mess" v-else>
        {{!isApp ? '暂无有效支付方式，请使用APP支付或联系工作人员' : '暂无有效支付方式，联系工作人员'}}
      </p>
    </div>
  </r-dialog>
</template>

<script>
import { request, common } from '@/utils'
import { url } from '@/const'
import { baseMixin, payMixin } from '@/mixins'
import { mapGetters } from 'vuex'

export default {
  name: 'OrderRepay',
  mixins: [baseMixin, payMixin],
  props: {
    isDialogShow: {
      default: false
    },
    order: Object
  },
  data () {
    return {
      payList: [],
      payType: 2,
      repayGross: 0,
      isShow: false
    }
  },
  computed: {
    ...mapGetters(['baseUrl'])
  },
  watch: {
    isDialogShow (newValue) {
      this.isShow = newValue
      this.getPaymentConfigs()
    },
    order (newValue) {
      this.repayGross = newValue.needRepayGross
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
    createRepayClick () {
      common.trackEvent('按钮点击事件', '我的订单', '订单支付')
      const params = {
        orderId: this.order.id,
        repayGross: this.repayGross
      }
      const tempPage = window.open('', '_blank')
      request({
        type: 'post',
        path: url.Loan.RepayOrder,
        data: params,
        fn: data => {
          if (data.success) {
            const id = data.result.id
            const orderId = data.result.orderId
            this.gotoAlipay(id, orderId, tempPage)
          }
        },
        errFn: () => {
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
.repay-div{
  .input-group{
    display: flex;
    flex-direction: column;
    padding: 10px 0;
    font-size: @font_size_3;
    label{
      color: @light_gray2;
      padding: 5px 5px;
    }
    input {
      flex: 1;
      border: 1px solid @light_gray;
      padding: 10px 5px;
    }
  }
  .radio{
    display: flex;
    align-items: center;
    margin: 5px 0;
  }
}
</style>
