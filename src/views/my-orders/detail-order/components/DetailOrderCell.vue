<template>
  <div class="cell" @click="click">
    <div>
      <div class="title">{{title}}</div>
      <div class="text" :style="`color:${textColor}`">{{text}}</div>
      <div v-if="arrow" class="material-icons icon">chevron_right</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailOrderCell',
  props: {
    arrow: {
      type: Boolean,
      default: false
    },
    title: String,
    text: String,
    textColor: {
      type: String,
      default: '#000'
    }
  },
  methods: {
    click () {
      this.$emit('onClick')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.cell{
  padding: 0 @space1;
  & > div{
    height: 44px;
    font-size: @font_size_2;
    border-bottom: 1px solid @light_gray;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .text{
      flex: 1;
      text-align: right;
    }
    .icon{
      width: 14px;
      color: @light_gray2;
    }
  }
}
</style>
