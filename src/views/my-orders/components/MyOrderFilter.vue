<template>
  <ul>
    <li v-for="(item, key) in list" :key="key" :class="filterIndex === key ? 'active' : ''" @click="filterClick(key)">
      <span>{{item}}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'MyOrderFilter',
  data () {
    return {
      filterIndex: 0,
      list: [
        '待放款', '待还款', '已结清', '审核失败'
      ]
    }
  },
  methods: {
    filterClick (key) {
      this.filterIndex = key
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
ul {
  background: white;
  .display-flex();
  li{
    width: 25%;
    text-align: center;
    font-size: @font_size_2;
    color: @light_gray2;
    span{
      padding: 10px 0;
    }
  }
  li.active{
    color: #000;
    span{
      border-bottom: 2px solid @theme_color2;
    }
  }
}
</style>
