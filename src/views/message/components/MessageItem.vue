<template>
  <div class="message-item">
    <div class="material-icons">{{item.icon}}</div>
    <div class="content">
      <div>{{item.title}}</div>
      <p class="no-wrap">{{item.message}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageItem',
  props: {
    item: {}
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.message-item{
  padding: 8px 1rem 10px @space1;
  background: white;
  .display-flex();
  .material-icons{
    background: @theme_primary;
    color:white;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    margin-right: 10px;
  }
  .content{
    width: 0;
    padding-bottom: 15px;
    border-bottom: 1px solid @light_gray;
    .display-flex();
    .flex-direction-column();
    .flex-justify-content-center();
    .flex-grow();
    div:first-child{
      font-size: @font_size_3;
      margin-bottom: 10px;
    }
    div:last-child{
      font-size: @font_size_1;
      color: @light_gray2;
    }
  }
}
</style>
