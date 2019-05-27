<template>
  <base-page tabBarIndex="2" :navOptions="navOptions">
    <better-scroll :data="list" ref="scroll"
                 :pullDownRefresh="true"
                 :pullUpLoad="false"
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
      navOptions: {
        title: '消息'
      },
      totalCount: 0,
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
  },
  methods: {
    // 取消刷新
    foreceUpdate () {
      if (this.$refs.scroll) {
        this.$refs.scroll.forceUpdate()
      }
    },
    onPullingUp () {
      this.params.skipCount += this.params.maxResultCount
      this.getContentList()
    },
    onPullingDown () {
      this.params.skipCount = 0
      this.getContentList()
    },
    getContentList () {
      request({
        type: 'post',
        data: this.params,
        path: url.ProjectContent.GetContentList,
        fn: (res) => {
          const items = res.result.items
          if (this.params.skipCount === 0) {
            this.list = items
          } else {
            this.list.concat(items)
          }
          this.totalCount = res.result.totalCount
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
