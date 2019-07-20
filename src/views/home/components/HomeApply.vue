<template>
  <div class="apply">
    <div>
      <p class="title">最高可领取额度(元)</p>
      <p class="money">200000.00</p>
      <p class="rate">日率0.02% | 期限：7天</p>
    </div>
    <div>
      <cube-button
        v-stat="{category:'按钮点击事件', action:'首页', name: '一键申请'}"
        @click="applyClick">一键申请</cube-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeApply',
  methods: {
    applyClick () {
      this.$router.push({
        name: 'loan-product'
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.apply {
  background: white;
  margin: 15px 10px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  & > div:first-child{
    .title{
      color: @light_gray2;
      padding-bottom: 8px;
    }
    .money{
      font-size: @font_size_7;
      font-weight: bold;
      padding-bottom: 20px;
    }
    .rate{
      color: @light_gray2;
    }
  }
  & > div:last-child{
    .cube-btn{
      background: #E65100;
      padding: 10px;
      border-radius: 4px;
    }
  }
}
</style>
