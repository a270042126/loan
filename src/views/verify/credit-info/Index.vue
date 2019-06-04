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
          <radio-input :value="key" v-model="checkedValue"/>
          <div class="title-div">
            <p class="title">{{item.text}}</p>
            <p class="recommend" v-if="item.isRecommend">推荐</p>
          </div>
          <p class="price">￥{{item.price}}</p>
          <button @click="productDetailClick(key)">查看详情</button>
        </li>
      </ul>
      <div class="search-div">
        <p>为了保证公平，改征信查询结果将向你公开，无征信黑名单记录，放款率98%</p>
        <button class="simple-btn">查询并付款</button>
      </div>
      <div class="result">
        <p>卡号有误，重新填写</p>
        <p>查询个人征信<span>无问题</span> 成功借款1500元7天</p>
      </div>
    </better-scroll>
    <r-dialog ref="dialog" title="高级试用" height="60vh" :isDialogShow="isDialogShow" @onClose="isDialogShow = false">
      <better-scroll :scrollbar="{fade: false}">
        高级试用
      </better-scroll>
    </r-dialog>
  </base-page>
</template>

<script>
import RadioInput from '@/components/RadioInput'
export default {
  name: 'Index',
  components: { RadioInput },
  data () {
    return {
      productList: [
        { text: '征信查询初级版', price: '25' },
        { text: '征信查询高级版', price: '35', isRecommend: true },
        { text: '征信查询大额版', price: '45' }
      ],
      isDialogShow: false,
      checkedValue: 0
    }
  },
  methods: {
    productDetailClick () {
      this.isDialogShow = true
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
</style>
