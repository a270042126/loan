<template>
  <div class="ys_product">
    <home-title title="优势产品" :icon="require('images/youshi.gif')"/>
    <div class="loading" v-if="isLoading">
      <loading />
    </div>
    <better-scroll v-else  class="wrapper" :data="list" :scrollX="true">
      <ul class="content" ref="ysUl">
        <li v-for="(item,index) in list" :key="index" @click="gotoProductInfo(item)">
          <img v-lazy="baseUrl + item.logo">
          <div class="subtitle">{{item.name}}</div>
        </li>
      </ul>
    </better-scroll>
    <div class="line"></div>
  </div>
</template>

<script>
import HomeTitle from './HomeTitle'
import { url } from 'js/const'
export default {
  name: 'HomeYsProduct',
  props: {
    isLoading: {
      type: Boolean,
      default: true
    },
    list: Array
  },
  data () {
    return {
      baseUrl: url.baseUrl + '/File/Download/'
    }
  },
  methods: {
    gotoProductInfo (item) {
      this.$router.push({
        name: 'product',
        query: {
          name: item.name,
          id: item.id
        }
      })
    }
  },
  components: {
    HomeTitle
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin.less";
.ys_product{
  background: white;
  .wrapper {
    width: 100%;
    padding: 15px 0 ;
    height: 110px;
    ul{
      display: inline-block;
      white-space: nowrap;
      li{
        display: inline-block;
        width: 60px;
        text-align: center;
        padding-left: 15px;
        img{
          width: 100%;
        }
        .subtitle{
          margin-top: 0.4rem;
          font-size: @font_size_1;
        }
      }
      li:last-child{
        padding-right: 15px;
      }
    }
  }
  .line{
    background: @light_gray;
    padding-top: 12px;
  }
}
</style>
