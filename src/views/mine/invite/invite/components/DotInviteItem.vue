<template>
  <div class="item">
    <div class="desc">
      <div class="left">
        <div class="sign">
          <img src="@/assets/images/invite/icon3.png">
          <p>{{num}}</p>
        </div>
        <p class="line1"></p>
        <p class="line2"></p>
      </div>
      <p class="info">
        <slot name="info"></slot>
      </p>
    </div>
    <div class="photo" :style="`height: ${imgHeight}`">
      <slot name="photo"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DotInviteItem',
  props: {
    num: String,
    imgHeight: {
      default: '200px'
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
.item{
  .desc{
    display: flex;
    .left{
      width: 35px;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      .sign{
        width: 34px;
        height: 34px;
        margin-bottom: 15px;
        p{
          position: absolute;
          color: white;
          font-size: @font_size_5;
          top: 7px;
          left: 11px;
        }
      }
      & > p {
        background: @theme_primary;
        width: 2px;
        height: 10px;
        margin-bottom: 8px;
      }
      .line1{
        height: 4px;
      }
    }
    .info{
      margin-left: 10px;
      color: @light_gray2;
      font-size: @font_size_2;
      line-height: 20px;
    }
  }
  .photo{
    overflow: hidden;
    border-left: 2px solid @theme_primary;
    margin-left: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
