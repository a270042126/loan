<template>
  <base-page :navOptions="{ title: '征信', isBack: true}">
    <div class="header">
      <div>
        <svg-icon iconClass="loan"/>
      </div>
      <div>
        <p>借1000元，待认证</p>
        <p>您的借款现在处于待认证状态，差最后...</p>
      </div>
      <div>
        <svg-icon iconClass="arrow-right"/>
      </div>
    </div>
    <better-scroll>
      <ul class="list">
        <li v-for="(item, key) in productList" :key="key">
          <radio-input :value="item.id" v-model="checkedValue"/>
          <div class="title-div">
            <p class="title">{{item.name}}</p>
            <p class="recommend" v-if="item.isRecommend">推荐</p>
          </div>
          <p class="price">￥{{item.price}}<span v-if="item.originalPrice">(￥{{item.originalPrice}})</span></p>
          <button @click="productDetailClick(key)">查看详情</button>
        </li>
      </ul>
      <div class="search-div">
        <p>为了保证公平，改征信查询结果将向你公开，无征信黑名单记录，放款率98%</p>
        <button class="simple-btn" @click="searchClick">查询并付款</button>
      </div>
      <div class="result">
        <router-link :to="{name: 'bankCardVerify'}">
          <p>卡号有误，重新填写</p>
        </router-link>
        <p>查询个人征信<span>无问题</span> 成功借款1500元7天</p>
      </div>
      <ul class="order-list">
        <li v-for="(item, key) in orderList" :key="key">
          <div>
            <p class="title">产品名称：{{item.name}}<span>({{item.statusName}})</span></p>
            <p>银行卡：{{item.bankCardNumber}}</p>
            <p>手机号码：{{item.phoneNumber}}</p>
          </div>
          <div>
            <p class="price">金额：{{item.price}}</p>
            <p>{{item.creationTime | dateFormat}}</p>
          </div>
        </li>
      </ul>
    </better-scroll>
    <r-dialog ref="dialog" title="高级试用" height="60vh" :isDialogShow="isDialogShow" @onClose="isDialogShow = false">
      <better-scroll :scrollbar="{fade: false}">
        {{currentKey ? productList[currentKey].remark : ''}}
      </better-scroll>
    </r-dialog>
    <credit-pay-dialog
      :isShow="isPayDialogShow" :product="checkedValue ? productList[checkedValue] : ''"
      @close="isPayDialogShow = false" @onRefresh="refresh"/>
  </base-page>
</template>

<script>
import RadioInput from '@/components/RadioInput'
import { request } from '@/utils'
import { url } from '@/const'
import { baseMixin } from '@/mixins'
import CreditPayDialog from './components/CreditPayDialog'
export default {
  name: 'Index',
  components: { CreditPayDialog, RadioInput },
  mixins: [ baseMixin ],
  data () {
    return {
      verify: '',
      orderList: [
        {
          price: 0,
          customerId: 0,
          name: '123',
          phoneNumber: '123',
          idNumber: '123',
          bankCardNumber: '123',
          status: 0,
          statusName: '123',
          productName: '123',
          creationTime: '2019-06-18',
          id: '123'
        }
      ],
      productList: [
      ],
      isPayDialogShow: false,
      isDialogShow: false,
      checkedValue: 0,
      currentKey: ''
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      this.getCreditProducts()
      // this.getCreditOrders()
    },
    getCreditOrders () {
      request({
        type: 'post',
        path: url.Credit.GetCreditOrders,
        fn: data => {
          this.orderList = data.result.items
        },
        errFn: () => {
        }
      })
    },
    searchClick () {
      if (!this.checkedValue) {
        this.errorT('请选择产品')
      } else {
        this.isPayDialogShow = true
      }
    },
    getCreditProducts () {
      request({
        type: 'post',
        path: url.Credit.GetCreditProducts,
        fn: data => {
          const items = data.result.items
          this.productList = items
          items.some((item) => {
            if (item.isRecommend) {
              this.checkedValue = item.id
              return true
            }
          })
        },
        errFn: () => {
        }
      })
    },
    productDetailClick (key) {
      this.isDialogShow = true
      this.currentKey = key
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.header{
  display: flex;
  align-items: center;
  background: white;
  padding: 10px 15px;
  div:first-child{
    font-size: @font_size_7;
    background: @theme_color3;
    color: white;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 50%;
    margin-right: 10px;
  }
  div:nth-child(2){
    flex: 1;
    p:first-child{
      font-size: @font_size_4;
    }
    p:nth-child(2) {
      font-size: @font_size_2;
      padding: 5px 0;
      color: @theme_color4;
    }
  }
  div:last-child {
    color: @light_gray2;
    font-size: @font_size_6;
  }
}
.list{
  padding: 20px 0;
  li{
    padding: 15px;
    background: white;
    font-size: @font_size_2;
    display: flex;
    align-items: center;
    .title-div{
      flex: 1;
      display: flex;
      align-items: center;
      .title{
        font-size: @font_size_3;
        font-weight: bold;
        padding: 0 10px;
      }
      .recommend{
        background: @theme_color6;
        padding: 8px 10px;
        border-radius: 4px;
        color: white;
      }
    }
    .price{
      color: @theme_color3;
      font-size: @font_size_3;
      padding: 0 10px;
      display: flex;
      align-items: center;
      span{
        font-size: @font_size_1;
        color: @light_gray2;
        text-decoration: line-through;
        margin-left: 5px;
      }
    }
    button{
      background: @theme_color3;
      padding: 10px;
      color: white;
      border-radius: 4px;
    }
  }
}
.search-div{
  padding: 20px @space1;
  background: white;
  p{
    color: @light_gray2;
    line-height: 18px;
    padding-bottom: 20px;
  }
  button{
    border-radius: 4px;
  }
}
.result{
  background: white;
  text-align: center;
  p:first-child{
    color: @light_blue1;
    text-align: center;
    padding-bottom: 10px;
  }
  p:nth-child(2){
    font-size: @font_size_4;
    text-align: center;
    padding-bottom: 20px;
    span{
      color: @theme_primary;
    }
  }
}
.order-list{
  margin-top: 20px;
  li{
    font-size: @font_size_2;
    background: white;
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    line-height: 24px;
    .title{
      font-size: @font_size_4;
      display: flex;
      align-items: center;
      span{
        font-size: @font_size_1;
        margin-left: 5px;
      }
    }
    .price{
      color: @theme_primary;
    }
    & > div:nth-child(2){
      text-align: right;
    }
  }
}
</style>
