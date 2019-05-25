<template>
  <div>
    <r-dialog ref="cancelOrderDialog" title="取消订单">
      <div class="cancel-order">
        <textarea v-model="remark" placeholder="备注...." class="remark">
        </textarea>
        <button class="simple-btn remark_btn" @click="remarkClick">提交</button>
      </div>
    </r-dialog>
    <r-dialog ref="renewalDialog" title="选择续期" height="200px">
      <div class="renewal">
        <better-scroll class="scroll" :crollbar="{fade: false}">
          <template v-for="(item, key) in renewals">
            <detail-order-re-cell :key="key" :item="item" :check="selectRenewal === key"
                                  @onChange="selectRenewalClick(key)"/>
          </template>
        </better-scroll>
        <div class="btns">
          <button @click="renewalCancelClick">取消</button>
          <button @click="renewalOkClick">确定</button>
        </div>
      </div>
    </r-dialog>
  </div>
</template>

<script>
import DetailOrderReCell from './DetailOrderReCell'
import { request } from '@/utils'
import { url } from '@/const'
import { baseMixin } from '@/mixins'
export default {
  name: 'OrderOperate',
  mixins: [baseMixin],
  props: {
    id: String
  },
  components: {
    DetailOrderReCell
  },
  data () {
    return {
      selectRenewal: -1,
      renewals: [],
      remark: ''
    }
  },
  methods: {
    onRefresh () {
      this.$emit('onRefresh')
    },
    // 取消订单点击
    cancelClick () {
      this.$refs.cancelOrderDialog.open()
    },

    // 选择续期
    selectRenewalClick (key) {
      this.selectRenewal = key
    },

    // 续期取消
    renewalCancelClick () {
      this.$refs.renewalDialog.close()
    },
    // 续期
    renewalClick () {
      this.$refs.renewalDialog.open()
      request({
        type: 'post',
        path: url.GetProductRenewals,
        fn: data => {
          this.renewals = data.result.items
        }
      })
    },

    // 续期确认提交
    renewalOkClick () {
      if (this.selectRenewal < 0) {
        this.errorT('请选择续期')
      } else {
        this.$refs.renewalDialog.close()
        this.loadingT()
        const params = {
          renewalId: this.renewals[this.selectRenewal].id,
          orderId: this.id
        }
        request({
          type: 'post',
          path: url.RenewalOrder,
          data: params,
          fn: data => {
            this.hideT()
            this.successT('续期成功')
            this.onRefresh()
          },
          errFn: () => {
            this.hideT()
          }
        })
        this.selectRenewal = ''
      }
    },
    // 取消订单
    remarkClick () {
      this.loadingT()
      const params = {
        remark: this.remark,
        id: this.id
      }
      request({
        type: 'post',
        path: url.CancelOrder,
        data: params,
        fn: data => {
          this.hideT()
          this.successT('取消成功')
          this.$refs.cancelOrderDialog.close()
          this.onRefresh()
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
.cancel-order{
  .remark{
    border: 1px solid @light_gray2;
    width: 95%;
    height: 80px;
    padding: 4px;
    font-size: @font_size_2;
  }
  .remark_btn{
    display: block;
    font-size: @font_size_2 !important;
    margin: 20px auto 0 auto;
  }
}
.renewal{
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
}
</style>
