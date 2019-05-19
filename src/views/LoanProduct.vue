<template>
  <base-page :navOptions="{ title: '借款', isBack: true, isFixed: true}">
    <better-scroll :data="orderList" ref="scroll"
                   :pullUpLoad="isShowMore"
                   :pullDownRefresh="true"
                   @pulling-down="onPullingDown"
                   @pulling-up="onPullingUp">
      <div class="loan">
        <div>
          <img src="../assets/images/n-banner.png">
        </div>
        <div class="loan-select">
          <div :class="`selectInput ${isQuotas ? 'active' : '' }`" @click="quotasClick">
            {{quotas.length > 0 ? quotas[quotasIndex].name : '0元'}}
            <div class="material-icons icon">expand_more</div>
          </div>
          <div :class="`selectInput ${!isQuotas ? 'active' : '' }`" @click="termsClick">
            {{terms.length > 0 ? terms[termsIndex].name : '0天'}}
            <div class="material-icons icon">expand_more</div>
          </div>
        </div>
        <div class="loanBtn">
          <button v-if="quotas.length > 0" class="ra-Btn" @click="loanClick">
            {{goOnLoan ? '继续借款' : '立即借款'}}
          </button>
        </div>
      </div>
      <order-list :list="orderList"/>
    </better-scroll>
  </base-page>
</template>

<script>
import { request } from 'js/utils'
import { url } from 'js/const'
import { baseMixin, orderMixin } from 'js/mixins'
import OrderList from '../components/order-list/OrderList'
export default {
  name: 'LoadProduct',
  components: { OrderList },
  mixins: [baseMixin, orderMixin],
  data () {
    return {
      isQuotas: true,
      quotas: [],
      terms: [],
      quotasIndex: 0,
      termsIndex: 0,
      goOnLoan: false
    }
  },
  mounted () {
    this.getLoanProduct()
    this.accapceNotification()
    this.onPullingDown()
  },
  computed: {
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
    accapceNotification () {
      // const that = this
      this.bus.$on('goOnLoan', (quotaName, termName) => {
        this.goOnLoan = true
        this.quotas.some((item, key) => {
          if (item.name === quotaName) {
            this.quotasIndex = key
            return true
          }
        })

        this.terms.some((item, key) => {
          if (item.name === termName) {
            this.termsIndex = key
            return true
          }
        })
      })
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
        path: url.LoanProduct,
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
}

</style>
