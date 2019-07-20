<template>
  <r-dialog ref="payDialog" title="征信产品付款" :isDialogShow="isPayDialogShow" @onClose="onClose">
    <div class="repay-div">
      <div v-if="product" class="product">
        <label>支付价格：{{product.price}}</label>
      </div>
      <div v-if="payEnable">
        <ul class="pay-redio" style="margin-bottom: 10px">
          <template v-for="(item, key) in payList">
            <li v-if="getPlatform(item)" :key="key">
              <input type="radio" v-model="payType" :value="item.type"/><label>{{item.typeName}}</label>
            </li>
          </template>
        </ul>
        <button class="simple-btn remark_btn" @click="pay"
                v-stat="{category:'按钮点击事件', action:'征信', name: '支付'+product.name}">支付</button>
      </div>
      <p class="pay-mess" v-else>
        {{!isApp ? '暂无有效支付方式，请使用APP支付或联系工作人员' : '暂无有效支付方式，联系工作人员'}}
      </p>
    </div>
  </r-dialog>
</template>

<script>
import { baseMixin, payMixin } from '@/mixins'

export default {
  name: 'CreditPayDialog',
  props: {
    isShow: Boolean,
    product: null,
    orderId: null
  },
  mixins: [baseMixin, payMixin],
  data () {
    return {
      payType: 2,
      payList: [],
      isPayDialogShow: false
    }
  },
  watch: {
    isShow (newValue) {
      this.isPayDialogShow = newValue
      this.getPaymentConfigs()
    },
    product (newValue) {}
  },
  methods: {
    onRefresh () {
      this.onClose()
      this.$emit('onRefresh')
    },
    pay () {
      const id = this.orderId
      const tempPage = window.open('', '_blank')
      this.gotoAlipay(id, null, tempPage, '?from=credit-info')
    },
    onClose () {
      this.isPayDialogShow = false
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.product{
  label{
    font-size: @font_size_3;
  }
}
</style>
