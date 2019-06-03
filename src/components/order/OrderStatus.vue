<template>
  <div v-if="order.id" class="order">
    <div class="status" v-if="getStatusNum === 0">
      待认证
    </div>
    <div v-if="isDetail" class="detail" @click="gotoDetailClick">
      <div class="icon">
        <svg-icon iconClass="find"/>
      </div>
      <p>查看详情</p>
    </div>
    <div class="loan">
      <h2>借款金额(元)</h2>
      <p class="apply-gross">{{order.applyGross}}元</p>
      <p v-if="getStatusNum !== 3">期限：{{order.applyTerm}}天</p>
    </div>
    <div v-if="order.needVerify > 0 && order.statusName !== '已完成'" class="verify">
      <p class="mess">您的资料不完善，需要补充后，方可放款</p>
      <button @click="gotoVerify">点击补充资料</button>
    </div>
    <div v-else-if="getStatusNum === 3" class="repay">
      <div class="info">
        <p>待还金额：{{order.needRepayGross}}元</p>
        <p>{{order.agreedRepayTime|dateFormatZn}}前还款<span>{{order.overdueDays ? '(已逾期' + 2 + '天)' : ''}}</span></p>
      </div>
      <p class="overdueDays" v-if="order.overdueDays">
        您的借款已逾期, 请尽快还款.
      </p>
      <div class="operate-btns">
        <button @click="repayClick">我要还款</button>
        <button v-if="order.canLoanRenewal" @click="renewalClick">我要续期</button>
      </div>
    </div>
  </div>
</template>

<script>
import statusData from '@/data/status-data'
export default {
  name: 'OrderStatus',
  props: {
    order: Object,
    isDetail: {
      default: false
    }
  },
  computed: {
    getStatusNum () {
      return statusData[this.order.statusName] || 5
    }
  },
  methods: {
    renewalClick () {
      this.$emit('onRenewal')
    },
    repayClick () {
      this.$emit('onRepay')
    },
    gotoVerify () {
      this.$router.push({ name: 'verify' })
    },
    gotoDetailClick () {
      this.$router.push({ name: 'detail-order', query: { id: this.order.id } })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
.loanBtn{
  width: 100%;
  text-align: center;
  padding: 10px 0;
}
.order{
  position: relative;
  padding: 20px 0 40px 0;
  button{
    background: @theme_primary;
    color: white;
    font-size: @font_size_2;
    padding: 10px 20px;
  }
  p {
    font-size: @font_size_2;
    text-align: center;
    padding: 4px 0;
  }
  .verify{
    display: flex;
    flex-direction: column;
    align-items: center;
    button{
      margin-top: 20px;
    }
  }
  .loan{
    h2{
      font-size: @font_size_4;
      text-align: center;
    }
    .apply-gross{
      color: @theme_color2;
      font-size: @font_size_4;
      font-weight: bold;
    }
  }
  .repay{
    .info{
      p:first-child{
        padding-right: 10px;
      }
      span{
        color: @theme_color3;
      }
    }
    .overdueDays{
      color: @theme_primary;
    }
    .operate-btns{
      display: flex;
      justify-content: center;
      margin-top: 20px;
      button:first-child{
        margin-right: 10px;
      }
    }
  }
  .status{
    position: absolute;
    left: 0;
    top: 25px;
    height: 27px;
    width: 90px;
    background: url("../../assets/images/qizi.png") no-repeat;
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
</style>
