<template>
  <div class="mine-item" @click="gotoUserInfo"
       v-stat="{category:'按钮点击事件', action:'我的', name: '编辑用户'}">
    <div class="item">
      <div class="icon">
        <img :src="this.userInfo.faceImg ? this.userInfo.faceImg : getFaceImg" ref="face"/>
      </div>
      <div class="info">
        <div class="title">{{getTitle}}</div>
        <div class="desc">查看或编辑个人信息</div>
      </div>
      <div class="arrow material-icons arrow">&#xe5cc;</div>
    </div>
  </div>
</template>

<script>
import { url } from '@/const'
import { mapGetters } from 'vuex'
export default {
  name: 'MineUserCell',
  data () {
    return {
      userInfo: {
        title: '未登陆',
        faceImg: ''
      }
    }
  },
  mounted () {
    this.accapceNotification()
  },
  computed: {
    getTitle () {
      if (this.userKeys.hasOwnProperty('userName')) {
        return this.userKeys.userName
      } else {
        return '未登陆'
      }
    },
    getFaceImg () {
      if (this.userKeys && this.userKeys.userId) {
        return this.baseUrl + url.GetProfilePicture + '/' + this.userKeys.userId
      } else {
        return require('@/assets/images/error-userface.png')
      }
    },
    ...mapGetters([
      'userKeys',
      'baseUrl'
    ])
  },
  destroyed () {
    this.bus.$off('mineRefresh')
  },
  methods: {
    accapceNotification () {
      // const that = this
      this.bus.$on('mineRefresh', () => {
        this.mineRefresh()
      })
    },
    mineRefresh () {
      this.userInfo.faceImg = this.baseUrl + url.GetProfilePicture + '/' + this.userKeys.userId + '?' + new Date()
    },
    gotoUserInfo () {
      let userKeys = this.userKeys
      if (userKeys && userKeys.userId) {
        this.$router.push({
          name: 'user-info'
        })
      } else {
        this.$router.push({
          name: 'login'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.mine-item{
  width: 100%;
  color: white;
  .item{
    font-size: @font_size_4;
    padding: 0 25px;
    display: flex;
    align-items: center;
    .info{
      flex: 1;
      padding-left: 15px;
      .desc{
        margin-top: 8px;
        font-size: @font_size_1;
      }
    }
    .arrow{
      font-size: 30px;
    }
    .icon{
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      img{
        width: 100%;
      }
    }
  }
}
</style>
