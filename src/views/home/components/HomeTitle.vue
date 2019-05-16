<template>
  <div class="title">
    <div class="title_bg"></div>
    <p>{{this.title}}</p>
  </div>
</template>

<script>
export default {
  name: 'HomeTitle',
  props: {
    title: String,
    icon: String
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.title{
  padding: 3% @space1;
  display: flex;
  align-items: center;
  .title_bg{
    background: url("../../../assets/images/home_title_bg01.png") left center repeat-x;
    background-size: 2px 20px;
    height: 20px;
    width: 5px;
    margin-right: 10px;
  }
  p{
    font-weight: bold;
    font-size: @font_size_3;
    color: #000;
  }
}
</style>
