<template>
  <base-page :navOptions="{ title: '消息', isBack: true}">
    <div slot="navRightItem">
      <div class="nav-right-item" @click="deleteClick"
           v-stat="{category:'按钮点击事件', action:'消息', name: '删除'}">
        <svg-icon iconClass="trash"/>
      </div>
    </div>
    <better-scroll>
      <div class="message">
        <h2>{{notificationName}}</h2>
        <p class="time">{{$route.query.creationTime|dateFormat}}</p>
        <p class="content">{{message}}</p>
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
import { request } from '@/utils'
import { url } from '@/const'
import { baseMixin } from '@/mixins'
export default {
  name: 'Index',
  mixins: [baseMixin],
  data () {
    return {
      notificationName: this.$route.query.notificationName,
      message: this.$route.query.message,
      id: this.$route.query.id
    }
  },
  mounted () {
    this.setNotificationAsRead()
  },
  methods: {
    sendNotification () {
      this.bus.$emit('messageRefresh')
    },
    deleteClick () {
      this.alertT('你确定删除吗？', () => {
        const params = {
          id: this.id
        }
        request({
          type: 'post',
          data: params,
          path: url.Notification.DeleteNotification,
          fn: (data) => {
            this.sendNotification()
            if (data.success) {
              this.successT('删除成功')
            }
            setTimeout(() => {
              this.$router.goBack()
            }, 1500)
          },
          errFn: () => {
          }
        })
      })
    },
    setNotificationAsRead () {
      if (this.$route.query.state === 0) {
        const params = {
          id: this.id
        }
        request({
          type: 'post',
          data: params,
          path: url.Notification.SetNotificationAsRead,
          fn: () => {
            this.sendNotification()
          },
          errFn: () => {
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
.nav-right-item{
  font-size: @font_size_6;
}
.container{
  background: white;
  .message{
    h2{
      font-size: @font_size_5;
      text-align: center;
      padding: 10px 0;
    }
    .time{
      color: @light_gray2;
      font-size: @font_size_1;
      text-align: center;
      padding-bottom: 10px;
    }
    .content{
      font-size: @font_size_3;
      line-height: 20px;
      padding: 0 15px;
      text-indent:35px;
    }
  }
}
</style>
