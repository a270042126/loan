<template>
  <div :class="`cell ${item.state === 0 ? 'read' : ''}`" @click="gotoDetailClick">
    <div>
      <h2>{{item.notification.notificationName}}</h2>
      <div>
        <svg-icon iconClass="message" />
      </div>
    </div>
    <p class="time">{{item.notification.creationTime|dateFormat}}</p>
    <p class="message">{{item.notification.data.message}}</p>
    <div class="bottom">
      <p>立即查看</p>
      <div class="arrow-icon">
        <svg-icon iconClass="arrow-right"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageItem',
  props: {
    item: {}
  },
  data () {
    return {}
  },
  methods: {
    gotoDetailClick () {
      this.$router.push({
        name: 'message-detail',
        query: {
          creationTime: this.item.notification.creationTime,
          notificationName: this.item.notification.notificationName,
          message: this.item.notification.data.message,
          id: this.item.id,
          state: this.item.state
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.cell {
  margin: 0 15px 15px 15px;
  border-radius: 5px;
  font-size: @font_size_2;
  background: white;
  padding: 10px 15px;
  color: @light_gray2;
  & > div:first-child{
    display: flex;
    justify-content: space-between;
    align-items: center;
    h2{
      font-size: @font_size_4;
      font-weight: 600;
    }
    div {
      font-size: @font_size_6;
      color: white;
      background: @theme_primary;
      padding: 5px;
      border-radius: 50%;
    }
  }
  .time{
    padding: 5px 0;
  }
  .message{
    font-size: @font_size_3;
    padding: 5px 0 10px 0;
    .no-wrap;
  }
  .bottom{
    border-top: 1px solid @light_gray;
    padding-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: @font_size_3;
    .arrow-icon{
      font-size: @font_size_5;
    }
  }
}
.read{
  color: black;
  .bottom{
    color: @light_gray2;
  }
}
</style>
