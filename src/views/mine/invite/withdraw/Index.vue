<template>
  <base-page :navOptions="{ title: '提现', isBack: true}">
    <div class="withdraw">
      <h1>可提金额：50</h1>
      <div class="input-group">
        <text-input title="提现金额" placeholder="请输入提现金额"/>
        <div class="btn">
          <button class="simple-btn">提现</button>
        </div>
      </div>
      <div class="record">
        <ul>
          <li>
            <p>提现金额</p>
            <p>状态</p>
            <p>时间</p>
          </li>
          <li>
            <p>100</p>
            <p>处理中</p>
            <p>2019-01-01</p>
          </li>
          <li>
            <p>100</p>
            <p>已支付</p>
            <p>2019-01-01</p>
          </li>
          <li>
            <p>100</p>
            <p>已支付</p>
            <p>2019-01-01</p>
          </li>
        </ul>
      </div>
    </div>
  </base-page>
</template>

<script>
import TextInput from '@/components/TextInput'
export default {
  name: 'Index',
  components: { TextInput },
  data () {
    return {
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
.withdraw{
  h1{
    font-size: @font_size_4;
    text-align: center;
    padding: 20px 0;
    background: white;
    border-bottom: 1px solid @light_gray;
    color: @theme_color3;
  }
  .input-group{
    .btn {
      padding: 60px @space1;
    }
  }
  .record {
    background: white;
    padding: 15px 0;
    ul{
      li {
        display: flex;
        justify-content: center;
        padding: 10px 0;
         & > p{
           text-align: center;
           width: 30%;
        }
      }
      li:first-child{
        border-bottom: 1px solid @light_gray;
      }
    }
  }
}
</style>
