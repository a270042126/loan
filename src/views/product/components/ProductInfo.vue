<template>
  <div class="product">
    <div class="banner">
      <img src="../../../assets/images/bg-product.png">
      <div class="content">
        <div class="icon">
          <img v-lazy="baseUrl + info.product.logo">
        </div>
        <div class="desc">
          <div>
            <div>贷款范围：{{info.product.quota}}</div>
            <div>期限范围：{{info.product.term}}天</div>
          </div>
          <div>
            <div style="text-align: right">利率：{{info.product.rate}}</div>
            <div>还利方式：分期</div>
          </div>
        </div>
      </div>
    </div>
    <div class="list">
      <template v-for="(item,key) in list">
        <div class="product-item" :key="key">
          <div>
            <div class="title">{{item.title}}</div>
            <div class="desc">{{item.desc}}</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { url } from '@/const'
export default {
  name: 'ProductInfo',
  props: {
    info: {}
  },
  data () {
    return {
      baseUrl: url.baseUrl + '/File/Download/',
      list: [
        { title: '申请条件', desc: '22-60周岁' },
        { title: '所需材料', desc: '身份证、银行卡、手机号' },
        { title: '授权认证', desc: '手机运营商、通讯录、征信' },
        { title: '审核认证', desc: '程序认证' },
        { title: '还款说明', desc: 'APP还款、支付宝、银行卡' }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.product{
  .banner{
    position: relative;
    .shadow(0, 1px, 2px, @light_gray3);
    .content{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 999;
      .icon{
        display: block;
        width: 100%;
        height: 15%;
        text-align: center;
        img{
          width: 15%;
          overflow: hidden;
          border-radius: 50%;
        }
      }
      .desc{
        width: 85%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        font-size: @font_size_1;
        margin-top: 24%;
        div > div:first-child{
          margin-bottom: 6px;
        }
      }
    }
  }
  .product-item{
    padding: 0 @space1;
    background: white;
    & > div{
      padding: 12px 0;
      border-bottom: 1px solid @light_gray;
      .title{
        font-size: @font_size_3;
      }
      .desc{
        margin-top: 8px;
        color: @light_gray2;
      }
    }
  }
}
</style>
