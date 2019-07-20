<template>
  <r-dialog ref="renewalDialog" title="选择续期" :isDialogShow="isShow" @onClose="onClose">
    <div class="renewal">
      <better-scroll :data="renewals" class="scroll" :crollbar="{fade: false}">
        <ul class="title">
          <li>天数</li>
          <li>利率</li>
          <li>服务费</li>
        </ul>
        <cube-radio-group @input="selectRenewalClick">
          <cube-radio
            v-for="(item, key) in renewals"
            :key="key"
            :option="{value: key}">
            <div class="renewal-cell">
              <div>
                <div class="term">{{item.value}}天</div>
                <div class="rate">{{item.rate}}</div>
                <div class="fee">{{item.fee}}元</div>
              </div>
            </div>
          </cube-radio>
        </cube-radio-group>
      </better-scroll>
      <div v-if="payEnable">
        <ul class="pay-redio" style="margin-bottom: 10px">
          <template v-for="(item, key) in payList">
            <li v-if="getPlatform(item)" :key="key">
              <input type="radio" v-model="payType" :value="item.type"/><label>{{item.typeName}}</label>
            </li>
          </template>
        </ul>
        <div class="btns">
          <button @click="renewalCancelClick">取消</button>
          <button @click="renewalOkClick"
                  v-stat="{category:'按钮点击事件', action:'订单', name: '创建续期'}">创建续期</button>
        </div>
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
export default {
  name: 'SelectRenewalDialog',
  mixins: [baseMixin, payMixin],
  props: {
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
      currentItem: '',
      renewals: []
    }
  },
  mounted () {
    this.getRenewals()
  },
  methods: {
    onClose () {
      this.isShow = false
      this.$emit('onClose')
    },
    onRefresh () {
      this.$emit('onRefresh')
    },
    // 选择续期
    selectRenewalClick (key) {
      this.currentItem = this.renewals[key]
    },
    // 续期
    getRenewals () {
      request({
        type: 'post',
        path: url.Loan.GetProductRenewals,
        fn: data => {
          this.renewals = data.result.items
        }
      })
    },
    // 续期取消
    renewalCancelClick () {
      common.trackEvent('按钮点击事件', '我的订单', '续期取消')
      this.currentItem = ''
      this.onClose()
    },
    // 续期确认提交
    renewalOkClick () {
      if (!this.currentItem) {
        this.errorT('请选择续期')
      } else {
        common.trackEvent('按钮点击事件', '我的订单', '续期支付')
        this.$refs.renewalDialog.close()
        const params = {
          renewalId: this.currentItem.id,
          orderId: this.id
        }
        const tempPage = window.open('', '_blank')
        request({
          type: 'post',
          path: url.Loan.RenewalOrder,
          data: params,
          fn: data => {
            this.onRefresh()
            if (data.success) {
              const renewalId = data.result.id
              const orderId = data.result.orderId
              this.gotoAlipay(renewalId, orderId, tempPage)
            }
          },
          errFn: () => {
          }
        })
        this.currentItem = ''
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.renewal{
  position: relative;
  ul{
    display: flex;
    justify-content: space-between;
    padding-left: 30px;
    li{
      padding-bottom: 10px;
    }
  }
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

  .renewal-cell{
    width: 100%;
    font-size: @font_size_2;
    display: flex;
    align-items: center;
    & > div {
      margin-left: 10px;
      flex: 1;
      display: flex;
      justify-content: space-between;
    }
  }
  ul{
    li {
      margin-right: 10px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
