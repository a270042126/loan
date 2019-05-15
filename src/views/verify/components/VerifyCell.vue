<template>
  <div class="verify-cell">
    <div class="top">
      <div class="material-icons icon">{{item.icon}}</div>
      <div class="title">{{item.title}}</div>
      <div class="go-verify">去认证</div>
    </div>
    <div class="bottom">
      {{item.desc}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'VerifyCell',
  props: {
    item: {}
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.verify-cell{
  background: white;
  padding: 10px @space1;
  margin-bottom: 20px;
  .shadow(1px, 1px, 10px, @light_gray3);
  .border-radius(6px);
  .top{
    padding-bottom: 10px;
    border-bottom: 1px solid @light_gray;
    .display-flex();
    .flex-justify-content-space-between();
    .flex-align-items-center();
    .icon{
      color: @theme_primary;
    }
    .title{
      font-size: @font_size_3;
      padding-left: 4px;
      .flex();
    }
    .go-verify{
      font-size: @font_size_2;
      background: @theme_primary;
      width: 68px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      .border-radius(15px)
    }
  }
  .bottom{
    color: @light_gray2;
    font-size: @font_size_2;
    padding-top: 10px;
  }
}
</style>
