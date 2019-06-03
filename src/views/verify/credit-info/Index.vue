<template>
  <base-page :navOptions="{ title: '征信', isBack: true}">
    <div class="header">
      <div>
        <svg-icon iconClass="loan"/>
      </div>
      <div>
        <p>借1000元，待认证</p>
        <p>您的借款现在处于待认证状态，差最后...</p>
      </div>
      <div>
        <svg-icon iconClass="arrow-right"/>
      </div>
    </div>
    <better-scroll>
      <ul class="list">
        <li>
          <input type="radio" />
          <div>
            <p class="title">征信查询高级版</p>
            <p class="recommend">推荐</p>
          </div>
          <p class="price">￥35</p>
          <button>查看详情</button>
        </li>
      </ul>
    </better-scroll>
  </base-page>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      list: []
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.header{
  display: flex;
  align-items: center;
  background: white;
  padding: 10px 15px;
  div:first-child{
    font-size: @font_size_7;
    background: @theme_color3;
    color: white;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 50%;
    margin-right: 10px;
  }
  div:nth-child(2){
    flex: 1;
    p:first-child{
      font-size: @font_size_4;
    }
    p:nth-child(2) {
      font-size: @font_size_2;
      padding: 5px 0;
      color: @theme_color4;
    }
  }
  div:last-child {
    color: @light_gray2;
    font-size: @font_size_6;
  }
}
.list{
  padding: 20px 0;
  li{
    padding: 15px;
    background: white;
    font-size: @font_size_2;
    display: flex;
    align-items: center;
    div{
      flex: 1;
      display: flex;
      align-items: center;
      .title{
        font-size: @font_size_3;
        font-weight: bold;
        padding: 0 10px;
      }
      .recommend{
        background: @theme_color6;
        padding: 8px 10px;
        border-radius: 4px;
        color: white;
      }
    }
    .price{
      color: @theme_color3;
      font-size: @font_size_3;
      padding: 0 10px;
    }
    button{
      background: @theme_color3;
      padding: 10px;
      color: white;
      border-radius: 4px;
    }
  }
}
</style>
