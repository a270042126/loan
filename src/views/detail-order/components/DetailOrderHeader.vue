<template>
  <div class="progress">
    <template v-for="(item, index) in proList">
      <div :key="index" :class="`tag ${current > item.statusNum ? 'active' : ''}`">
        <div class="num">{{item.num}}</div>
        <div class="title">{{item.title}}</div>
      </div>
      <div
        v-if="index < proList.length - 1"
        :key="index + 10000"
        :class="`${current >= item.statusNum ? 'active' : ''} line`"></div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'DetailOrderHeader',
  props: {
    current: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      proList: [
        { title: '审核', num: 1, statusNum: 2 },
        { title: '还款', num: 2, statusNum: 3 },
        { title: '完成', num: 3, statusNum: 4 }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.progress{
  padding-bottom: 20px;
  background: @theme_primary;
  display: flex;
  align-items: center;
  justify-content: center;
  .line{
    height: 2px;
    background: #fff;
    width: 40px;
    margin: 0 5px 15px 4px;
  }
  .tag{
    font-size: @font_size_3;
    text-align: center;
    width: 40px;
    .num{
      margin: 10px auto;
      background: white;
      font-size: @font_size_2;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
    }
    .title{
      color: #fff;
    }
  }
  .tag.active, .line.active{
    opacity: 0.6;
  }
}
</style>
