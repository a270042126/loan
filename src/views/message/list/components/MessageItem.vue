<template>
  <div class="message-item" @click="_click">
    <div class="material-icons">notifications_active</div>
    <div class="content-item">
      <div class="title">{{item.displayName}}</div>
      <VerticalToggle>
        <div class="content" v-if="isShow" v-html="item.content"></div>
      </VerticalToggle>
    </div>
    <div class="arrow">
      <svg-icon v-if="isShow" iconClass="down"/>
      <svg-icon v-else iconClass="up"/>
    </div>
  </div>
</template>

<script>
import VerticalToggle from 'js/vertical-toggle'
export default {
  name: 'MessageItem',
  props: {
    item: {}
  },
  components: {
    VerticalToggle
  },
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    _click () {
      console.log(123)
      this.isShow = !this.isShow
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.message-item{
  padding: 8px @space1 10px @space1;
  background: white;
  display: flex;
  justify-content: space-between;
  .material-icons{
    background: @theme_primary;
    color:white;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    margin-right: 10px;
  }
  .content-item{
    width: 0;
    padding-bottom: 6px;
    border-bottom: 1px solid @light_gray;
    flex-grow: 1;
    .title{
      font-size: @font_size_3;
      margin-bottom: 10px;
      height: 40px;
      line-height: 40px;
    }
    .content{
      font-size: @font_size_1;
      color: @light_gray2;
      padding-bottom: 10px;
    }
  }
  .arrow{
    margin-top: 10px;
    color: @light_gray3;
    font-size: @font_size_5;
  }
}
</style>
