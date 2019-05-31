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
        <div v-if="currentNum >= 4" class="loan-select">
          <div :class="`selectInput ${isQuotas ? 'active' : '' }`" @click="quotasClick">
            {{quotas.length > 0 ? quotas[quotasIndex].name : '0元'}}
            <div class="material-icons icon">expand_more</div>
          </div>
          <div :class="`selectInput ${!isQuotas ? 'active' : '' }`" @click="termsClick">
            {{terms.length > 0 ? terms[termsIndex].name : '0天'}}
            <div class="material-icons icon">expand_more</div>
          </div>
        </div>
        <div v-if="currentNum >= 4" class="loanBtn">
          <button v-if="quotas.length > 0" class="ra-Btn" @click="loanClick">
            {{goOnLoan ? '继续借款' : '立即借款'}}
          </button>
        </div>
        <div v-else-if="order.id" class="order">
          <div class="status" v-if="currentNum === 0">
            待认证
          </div>
          <div class="detail" @click="gotoDetailClick">
            <div class="icon">
              <svg-icon iconClass="find"/>
            </div>
            <p>查看详情</p>
          </div>
          <div v-if="currentNum === 3">
            <p>待还金额(元)</p>
            <p class="need-repay-gross">{{order.needRepayGross}}元</p>
            <p>应还时间</p>
            <p class="repay-time">{{getAgreedRepayTime}}</p>
          </div>
          <p>借款金额(元)</p>
          <p class="apply-gross">{{order.applyGross}}元</p>
          <p>期限：{{order.applyTerm}}天</p>
          <p class="mess" v-if="currentNum === 0">您的资料不完善，需要补充后，方可放款</p>
          <button class="simple-btn" v-if="currentNum === 0" @click="gotoVerify">点击补充资料</button>
          <button class="simple-btn" v-if="currentNum === 3" @click="repayClick">我要还款</button>
        </div>
      </div>
      <order-list :list="orderList" from="loan"/>
    </better-scroll>
    <order-operate :isDialogShow="isOrderOperate" :order="order" @onRefresh="onRefresh" @onClose="isOrderOperate = false"/>
  </base-page>
</template>

<script>
import { request } from '@/utils'
import { url } from '@/const'
import { baseMixin, orderMixin } from '@/mixins'
import OrderList from '@/components/order/OrderList'
import OrderOperate from '@/components/order/OrderOperate'
import moment from 'moment'
import statusData from '@/data/status-data'
export default {
  name: 'LoadProduct',
  components: { OrderOperate, OrderList },
  mixins: [baseMixin, orderMixin],
  data () {
    return {
      isOrderOperate: false,
      isScrollShow: false,
      isQuotas: true,
      quotas: [],
      terms: [],
      quotasIndex: 0,
      termsIndex: 0,
      goOnLoan: false,
      order: {},
      currentNum: 5
    }
  },
  mounted () {
    this.onRefresh()
  },
  computed: {
    getAgreedRepayTime () {
      let time = this.order.agreedRepayTime
      return this.order && time ? moment(time).format('YYYY-MM-DD') : ''
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
    onRefresh () {
      this.getLoanProduct()
      this.onPullingDown()
    },
    repayClick () {
      this.isOrderOperate = true
    },
    gotoDetailClick () {
      this.$router.push({ name: 'detail-order', query: { id: this.order.id } })
    },
    gotoVerify () {
      this.$router.push({ name: 'verify' })
    },
    onPullingDown () {
      this.params.skipCount = 0
      this.getOrders(() => {
        this.orderList.some((item) => {
          const num = statusData[item.statusName]
          this.currentNum = num
          if (num !== 5) {
            this.order = item
            return true
          } else {
            this.order = {}
          }
        })
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
            name: 'bankCardVerify',
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
      this.loadingT()
      request({
        type: 'post',
        path: url.UserVerify.IsAuthBaseInfo,
        fn: data => {
          this.hideT()
          _callBack(data.result)
        },
        errFn: () => {
          this.hideT()
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
    padding-bottom: 40px;
    margin-bottom: 20px;
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
    .loanBtn{
      width: 100%;
      text-align: center;
      padding: 10px 0;
    }
  }
  .order{
    position: relative;
    padding-top: 20px;
    p{
      font-size: @font_size_2;
      padding: 4px 0;
      text-align: center;
    }
    .apply-gross{
      color: @theme_color2;
      font-size: @font_size_6;
      font-weight: bold;
    }
    .need-repay-gross{
      color: @theme_color2;
      font-size: @font_size_4;
    }
    .repay-time{
      color: @light_gray2;
      font-size: @font_size_3;
    }
    .mess{
      color: @theme_color4;
    }
    button{
      width: 80%;
      border-radius: 4px;
      margin: 20px auto 0 auto;
    }
    .status{
      position: absolute;
      left: 0;
      top: 25px;
      height: 27px;
      width: 90px;
      background: url("../../../assets/images/qizi.png") no-repeat;
      background-size: 100% auto;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .detail{
      position: absolute;
      right: 0;
      top:21px;
      display: flex;
      align-items: center;
      color: @theme_color4;
      padding: 0 10px;
      .icon{
        font-size: @font_size_5;
        margin-right: 5px;
      }
    }
  }
}

</style>
