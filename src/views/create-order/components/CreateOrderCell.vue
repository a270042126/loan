<template>
  <div class="cell" @click="onClick">
    <div class="title">{{title}}</div>
    <div class="right">
      <div class="subtitle">{{text}}</div>
      <div v-if="icon" class="material-icons icon" @click="onClick2">{{icon}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RListCell',
  props: {
    title: String,
    text: String,
    icon: String
  },
  methods: {
    onClick () {
      this.$emit('cellClick')
    },
    onClick2 () {
      this.$emit('iconClick')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.cell {
  height: 44px;
  background: white;
  font-size: @font_size_3;
  padding: 0 @space1;
  .display-flex();
  .flex-align-items-center();
  .flex-justify-content-space-between();
  .right{
    .display-flex();
    .flex-align-items-center();
    .icon{
      margin-left: 0.4rem;
      color: @theme_color2;
    }
  }
}
</style>
