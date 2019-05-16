<template>
  <div class="title-div">
    <div></div>
    <p></p>
    <h2>{{title}}</h2>
    <p></p>
    <div></div>
  </div>
</template>

<script>
export default {
  name: 'LinkUserTitle',
  props: {
    title: String
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
.title-div{
  display: flex;
  padding: 20px;
  align-items: center;
  justify-content: center;
  & > div{
    height: 1px;
    background: @light_gray3;
    width: 100px;
  }
  & > p{
    width: 6px;
    height: 6px;
    background: @light_gray3;
    border-radius: 3px;
  }
  h2{
    font-size: @font_size_4;
    padding: 0 10px;
  }
}
</style>
