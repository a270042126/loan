<template>
  <div class="renewal">
    <div>
      <div class="term">{{item.value}}天</div>
      <div class="rate">{{item.rate}}</div>
      <div class="fee">{{item.fee}}元</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SelectRenewalCell',
  props: {
    item: {}
  }
}
</script>
<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.renewal{
  width: 100%;
  font-size: @font_size_2;
  display: flex;
  align-items: center;
  & > div {
    margin-left: 10px;
    flex: 1;
    display: flex;
    justify-content: space-between;
  }
}
</style>
