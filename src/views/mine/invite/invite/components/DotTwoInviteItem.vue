<template>
  <div class="item">
    <p>{{num}}</p>
    <div>
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DotTwoInviteItem',
  props: {
    num: String
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
.item{
  display: flex;
  align-items: flex-start;
  padding-bottom: 12px;
  & > p {
    background: rgba(255,255,255, 0.8);
    width: 30px;
    height: 30px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: @theme_primary;
    margin-right: 10px;
  }
  & > div{
    width: 0;
    flex: 1;
    margin-top: 6px;
    color: white;
    font-size: @font_size_2;
    line-height: 20px;
  }
}
</style>
