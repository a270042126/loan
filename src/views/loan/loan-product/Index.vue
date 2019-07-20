<template>
  <base-page :navOptions="{ title: '借款', isBack: true, isFixed: true, isScrollShow: isScrollShow}">
    <better-scroll :data="orderList" ref="scroll"
                   :pullUpLoad="true"
                   :pullDownRefresh="true"
                   :listenScroll="true"
                   @scroll="onScroll"
                   @pulling-down="onPullingDown"
                   @pulling-up="onPullingUp">
      <div class="loan">
        <div>
          <img src="@/assets/images/n-banner.png">
        </div>
        <div v-if="getStatusNum >= 4" class="loan-select">
          <div :class="`selectInput ${isQuotas ? 'active' : '' }`" @click="quotasClick"
               v-stat="{category:'按钮点击事件', action:'借款', name: '选择金额'}">
            {{quotas.length > 0 ? quotas[quotasIndex].name : '0元'}}
            <div class="material-icons icon">expand_more</div>
          </div>
          <div :class="`selectInput ${!isQuotas ? 'active' : '' }`" @click="termsClick"
               v-stat="{category:'按钮点击事件', action:'借款', name: '选择金额'}">
            {{terms.length > 0 ? terms[termsIndex].name : '0天'}}
            <div class="material-icons icon">expand_more</div>
          </div>
        </div>
        <div v-if="getStatusNum >= 4" class="loanBtn">
          <button v-if="quotas.length > 0" class="ra-Btn" @click="loanClick"
                  v-stat="{category:'按钮点击事件', action:'借款', name: goOnLoan ? '继续借款' : '立即借款'}">
            {{goOnLoan ? '继续借款' : '立即借款'}}
          </button>
        </div>
        <order-status :is-detail="true" :order="order" @onRepay="repayClick" @onRenewal="renewalClick"/>
      </div>
      <order-list :list="orderList" from="loan" @onRepay="repayClick"/>
    </better-scroll>
    <order-repay :isDialogShow="isOrderOperate" :order="order" @onRefresh="onRefresh" @onClose="isOrderOperate = false"/>
    <select-renewal-dialog
      :id="order.id"
      :isDialogShow="isSelectRenewalShow"
      @onRefresh="onRefresh"
      @onClose="isSelectRenewalShow = false"/>
  </base-page>
</template>

<script>
import { request } from '@/utils'
import { url } from '@/const'
import { baseMixin, orderMixin } from '@/mixins'
import OrderList from '@/components/order/OrderList'
import OrderRepay from '@/components/order/OrderRepay'
import statusData from '@/data/status-data'
import OrderStatus from '@/components/order/OrderStatus'
import SelectRenewalDialog from '@/components/order/SelectRenewalDialog'
export default {
  name: 'LoadProduct',
  components: { SelectRenewalDialog, OrderStatus, OrderRepay, OrderList },
  mixins: [baseMixin, orderMixin],
  data () {
    return {
      isSelectRenewalShow: false,
      isOrderOperate: false,
      isScrollShow: false,
      isQuotas: true,
      quotas: [],
      terms: [],
      quotasIndex: 0,
      termsIndex: 0,
      goOnLoan: false,
      order: {}
    }
  },
  mounted () {
    this.onRefresh()
  },
  computed: {
    getStatusNum () {
      const num = statusData[this.order.statusName]
      if (num !== undefined) {
        return num
      } else {
        return 5
      }
    },
    quotaItems () {
      let arr = []
      for (let item of this.quotas) {
        arr.push({ text: item.name, vakue: item.name })
      }
      return arr
    },
    termItems () {
      let arr = []
      for (let item of this.terms) {
        arr.push({ text: item.name, vakue: item.name })
      }
      return arr
    }
  },
  methods: {
    renewalClick () {
      this.isSelectRenewalShow = true
    },
    onRefresh () {
      this.isSelectRenewalShow = false
      this.isOrderOperate = false
      this.getLoanProduct()
      this.onPullingDown()
    },
    repayClick () {
      this.isOrderOperate = true
    },
    onPullingDown () {
      this.params.skipCount = 0
      this.getOrders(() => {
        this.orderList.some((item) => {
          const num = statusData[item.statusName]
          if (num !== 5) {
            this.getDetailOrder(item.id)
            return true
          } else {
            this.order = {}
          }
        })
      })
    },
    // 获取订单
    getDetailOrder (id) {
      request({
        type: 'post',
        path: url.Loan.GetOrderDetail,
        data: { id: id },
        fn: data => {
          this.order = data.result
        },
        errFn: () => {
        }
      })
    },
    onScroll (pos) {
      if (pos.y < -120) {
        this.isScrollShow = true
      } else {
        this.isScrollShow = false
      }
    },
    showPicker () {
      if (this.isQuotas) {
        if (!this.picker) {
          this.picker = this.$createPicker({
            title: '',
            data: [this.quotaItems],
            onSelect: this.selectHandle
          })
        }
        this.picker.show()
      } else {
        if (!this.picker2) {
          this.picker2 = this.$createPicker({
            title: '',
            data: [this.termItems],
            onSelect: this.selectHandle
          })
        }
        this.picker2.show()
      }
    },
    loanClick () {
      this.getIsAuthBaseInfo((data) => {
        if (data.verifyStatus) {
          this.$router.push({
            name: 'create-order',
            query: {
              quotaId: this.quotas[this.quotasIndex].id,
              termId: this.terms[this.termsIndex].id
            }
          })
        } else {
          this.$router.push({
            name: 'baseInfoVerify',
            query: {
              quotaName: this.quotas[this.quotasIndex].name,
              termName: this.terms[this.termsIndex].name,
              quotaId: this.quotas[this.quotasIndex].id,
              termId: this.terms[this.termsIndex].id
            }
          })
        }
      })
    },
    getIsAuthBaseInfo (_callBack) {
      request({
        type: 'post',
        path: url.UserVerify.IsAuthBaseInfo,
        fn: data => {
          _callBack(data.result)
        },
        errFn: () => {
        }
      })
    },
    termsClick () {
      this.isQuotas = false
      this.showPicker()
    },
    quotasClick () {
      this.isQuotas = true
      this.showPicker()
    },

    selectHandle (selectedVal, selectedIndex, _) {
      if (this.isQuotas) {
        this.quotasIndex = selectedIndex
      } else {
        this.termsIndex = selectedIndex
      }
    },
    getLoanProduct () {
      request({
        type: 'post',
        path: url.Loan.LoanProduct,
        fn: data => {
          this.quotas = data.result.quotas
          this.terms = data.result.terms
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.container {
  img{ width: 100%; }
  .loan{
    background: white;
    margin-bottom: 20px;
    .loanBtn{
      text-align: center;
      padding: 40px 0 20px 0;
    }
    .loan-select{
      padding: 20px 0;
      display: flex;
      justify-content: center;
      .selectInput{
        position: relative;
        width: 38%;
        height: 36px;
        line-height: 36px;
        border-radius: 18px;
        padding-left: 10px;
        font-size: @font_size_4;
        border:1px solid @light_gray3;
        .icon{
          position: absolute;
          right: 8px;
          top: 0;
        }
      }
      .selectInput:last-child{
        margin-left: 4%;
      }
      .selectInput.active {
        border: 1px solid @theme_color2;
      }
    }
  }
}

</style>
