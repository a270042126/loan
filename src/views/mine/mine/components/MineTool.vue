<template>
  <section class="tool">
    <h1>常用工具</h1>
    <ul>
      <li v-for="(item, key) in list" :key="key" @click="gotoOther(item)"
          v-stat="{category:'按钮点击事件', action:'我的', name: item.title}">
        <i class="material-icons" :style="`color: ${key % 2 === 0 ? '#03a9f4' : '#ffc107'}`">{{item.icon}}</i>
        <p>{{item.title}}</p>
      </li>
    </ul>
  </section>
</template>

<script>
import { common } from '@/utils'
export default {
  name: 'MineTool',
  data () {
    return {
      list: [
        { icon: 'description', title: '我的资料', path: 'verify' },
        { icon: 'assignment', title: '记录', path: 'my-orders' },
        { icon: 'favorite', title: '我的收藏', path: 'favorite' },
        { icon: 'face', title: '邀请好友', path: 'invite' },
        { icon: 'question_answer', title: '常见问题', path: 'fquestion' }
      ]
    }
  },
  methods: {
    gotoOther (item) {
      common.trackEvent('按钮点击事件', '我的点击', item.title)
      this.$router.push({ name: item.path })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.tool{
  margin-top: 65px;
  background: white;
  h1{
    color: @light_gray2;
    padding: 12px 0;
    margin-left: 15px;
    border-bottom: 1px solid @light_gray;
  }
  ul{
    padding: 25px 2%;
    display: flex;
    flex-wrap:wrap;
    li{
      width: 24%;
      text-align: center;
      margin-bottom: 30px;
      i{font-size: @font_size_8}
      p{
        color: @light_gray2;
        padding-top: 10px;
      }
    }
  }
}
</style>
