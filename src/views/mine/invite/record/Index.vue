<template>
  <base-page :navOptions="{ title: '邀请记录', isBack: true}">
    <div slot="navRightItem">
      <button @click="extendClick" style="color: white"
              v-stat="{category:'按钮点击事件', action:'邀请记录', name: '推广佣金'}">推广佣金</button>
    </div>
    <better-scroll class="record" :data="list" ref="scroll"
                   :pullUpLoad="true"
                   :pullDownRefresh="true"
                   @pulling-down="onPullingDown"
                   @pulling-up="onPullingUp">
      <ul class="list">
        <li>
          <p>账号</p>
          <p>姓名</p>
          <p>状态</p>
          <p>时间</p>
        </li>
        <li v-for="(item, key) in list" :key="key">
          <p>{{item.userName}}</p>
          <p>{{item.name}}</p>
          <p>{{item.verifyNames.length > 0 ? '已认证' : ''}}</p>
          <p>{{item.creationTime|dateFormat}}</p>
        </li>
      </ul>
    </better-scroll>
  </base-page>
</template>

<script>
import { request } from '@/utils'
import { url } from '@/const'
export default {
  name: 'Index',
  data () {
    return {
      list: [],
      params: {
        sorting: '',
        maxResultCount: 20,
        skipCount: 0
      }
    }
  },
  mounted () {
    this.onPullingDown()
  },
  methods: {
    onPullingDown () {
      this.params.skipCount = 0
      this.getRefereeUserList()
    },
    onPullingUp () {
      this.params.skipCount += this.params.maxResultCount
      this.getRefereeUserList()
    },
    getRefereeUserList () {
      request({
        type: 'post',
        path: url.Affiliate.GetRefereeUserList,
        data: this.params,
        fn: data => {
          const totalCount = data.result.totalCount
          if (this.list.length >= totalCount) {
            this.$refs.scroll.closePullUp()
          } else {
            this.$refs.scroll.openPullUp()
          }
          const items = data.result.items
          if (this.params.skipCount === 0) {
            this.list = items
          } else {
            this.list = this.list.concat(items)
          }
        },
        errFn: () => {
          this.foreceUpdate()
        }
      })
    },
    // 取消刷新
    foreceUpdate () {
      if (this.$refs.scroll) {
        this.$refs.scroll.forceUpdate()
      }
    },
    extendClick () {
      this.$router.push({
        name: 'inviteGold'
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
        flex: 1;
      }
    }
  }
}
</style>
