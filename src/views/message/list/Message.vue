<template>
  <base-page tabBarIndex="2" :navOptions="navOptions">
    <better-scroll :data="list" ref="scroll"
                 :pullDownRefresh="true"
                 @pulling-down="onPullingDown" class="main-body">
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
import { request } from 'js/utils'
import { url } from 'js/const'
export default {
  name: 'Message',
  data () {
    return {
      navOptions: {
        title: '消息'
      },
      params: {
        type: 2,
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
    onPullingDown () {
      request({
        type: 'post',
        data: this.params,
        path: url.ProjectContent.GetContentList,
        fn: (res) => {
          this.list = res.result.items
        },
        errFn: () => {
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
