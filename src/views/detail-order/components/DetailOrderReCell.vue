<template>
  <div class="renewal" @click="checkClick">
    <div class="icon">
      <div class="material-icons check" v-if="check">check</div>
    </div>
    <div>
      <div class="term">{{item.value}}天</div>
      <div class="rate">{{item.rate}}</div>
      <div class="fee">{{item.fee}}元</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DetailOrderReCell',
  props: {
    check: {
      type: Boolean,
      default: false
    },
    item: {}
  },
  methods: {
    checkClick () {
      this.$emit('onChange')
    }
  }
}
</script>
<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.renewal{
  font-size: @font_size_2;
  .display-flex();
  .flex-align-items-center();
  & > div:first-child{
    width: 17px;
    height: 17px;
    line-height: 17px;
    border: 1px solid @light_gray2;
    .border-radius();
    .check {
      font-size: @font_size_4;
    }
  }
  &> div:last-child{
    margin-left: 10px;
    border-bottom: 1px solid @light_gray;
    .flex();
    .display-flex();
    .flex-justify-content-space-between();
    .term, .rate, .fee{
      line-height: 32px;
      height: 32px;
    }
  }
}
</style>
