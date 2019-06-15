<template>
  <div class="home-header">
    <div class="banner">
      <swipe :list="swipeList"/>
    </div>
    <ul class="menus">
      <li v-for="(item,index) in this.tabList" :key="index" @click="filterClick(item.title)">
        <i class="material-icons" :style="`background: ${item.color}`">{{item.icon}}</i>
        <p>{{item.title}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'HomeHeader',
  data () {
    return {
      swipeList: [
        {
          url: require('../../../assets/images/banner_home.png'),
          pathName: 'loan-product'
        },
        {
          url: require('../../../assets/images/banner_home.png'),
          pathName: 'loan-product'
        },
        {
          url: require('../../../assets/images/banner_home.png'),
          pathName: 'loan-product'
        },
        {
          url: require('../../../assets/images/banner_home.png'),
          pathName: 'loan-product'
        }
      ],
      tabList: [
        { icon: 'fiber_new', title: '新口子', color: '#E65100' },
        { icon: 'flight_land', title: '小额贷', color: '#FF5353' },
        { icon: 'flight_takeoff', title: '大额贷款', color: '#ffc107' },
        { icon: 'open_in_new', title: '高通过', color: '#03a9f4' }
      ]
    }
  },
  methods: {
    filterClick (value) {
      this.setFilterParams(value)
      this.$router.push({ name: 'filter-find', query: { from: 'filter' } })
    },
    ...mapMutations({
      setFilterParams: 'SET_FILTER_PARAMS'
    })
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin.less";
.home-header{
  .banner{
    height: 42vw;
    overflow: hidden;
    flex: 1;
    align-items: center;
    img{
      width: 100%;
    }
  }
  .menus{
    background: white;
    padding: 15px 0;
    display: flex;
    justify-content: center;
    li{
      text-align: center;
      width: 22%;
      i{
        display: block;
        width: 50px;
        height: 50px;
        line-height: 50px;
        margin: 0 auto;
        border-radius: 50%;
        color: white;
        font-size: @font_size_8;
      }
      p{
        padding-top: 10px;
        font-size: @font_size_2;
      }
    }
  }
}
</style>
