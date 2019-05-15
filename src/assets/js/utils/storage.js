/**
 * 本地存储
 * @type {{init, set, get, clear, remove}}
 */
class Mystorage {
  constructor () {
    this.storage = localStorage
    if (!this.storage) {
      alert('浏览器支持localstorage')
    }
  }

  sessionSet (key, value) {
    this.set(key, value, 1800000)
  }

  set (key, value, expires) {
    let params = {}
    params.value = value
    if (expires) {
      params.start = new Date().getTime()
      params.expires = expires
    }
    let mydata = JSON.stringify(params)
    this.storage.setItem(key, mydata)
  }

  get (key) {
    // 读取
    const mydataJson = this.storage.getItem(key)
    if (!mydataJson) {
      return false
    }
    const mydata = JSON.parse(mydataJson)

    if (mydata.hasOwnProperty('start')) {
      let date = new Date().getTime()
      if (date - mydata.start > mydata.expires) {
        // 缓存过期，清除缓存，返回false
        this.remove(key)
        return false
      } else {
        return mydata.value
      }
    } else {
      return mydata.value
    }
  }

  remove (key) {
    // 读取
    let mydata = this.storage.getItem(key)
    if (!mydata) {
      return false
    } else {
      this.storage.removeItem(key)
      return true
    }
  }

  clear () {
    // 清除对象
    this.storage.clear()
  }
}

export default new Mystorage()
