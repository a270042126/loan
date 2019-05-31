<template>
  <base-page tabBarIndex="2" :navOptions="{title: '消息'}">
    <!--<div slot="navRightItem">-->
      <!--全部已读-->
    <!--</div>-->
    <better-scroll :data="list" ref="scroll"
                 :pullDownRefresh="true"
                 :pullUpLoad="true"
                 @pulling-down="onPullingDown"
                 @pulling-up="onPullingUp"
                 class="main-body">
      <div class="message">
        <template v-for="(item,index) in list">
          <message-item :item="item" :key="index"/>
        </template>
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
import MessageItem from './components/MessageItem'
import { request } from '@/utils'
import { url } from '@/const'
export default {
  name: 'Message',
  data () {
    return {
      params: {
        // type: 2,
        maxResultCount: 20,
        skipCount: 0
      },
      list: []
    }
  },
  mounted () {
    this.onPullingDown()
    this.accapceNotification()
  },
  destroyed () {
    this.bus.$off('messageRefresh')
  },
  methods: {
    accapceNotification () {
      // const that = this
      this.bus.$on('messageRefresh', () => {
        this.onPullingDown()
      })
    },
    // 取消刷新
    foreceUpdate () {
      if (this.$refs.scroll) {
        this.$refs.scroll.forceUpdate()
      }
    },
    onPullingUp () {
      this.params.skipCount += this.params.maxResultCount
      this.getUserNotifications()
    },
    onPullingDown () {
      this.params.skipCount = 0
      this.getUserNotifications()
    },
    getUserNotifications () {
      request({
        type: 'post',
        data: this.params,
        path: url.Notification.GetUserNotifications,
        fn: (res) => {
          const items = res.result.items
          if (this.params.skipCount === 0) {
            this.list = items
          } else {
            this.list.concat(items)
          }
          const totalCount = res.result.totalCount
          if (this.list.length >= totalCount) {
            this.$refs.scroll.closePullUp()
          } else {
            this.$refs.scroll.openPullUp()
          }
        },
        errFn: () => {
          this.foreceUpdate()
        }
      })
    }
  },
  components: {
    MessageItem
  }
}
</script>
<style lang="less" scoped>
.message{
  padding-top: 15px;
}
</style>
