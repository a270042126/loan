<template>
  <base-page :navOptions="navOptions">
    <better-scroll class="mainBody">
      <div class="order">
        <div class="title-div">
          <div class="line"></div>
          <div class="title">借款协议</div>
          <div class="line"></div>
        </div>
        <div>
          <create-order-cell title="借款金额" :text="`${repayCalutate.applyGross}元`"/>
          <create-order-cell title="借款天数" :text="`${repayCalutate.applyTerm}天`"/>
          <create-order-cell title="综合服务费" :text="`${repayCalutate.serviceFee}元`"/>
          <create-order-cell title="利息费用" :text="`${repayCalutate.interestFee}元`"/>
          <create-order-cell title="借款申请费用" :text="`${repayCalutate.totalApplyFee}元`"/>
          <!--<create-order-cell title="还款方式" :text="`一次性还${totalFee}元`"/>-->
          <create-order-cell title="还款日期" :text="repayCalutate.agreedRepayTime|dateFormat"/>
          <create-order-cell title="到手金额" :text="`${repayCalutate.loanGross}元`"/>
        </div>
        <div></div>
        <div class="repayBtns">
          <div class="create_order_checkbox">
            <cube-checkbox v-model="isAgree">
              我已经阅读并同意
            </cube-checkbox>
            <span @click="openDialogClick" class="pact"
                  v-stat="{category:'按钮点击事件', action:'借款协议', name: '《条款合同》'}"
            >《条款合同》</span>
          </div>
          <button class="ra-Btn signBtn" @click="createOrderClick"
                  v-stat="{category:'按钮点击事件', action:'借款协议', name: '立即签约'}"
          >立即签约</button>
        </div>
      </div>
    </better-scroll>
    <r-dialog ref="dialog" title="协议合同" height="60vh">
      <better-scroll :data="repayCalutate.agreementContent" :scrollbar="{fade: false}">
        <div class="agreementContent" v-html="repayCalutate.agreementContent"></div>
      </better-scroll>
    </r-dialog>
  </base-page>
</template>

<script>
import { baseMixin } from '@/mixins'
import { url } from '@/const'
import { request, storage } from '@/utils'
import CreateOrderCell from './components/CreateOrderCell'
export default {
  name: 'LoanBargain',
  mixins: [baseMixin],
  data () {
    return {
      navOptions: {
        title: '签约订单',
        isBack: true
      },
      isAgree: false,
      repayCalutate: {
        agreedRepayGross: 0,
        applyGross: 0,
        applyTerm: 0,
        interestFee: 0,
        loanGross: 0,
        serviceFee: 0,
        totalApplyFee: 0,
        agreementContent: '',
        agreementId: ''
      }
    }
  },
  computed: {
    totalFee () {
      return this.repayCalutate.applyGross + this.repayCalutate.serviceFee
    }
  },
  mounted () {
    this.getRepayCalculate()
  },
  methods: {
    sendNotification () {
      this.bus.$emit('myOrdersRefresh')
    },
    openDialogClick () {
      this.$refs.dialog.open()
    },
    // 获取借款
    getRepayCalculate () {
      const routeParams = this.$route.query
      request({
        type: 'post',
        path: url.Loan.LoanCalculate,
        data: routeParams,
        fn: data => {
          this.repayCalutate = data.result
        }
      })
    },
    // 创建订单
    async createOrderClick () {
      let routeParams = this.$route.query
      const params = {
        agreementId: this.repayCalutate.agreementId,
        quotaId: routeParams.quotaId,
        termId: routeParams.termId
      }
      const creditToken = await storage.get('creditToken')
      params.creditToken = creditToken
      if (!this.isAgree) {
        this.errorT('请仔细阅读并同意条款合同')
      } else {
        request({
          type: 'post',
          path: url.Loan.CreateOrder,
          data: params,
          fn: data => {
            this.successT('签约成功')
            this.sendNotification()
            let result = data.result
            if (result.statusName === '待认证') {
              this.$router.replace({ name: 'verify' })
            } else {
              this.$router.replace({ name: 'my-orders' })
            }
          },
          errFn: () => {
          }
        })
      }
    }
  },
  watch: {
    isAgree (newVlaue) {
      if (newVlaue) {
        this.$refs.dialog.open()
      }
    }
  },
  components: {
    CreateOrderCell
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.container{
  background: @light_gray;
  .order{
    .title-div{
      padding: 20px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      .title{
        font-size: @font_size_3;
        margin: 0 10px;
      }
      .line{
        height: 1px;
        width: 80px;
        background: @light_gray2;
      }
    }
    .repayBtns{
      .signBtn{
        display: block;
        margin: 10px auto 40px auto;
      }
      .create_order_checkbox{
        padding: 20px @space1 0 @space1;
        height: 20px;
        line-height: 20px;
        font-size: @font_size_2;
        display: flex;
        align-items: center;
      }
      .pact{
        color: @theme_color2;
        text-decoration:underline
      }
    }
  }
}
.agreementContent{
  /deep/ h1 {
    font-size: @font_size_4;
    font-weight: bold;
    padding-bottom: 10px;
  }
  /deep/ p{
    font-size: @font_size_2;
    line-height: 20px;
  }
}
</style>
