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
export default {
  name: 'Message',
  data () {
    return {
      navOptions: {
        title: '消息'
      },
      list: [
        { icon: 'notifications_active', title: '公告消息', message: '请勿向他人汇款请勿向他人汇款请勿向他人汇款他人汇款他人汇款他人汇款他人汇款他人汇款' },
        { icon: 'notifications_active', title: '公告消息', message: '请勿向他人汇款请勿向他人汇款请勿向他人汇款' }
      ]
    }
  },
  methods: {
    onPullingDown () {
      console.log(123)
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
