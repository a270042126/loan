<template>
  <div class="verify-cell" @click="_gotoOther">
    <div class="top">
      <div class="icon" v-if="item.icon">
        <svg-icon :iconClass="item.icon"/>
      </div>
      <div v-else-if="item.iconName" class="icon name">
        {{item.iconName}}
      </div>
      <div class="title">{{item.title}}
        <span v-if="item.verifyNames" :class="`status ${item.status ? 'green' : 'red'}`">({{item.status ? '已认证' : '未认证'}})</span></div>
      <div class="go-verify">{{item.status ? '重新认证' : '去认证'}}</div>
    </div>
    <div class="bottom">
      {{item.desc}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'VerifyCell',
  props: {
    item: {}
  },
  methods: {
    _gotoOther () {
      this.$emit('gotoOther')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.verify-cell{
  background: white;
  padding: 10px @space1;
  margin-bottom: 20px;
  .shadow(1px, 1px, 10px, @light_gray3);
  border-radius: 6px;
  .top{
    padding-bottom: 10px;
    border-bottom: 1px solid @light_gray;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .icon{
      color: white;
      font-size: @font_size_3;
      background: @theme_primary;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .icon.name{
      font-size: @font_size_1;
    }
    .title{
      font-size: @font_size_3;
      padding-left: 4px;
      flex: 1;
      .status{
        font-size: @font_size_2;
        margin-left: 10px;
      }
      .red{
        color: red;
      }
      .green{
        color: green;
      }
    }
    .go-verify{
      color: white;
      font-size: @font_size_2;
      background: @theme_primary;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 15px;
      padding: 0 15px;
    }
  }
  .bottom{
    color: @light_gray2;
    font-size: @font_size_2;
    padding-top: 10px;
  }
}
</style>
