<template>
  <base-page :navOptions="{ title: '设置', isBack: true}">
    <div class="content">
      <template v-for="(item, key) in list">
        <setting-item v-if="item.isShow"
                      :key="key" :num="key"
                      :item="item" @onClick="itemClick" @onSwitchChange="onSwitchChange"/>
      </template>
      <div class="exit_btn">
        <cube-button v-if="userKeys.hasOwnProperty('userName')" :light="true"  @click="logoutClick"
                     v-stat="{category:'按钮点击事件', action:'设置', name: '退出登录'}">退出</cube-button>
      </div>
    </div>
  </base-page>
</template>
<script>
import { baseMixin } from '@/mixins'
import SettingItem from './components/SettingItem'
import { mapActions, mapGetters } from 'vuex'
import { isApp } from '@/const'
import { storage, apid, push, common } from '@/utils'
export default {
  name: 'Setting',
  mixins: [baseMixin],
  data () {
    return {
      list: [
        { tag: 1, icon: 'fingerprint', title: '指纹验证', switch: true, onSwitch: true, isShow: isApp },
        { tag: 2, icon: 'bluetooth', title: '设备绑定', switch: true, onSwitch: true, isShow: isApp },
        { tag: 3, icon: 'edit', title: '修改资料', path: 'user-info', isShow: true },
        { tag: 4, icon: 'security', title: '修改密码', path: 'edit-pwd', isShow: true },
        { tag: 5, icon: 'send', title: '推送设置', switch: true, onSwitch: true, isShow: isApp },
        { tag: 6, icon: 'sd_storage', title: '清除缓存', subTitle: '1 MB', isShow: isApp },
        { tag: 7, icon: 'data_usage', title: '检查更新', subTitle: 'V-1.3.1', isShow: isApp }
      ]
    }
  },
  mounted () {
    console.log('me create')
    this.setPullSwitch()
    this.getChache()
  },
  computed: {
    ...mapGetters([
      'userKeys'
    ])
  },
  methods: {
    // 推送设置
    setPullSwitch () {
      const userKeys = this.userKeys
      const pushConfig = storage.get('pushconfig-' + userKeys.userId)
      const onSwitch = (!pushConfig || pushConfig === 'allow')
      this.list[4].onSwitch = onSwitch
      // console.log('pushConfig', onSwitch)
    },
    // 推送设置
    openOrClosePush (value) {
      const userKeys = this.userKeys
      const onSwitch = (value ? 'allow' : 'refusal')
      // console.log(onSwitch)
      storage.set('pushconfig-' + userKeys.userId, onSwitch)
      push.openOrClosePush(onSwitch)
    },
    // 获取缓存
    getChache () {
      const size = apid.getCacheSize()
      this.list[5].subTitle = (size / 1048576).toFixed(0) + ' MB'
    },
    // 清理缓存
    clearCache (key) {
      const that = this
      apid.clearCache(() => {
        that.list[key].subTitle = '0M'
      })
    },
    onSwitchChange (key, value) {
      console.log(key, value)
      if (key === 4) {
        this.openOrClosePush(value)
      }
    },
    itemClick (key) {
      common.trackEvent('按钮点击事件', '设置', this.list[key].title)
      if (key === 2 || key === 3) {
        this.$router.push({
          path: this.list[key].path
        })
      } else if (key === 5) {
        this.clearCache(key)
      } else if (key === 6) {
      }
    },
    // 登出
    logoutClick () {
      common.trackEvent('按钮点击事件', '设置', '登出')
      if (storage.get('userKeys')) {
        this.logout()
        this.successT('退出账号成功')
        apid.sendEvent('user', { type: 'logout' })
      }
    },
    ...mapActions([
      'logout'
    ])
  },
  components: {
    SettingItem
  }
}
</script>
<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.content{
  background: @light_gray;
  height: 100%;
  .exit_btn{
    width: 90%;
    margin: 20px auto;
    button{
      width: 100%;
      height: 40px;
      line-height:1px;
      background: @btn_border_color1;
      font-size: @font_size_1;
      .shadow(0,2px,2px,@light_gray3);
      color: white;
    }
  }
}
</style>
