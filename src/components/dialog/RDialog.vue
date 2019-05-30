<template>
  <transition  enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <div v-if="isCover" class="bg-cover">
      <transition  enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
        <div v-if="isShow" class="dialog">
          <div style="position: relative;height: 100%">
            <div class="header">
              <img :src="require('./close_black.png')" class="close" @click="close">
              <div class="title">{{title}}</div>
            </div>
            <div class="content" :style="height ? `height: ${height}` : ''">
              <slot></slot>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
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
      isShow: false,
      isCover: false
    }
  },
  methods: {
    close () {
      this.isShow = false
      setTimeout(() => {
        this.isCover = false
      }, 300)
    },
    open () {
      this.isCover = true
      setTimeout(() => {
        this.isShow = true
      }, 100)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.bg-cover{
  display: flex;
  align-items: center;
  .dialog {
    position: relative;
    margin: 0 auto;
    background: white;
    width: 80%;
    max-height: 80%;
    z-index: 999;
    .header {
      height: 40px;
      background: @theme_primary;
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
    }
    .content{
      padding: 10px;
      max-width: 70vh;
    }
  }
}
</style>
