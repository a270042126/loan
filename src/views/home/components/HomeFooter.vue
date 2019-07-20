<template>
  <section class="footer">
    <h1>{{getProject}} · 您的首选贷款平台</h1>
    <p>简单 快捷 安全</p>
  </section>
</template>

<script>
export default {
  name: 'MineFooter',
  computed: {
    getProject () {
      return document.title
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.footer{
  padding: 20px 0;
  text-align: center;
  color: @light_gray3;
  h1{
    font-size: @font_size_3;
    padding-bottom: 10px;
  }
  p{
    font-size: @font_size_2;
  }
}
</style>
