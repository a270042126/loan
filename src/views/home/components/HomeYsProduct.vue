<template>
  <div class="ys_product">
    <home-title title="优势产品" :icon="require('images/youshi.gif')"/>
    <better-scroll class="wrapper" :data="list" :scrollX="true">
      <ul class="content" ref="ysUl">
        <li v-for="(item,index) in list" :key="index" @click="gotoProductInfo(item)"
            v-stat="{category:'按钮点击事件', action:'首页', name: '优势-' + item.name}"
        >
          <img v-lazy="baseUrl + '/File/Download/' + item.logo">
          <div class="subtitle">{{item.name}}</div>
        </li>
      </ul>
    </better-scroll>
    <div class="line"></div>
  </div>
</template>

<script>
import HomeTitle from './HomeTitle'
import { mapGetters } from 'vuex'
export default {
  name: 'HomeYsProduct',
  props: {
    list: Array
  },
  computed: {
    ...mapGetters(['baseUrl'])
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
