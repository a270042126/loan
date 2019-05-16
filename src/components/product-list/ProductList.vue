<template>
  <div class="findlist">
    <ul>
      <li v-for="(item,index) in list" :key="index">
        <router-link :to="{name:'product', query: {name: item.name, id: item.id}}">
          <div class="product_item">
            <div class="img"><img v-lazy="baseUrl + item.logo"></div>
            <div class="inner">
              <div class="top">
                <div class="title">{{item.name}}</div>
                <div class="quota">{{item.quota}}</div>
              </div>
              <div class="bottom">
                <div class="subtitle"> 日利率：{{item.rate}} | {{ item.term }} 天</div>
                <div class="subtitle">额度范围(元)</div>
              </div>
            </div>
          </div>
        </router-link>
        <div class="describe" v-if="item.desc">
          <div class="line"></div>
          <p>{{item.desc}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { url } from 'js/const'
export default {
  name: 'ProductList',
  props: {
    list: Array
  },
  data () {
    return {
      baseUrl: url.baseUrl + '/File/Download/'
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.findlist{
  width: 100%;
  padding: 10px 0;
  ul{
    li{
      .product_item{
        display: flex;
        padding: 12px @space1;
        background: white;
        .img{
          display: flex;
          justify-items: center;
          align-items: center;
          overflow: hidden;
          width: 60px;
          height: 60px;
        }
        .inner{
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: space-between;
          padding: 8px 0;
          margin-left: 10px;
          .top{
            display: flex;
            justify-content: space-between;
            .title{
              font-size: @font_size_4;
            }
            .quota{
              text-align: right;
              font-weight: 900;
              color: @theme_color3;
              font-size: @font_size_4;
            }
          }
          .bottom{
            display: flex;
            justify-content: space-between;
            .subtitle{
              font-size: @font_size_1;
            }
          }
        }
      }
      a{width: 100%}
      padding: 5px 0;
      border-bottom: 1px solid @light_gray;
      .describe{
        margin-left: 40px;
        padding-left: 30px;
        font-size: @font_size_1;
        color: @light_gray2;
        .line{
          margin: 6px 0;
          height: 1px;
          background: @light_gray;
        }
        p{
          font-size: @font_size_1;
          padding: 4px 0 4px 0;
        }
      }
    }
  }
}
</style>
