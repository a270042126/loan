/***
 * 极光推送
 * */
import { isApp } from '../../const'
import { apid, storage, common } from '../index'

class JSPush {
  constructor () {
    this.userKeys = storage.get('userKeys')
  }
  ready () {
    const that = this
    this.ajpush = api.require('ajpush')
    this.ajpush.init((ret) => {
      if (ret && ret.status === 1) {
        console.log('ajpush')
        // .设置监听事件
        that.setListener()
      }
    })
    that.bindAliasAndTags()
    that.setUserIsAllowPush()
  }
  // 获取用户设置是否允许
  setUserIsAllowPush () {
    const userKeys = this.userKeys
    const pushConfig = storage.get('pushconfig-' + userKeys.userId)
    const onSwitch = (!pushConfig || pushConfig === 'allow')
    if (onSwitch) {
      this.resumePush(false)
    } else {
      this.stopPush(false)
    }
  }
  // .设置机器别名
  bindAliasAndTags () {
    const userKeys = this.userKeys
    this.ajpush.bindAliasAndTags({
      alias: userKeys.userId
    }, () => {})
  }
  // 设置消息监听
  setListener () {
    // .极光监听(自动)
    const that = this
    this.ajpush.setListener((ret) => {})
    // 监听应用进入后台，通知jpush暂停事件
    apid.addEventListener('pause', (ret) => {
      if (ret) {
        that.ajpush.onPause()
      }
    })
    // 监听应用恢复到前台，通知jpush恢复事件
    apid.addEventListener('resume', (ret) => {
      if (ret) {
        that.ajpush.onResume()
      }
    })
    // 监听事件 允许推送设置
    apid.addEventListener('push', (ret) => {
      if (ret && ret.value) {
        if (ret.value.type === 'resumePush') {
          that.resumePush(true)
        }
        if (ret.value.type === 'stopPush') {
          that.stopPush(true)
        }
      }
    })

    // 监听事件:应用被其他应用调起
    apid.addEventListener('appintent', (ret) => {
      // .极光推送
      if (ret && ret.appParam.ajpush) {
        that.ajpush.startActivity(ret.appParam.ajpush)
      }
    })
    // 监听事件:token刷新
    apid.addEventListener('refreshToken', (ret) => {
      that.ajpush.bindAliasAndTags()
    })
    // 监听事件:user 登入登出
    apid.addEventListener('user', (ret, err) => {
      // .用户登录成功
      if (ret && ret.value.type === 'login') {
        that.ajpush.bindAliasAndTags()
        that.ajpush.resumePush(false)
      }
      // .用户注销
      if (ret && ret.value.type === 'logout') {
        that.ajpush.stopPush(false)
      }
    })
  }

  openOrClosePush (value) {
    if (!isApp) {
      return false
    }
    apid.sendEvent('push', {
      type: (value === 'allow') ? 'resumePush' : 'stopPush'
    })
  }

  resumePush (toast) {
    this.ajpush.resumePush((ret) => {
      if (ret && ret.status && toast) {
        common.successT('推送服务已恢复')
      }
    })
  }

  stopPush (toast) {
    this.ajpush.stopPush((ret) => {
      if (ret && ret.status && toast) {
        common.successT('推送服务已停用')
      }
    })
  }
}

export default new JSPush()
