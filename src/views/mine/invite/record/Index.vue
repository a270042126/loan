<template>
  <base-page :navOptions="{ title: '邀请记录', isBack: true}">
    <div slot="navRightItem">
      <button @click="withdrawClick" style="color: white">提现</button>
    </div>
    <better-scroll class="record">
      <ul class="list">
        <li>
          <p>用户</p>
          <p>类型</p>
          <p>佣金</p>
          <p>状态</p>
          <p>时间</p>
        </li>
        <li>
          <p>XX</p>
          <p>注册提成</p>
          <p>2元</p>
          <p>已结算</p>
          <p>2019-01-01</p>
        </li>
        <li>
          <p>XX</p>
          <p>注册提成</p>
          <p>2元</p>
          <p>已结算</p>
          <p>2019-01-01</p>
        </li>
        <li>
          <p>XX</p>
          <p>注册提成</p>
          <p>2元</p>
          <p>已结算</p>
          <p>2019-01-01</p>
        </li>
        <li>
          <p>XX</p>
          <p>注册提成</p>
          <p>2元</p>
          <p>已结算</p>
          <p>2019-01-01</p>
        </li>
      </ul>
    </better-scroll>
  </base-page>
</template>

<script>
export default {
  name: 'Index',
  methods: {
    withdrawClick () {
      this.$router.push({
        name: 'withdraw'
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
.record{
  .list{
    background: white;
    padding: 0 5px;
    font-size: @font_size_2;
    li:first-child {
      border-bottom: 1px solid @light_gray3;
      padding: 15px 0;
    }
    li{
      display: flex;
      justify-content: space-between;
      text-align: center;
      padding: 10px 0;
      p{
        width: 20%;
      }
      p:nth-child(4){
        width: 15%;
      }
      p:nth-child(5){
        width: 25%;
      }
    }
  }
}
</style>
