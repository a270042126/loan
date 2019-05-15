<template>
  <div>
    <transition  enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div v-if="isShow" class="bg-cover"></div>
    </transition>
    <transition  enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
      <div v-if="isShow" class="dialog" :style="`height: ${height ? height : 'auto'}`">
        <div style="position: relative;height: 100%">
          <div class="header">
            <img :src="require('./close_black.png')" class="close" @click="close">
            <div class="title">{{title}}</div>
          </div>
          <div class="content">
            <slot></slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'OrderPact',
  props: {
    title: String,
    height: String
  },
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    close () {
      this.isShow = false
    },
    open () {
      this.isShow = true
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.dialog {
  position: fixed;
  background: white;
  margin:auto;
  top: 0;
  left:0;
  right:0;
  bottom:0;
  width: 75%;
  max-width: 300px;
  max-height: 400px;
  z-index: 999;
  .header {
    height: 40px;
    background: @theme_primary;
    position: relative;
    .close{
      position: absolute;
      right: 10px;
      top: 10px;
      width: 20px;
    }
    .title {
      font-size: @font_size_3;
      text-align: center;
      line-height: 40px;
    }
  };
  .content{
    position: absolute;
    right: 10px;
    top: 50px;
    left: 10px;
    bottom: 10px;
  }
}
</style>
