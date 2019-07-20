<template>
  <ul>
    <li v-for="(item, key) in list"
        :key="key"
        :class="filterIndex === key ? 'active' : ''"
        @click="filterClick(key)"
        v-stat="{category:'按钮点击事件', action:'我的订单', name: item.text}">
      <span>{{item.text}}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'MyOrderFilter',
  props: {
    searchFlag: {
      default: 4
    }
  },
  data () {
    return {
      filterIndex: 0,
      list: [
        { text: '待放款', value: '4' },
        { text: '待还款', value: '8' },
        { text: '已结清', value: '32' },
        { text: '审核失败', value: '256' }
      ]
    }
  },
  methods: {
    filterClick (key) {
      this.filterIndex = key
      this.$emit('filterChange', this.list[key].value)
    }
  },
  watch: {
    searchFlag (newValue) {
      switch (newValue) {
        case 4:
          this.filterIndex = 0
          break
        case 8:
          this.filterIndex = 1
          break
        case 32:
          this.filterIndex = 2
          break
        case 256:
          this.filterIndex = 3
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
ul {
  background: white;
  display: flex;
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
