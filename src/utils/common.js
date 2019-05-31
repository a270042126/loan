import Vue from 'vue'
const vm = new Vue()
class Common {
  static platform () {
    let ua = navigator.userAgent.toLowerCase()
    if (/micromessenger/.test(ua)) {
      return 0
    } else {
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        return 1
      } else if (/(Android)/i.test(navigator.userAgent)) {
        return 2
      }
    }
  }

  static getFileToken () {
    function s4 () {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
  }
  // 正则表达式获取文件名，不带后缀
  static getFileName (fileName) {
    return fileName.replace(/(.*\/)*([^.]+).*/ig, '$2')
  }

  static toast (text) {
    vm.$createToast({
      txt: text,
      type: 'text'
    }).show()
  }

  static successT (text) {
    vm.$createToast({
      txt: text,
      type: 'error'
    }).show()
  }

  static errorT (text) {
    vm.$createToast({
      txt: text,
      type: 'error'
    }).show()
  }

  /**
   * dataURL to blob, ref to https://gist.github.com/fupslot/5015897
   * @param dataURI
   * @returns {Blob}
   */
  static dataURItoBlob (dataURI) {
    let byteString = atob(dataURI.split(',')[1])
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    let ab = new ArrayBuffer(byteString.length)
    let ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], { type: mimeString })
  }
  static getQueryFromUrl (url, paraName) {
    const arrObj = url.split('?')
    if (arrObj.length > 1) {
      const arrPara = arrObj[1].split('&')
      let arr
      for (const i in arrPara) {
        arr = arrPara[i].split('=')
        if (arr != null && arr[0] === paraName) {
          return arr[1]
        }
      }
      return ''
    } else {
      return ''
    }
  }
}
export default Common
