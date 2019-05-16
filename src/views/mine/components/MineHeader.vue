<template>
  <section class="header" ref="mineHeader">
    <div class="top">
      <router-link :to="{name: 'setting'}">
      <i class="material-icons icon">settings</i>
      </router-link>
      <h1>我的</h1>
      <router-link :to="{name: 'message'}">
      <i class="material-icons icon">message</i>
      </router-link>
    </div>
    <mine-user-item />
    <div class="menus">
      <ul>
        <li v-for="(item, key) in list" :key="key">
          <router-link :to="{name: item.path, query: {index: key}}">
            <img :src="item.icon">
            <p>{{item.title}}</p>
          </router-link>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import MineUserItem from './MineUserItem'
import { apid } from 'js/utils'
export default {
  name: 'MineHeader',
  data () {
    return {
      list: [
        { icon: require('../../../assets/images/mine01.png'), title: '待放款', path: 'my-orders' },
        { icon: require('../../../assets/images/mine02.png'), title: '待还款', path: 'my-orders' },
        { icon: require('../../../assets/images/mine03.png'), title: '已结清', path: 'my-orders' },
        { icon: require('../../../assets/images/mine04.png'), title: '审核失败', path: 'my-orders' }
      ]
    }
  },
  mounted () {
    this.updateUI()
  },
  methods: {
    updateUI () {
      let height = apid.getSafeAreaTop()
      if (height !== 0) {
        this.$refs.mineHeader.style.paddingTop = height + 'px'
      }
    }
  },
  components: {
    MineUserItem
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.header{
  background: url("../../../assets/images/minebg.png") left top no-repeat;
  background-size: 100% 100%;
  height: 200px;
  .top {
    padding:10px 15px 30px 15px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    h1{
      font-size: @font_size_3;
    }
    .icon{
      display: block;
      color: white;
      width: 30px;
      padding: 5px 0;
    }
  }
  .menus{
    width: 100%;
    position: relative;
    ul{
      position: absolute;
      width: 86%;
      top: 0;
      left: 0;
      right: 0;
      margin: 15px auto 0 auto;
      background: white;
      padding: 10px 10px;
      z-index: 10;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      li{
        width: 60px;
        text-align: center;
      }
    }
  }

}
</style>
