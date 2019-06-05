<template>
  <div class="recommend">
    <home-title title="热门推荐" :icon="require('images/sy_30.png')"/>
    <div class="recommend">
      <ul>
        <li v-for="(item, index) in list" :key="index">
          <router-link :to="{name:'product', query: {name: item.name, id: item.id}}">
            <div class="product_item">
              <div class="title">
                <img v-lazy="baseUrl + '/File/Download/' + item.logo">
                <div>{{item.name}}</div>
              </div>
              <div class="mess">
                <div class="left">
                  <div class="quota">{{item.quota}}</div>
                  <div class="subtitle">额度范围(元)</div>
                </div>
                <div class="right">
                  <div v-if="index % 2 == 0">有身份证就能借</div>
                  <div v-if="index % 2 != 0">急速放款</div>
                  <div class="subtitle"> 日利率：{{item.rate}} | {{ item.term }} 天</div>
                </div>
              </div>
            </div>
          </router-link>
          <div>
            <i class="material-icons arrow">&#xe5cc;</i>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import HomeTitle from './HomeTitle'
import { mapGetters } from 'vuex'
export default {
  name: 'HomeRecommend',
  props: {
    list: Array
  },
  computed: {
    ...mapGetters(['baseUrl'])
  },
  components: {
    HomeTitle
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.recommend{
  background: white;
  ul{
    li{
      display: flex;
      align-items: center;
      justify-content: space-between;
      .arrow{ color: @light_gray2 }
      .product_item{
        .title{
          font-size: @font_size_3;
          display: flex;
          align-items: center;
          img{
            width: 25px;
            height: 25px;
            margin-right: 6px;
          }
        }
      }
      .mess{
        padding-top:8px;
        display: flex;
        align-items: flex-end;
        .subtitle{
          color: @light_gray2;
        }
        .left{
          width: 120px;
          .quota{
            font-size: @font_size_4;
            color: #E65100;
            padding-bottom: 8px;
          }
        }
        .right{
          text-align: left;
          & > div:first-child{
            font-size: @font_size_4;
            padding-bottom: 8px;
          }
        }
      }
      a {width: 100%;}
      margin: 0 @space1 0 @space1;
      padding: 10px 0;
      border-bottom: 1px solid @light_gray;
    }
  }
}
</style>
