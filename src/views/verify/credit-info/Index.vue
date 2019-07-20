<template>
  <base-page :navOptions="{ title: '征信', isBack: true}">
    <div class="header" v-if="verifyStatus">
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
    <better-scroll :data="orderList.length > 0 ? orderList : productList"
                   class="scroll"
                   ref="scroll"
                   :pullDownRefresh="true"
                   @pulling-down="refresh">
      <ul class="list">
        <li v-for="(item, key) in productList" :key="key">
          <radio-input :value="key" v-model="checkedValue"/>
          <div class="title-div">
            <p class="title">{{item.name}}</p>
            <p class="recommend" v-if="item.isRecommend">推荐</p>
          </div>
          <p class="price">￥{{item.price}}<span v-if="item.originalPrice && item.originalPrice !== item.price">(￥{{item.originalPrice}})</span></p>
          <button @click="productDetailClick(key)"
                  v-stat="{category:'按钮点击事件', action:'征信', name: '查看详情'+item.name}">查看详情</button>
        </li>
      </ul>
      <div class="search-div">
        <p>为了保证公平，改征信查询结果将向你公开，无征信黑名单记录，放款率98%</p>
        <button class="simple-btn" @click="searchClick"
                v-stat="{category:'按钮点击事件', action:'征信', name: '购买征信'+productList[checkedValue].name}"
        >购买征信</button>
      </div>
      <div class="result">
        <router-link :to="{name: 'baseInfoVerify'}" v-stat="{category:'按钮点击事件', action:'征信', name: '卡号有误，重新填写'}">
          <p>卡号有误，重新填写</p>
        </router-link>
        <p>查询个人征信<span>无问题</span> 成功借款1500元7天</p>
      </div>
      <div class="order-div">
        <ul class="order-list">
          <li v-for="(item, key) in orderList" :key="key" @click="gotoCreditReport(item.id)"
              v-stat="{category:'按钮点击事件', action:'征信', name: '征信报告'}">
            <div>
              <p class="title">产品名称：{{item.productName}}<span>({{item.statusName}})</span></p>
              <p>银行卡：{{item.bankCardNumber}}</p>
              <p>手机号码：{{item.phoneNumber}}</p>
            </div>
            <div>
              <p class="price">金额：{{item.price}}</p>
              <p>{{item.creationTime | dateFormat}}</p>
              <div v-if="item.status === 1"><button @click.stop="refundClick(item.id)"
                                                    v-stat="{category:'按钮点击事件', action:'征信', name: '退款'}"
              >退款</button></div>
            </div>
          </li>
        </ul>
      </div>
    </better-scroll>
    <credit-pay-dialog
      :isShow="isPayDialogShow" :product="checkedValue !== -1 ? productList[checkedValue] : ''"
      :order-id="orderId"
      @close="isPayDialogShow = false" @onRefresh="refresh"/>
    <r-dialog ref="dialog" :title="currentKey !== -1  ? productList[currentKey].name : ''"
              height="60vh" :isDialogShow="isDialogShow" @onClose="isDialogShow = false">
      <better-scroll :scrollbar="{fade: false}">
        {{currentKey !== -1 ? productList[currentKey].remark : ''}}
      </better-scroll>
    </r-dialog>
  </base-page>
</template>

<script>
import RadioInput from '@/components/RadioInput'
import { request, storage } from '@/utils'
import { url } from '@/const'
import { baseMixin } from '@/mixins'
import CreditPayDialog from './components/CreditPayDialog'
export default {
  name: 'Index',
  components: { CreditPayDialog, RadioInput },
  mixins: [ baseMixin ],
  data () {
    return {
      verifyStatus: false,
      verify: '',
      orderList: [
      ],
      productList: [
      ],
      isPayDialogShow: false,
      isDialogShow: false,
      checkedValue: -1,
      currentKey: -1,
      orderId: ''
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      this.getCreditProducts()
      this.getCreditOrders()
      this.getOrderStatus()
    },
    // 取消刷新
    foreceUpdate () {
      if (this.$refs.scroll) {
        this.$refs.scroll.forceUpdate()
      }
    },
    gotoCreditReport (id) {
      this.$router.push({
        name: 'creditInfoResult',
        query: {
          id: id
        }
      })
    },
    getCreditOrders () {
      request({
        type: 'post',
        path: url.Credit.GetCreditOrders,
        fn: data => {
          this.orderList = data.result.items
          console.log(this.orderList)
        },
        errFn: () => {
          this.foreceUpdate()
        }
      })
    },
    searchClick () {
      const creditToken = storage.get('creditToken')
      if (this.checkedValue === -1) {
        this.errorT('请选择产品')
      } else {
        const product = this.productList[this.checkedValue]
        request({
          type: 'post',
          path: url.Credit.CreateCreditOrder,
          data: { productId: product.id, creditToken: creditToken },
          fn: data => {
            const id = data.result
            this.orderId = id
            this.isPayDialogShow = true
          },
          errFn: () => {
          }
        })
      }
    },
    getCreditProducts () {
      request({
        type: 'post',
        path: url.Credit.GetCreditProducts,
        fn: data => {
          const items = data.result.items
          this.productList = items
          items.some((item, key) => {
            if (item.isRecommend) {
              this.checkedValue = key
              return true
            }
          })
        },
        errFn: () => {
          this.foreceUpdate()
        }
      })
    },
    productDetailClick (key) {
      this.isDialogShow = true
      this.currentKey = key
    },
    getOrderStatus () {
      const params = {
        sorting: '',
        maxResultCount: 5,
        skipCount: 0
      }
      request({
        type: 'post',
        path: url.Loan.GetOrders,
        data: params,
        fn: data => {
          const orderList = data.result.items
          orderList.some((item) => {
            const needVerifyName = item.needVerifyName
            if (needVerifyName.indexOf('征信') !== -1) {
              this.verifyStatus = true
              return true
            }
          })
        },
        errFn: () => {
          this.foreceUpdate()
        }
      })
    },
    refundClick (id) {
      this.alertT('你确定要退款吗', () => {
        request({
          type: 'post',
          path: url.Credit.CancelCreditOrder,
          data: { id: id },
          fn: data => {
            if (data.success) {
              this.successT('退款成功')
            }
            this.getCreditOrders()
          },
          errFn: () => {
            this.foreceUpdate()
          }
        })
      })
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
    font-size: @font_size_1;
    display: flex;
    align-items: center;
    .title-div{
      flex: 1;
      display: flex;
      align-items: center;
      .title{
        font-size: @font_size_2;
        font-weight: bold;
        padding: 0 5px;
      }
      .recommend{
        background: @theme_color6;
        padding: 8px;
        border-radius: 4px;
        color: white;
      }
    }
    .price{
      color: @theme_color3;
      font-size: @font_size_2;
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
      padding: 8px;
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
.order-div{
  padding: 20px 0 80px 0;
  .order-list{
    background: white;
    padding-left: 15px;
    li{
      font-size: @font_size_2;
      padding: 10px 15px 10px 0;
      display: flex;
      justify-content: space-between;
      line-height: 24px;
      border-bottom: 1px solid @light_gray;
      .title{
        font-size: @font_size_3;
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
      button{
        background: @theme_primary;
        color: white;
        padding: 5px 12px;
      }
    }
  }
}

</style>
