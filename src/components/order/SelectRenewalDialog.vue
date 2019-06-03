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
      <div class="pay-redio">
        <input type="radio" v-model="payType" value="0" /><label>支付宝</label>
      </div>
      <div class="btns">
        <button @click="renewalCancelClick">取消</button>
        <button @click="renewalOkClick">创建续期</button>
      </div>
    </div>
  </r-dialog>
</template>
<script>
import { request } from '@/utils'
import { url } from '@/const'
import { baseMixin } from '@/mixins'
import DialogOperateMixin from '@/mixins/dialog-operate-mixins'
export default {
  name: 'SelectRenewalDialog',
  mixins: [baseMixin, DialogOperateMixin],
  data () {
    return {
      renewals: []
    }
  },
  mounted () {
    this.getRenewals()
  },
  methods: {
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
      this.currentItem = ''
      this.onClose()
    },
    // 续期确认提交
    renewalOkClick () {
      if (!this.currentItem) {
        this.errorT('请选择续期')
      } else {
        this.$refs.renewalDialog.close()
        const params = {
          renewalId: this.currentItem.id,
          orderId: this.id
        }
        request({
          type: 'post',
          path: url.Loan.RenewalOrder,
          data: params,
          fn: data => {
            this.onRefresh()
            if (data.success) {
              const renewalId = data.result.id
              const orderId = data.result.orderId
              this.gotoAlipay(renewalId, orderId)
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
}
</style>
