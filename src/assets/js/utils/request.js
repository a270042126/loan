import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import VueAxios from 'vue-axios'
import { url } from 'js/const'
import { apid, common } from 'js/utils'
import moment from 'moment'

Vue.use(VueAxios, axios)

// 是否有请求正在刷新token
window.isTokenRefreshing = false
// axios 配置
axios.defaults.timeout = 30000
axios.defaults.baseURL = url.baseUrl
// axios.defaults.headers.post['Content-Type'] = 'application/json'

// http request 拦截器
axios.interceptors.request.use(
  config => {
    const userKeys = store.getters.userKeys
    if (userKeys) {
      config.headers.Authorization = `Bearer ${userKeys.accessToken}`
      // token 刷新
      const loginTime = userKeys.loginTime ? moment(userKeys.loginTime).add(userKeys.expireInSeconds, 's') : ''
      // 日期是否过期
      if (!window.isTokenRefreshing && loginTime && loginTime.isBefore(new Date())) {
        window.isTokenRefreshing = true
        request({
          type: 'post',
          path: url.RefreshToken + '?refreshToken=' + userKeys.refreshToken,
          fn: data => {
            window.isTokenRefreshing = false
            userKeys.accessToken = data.result.accessToken
            userKeys.expireInSeconds = data.result.expireInSeconds
            store.dispatch('setToken', userKeys)
            apid.sendEvent('refreshToken')
          },
          errFn: () => {
            window.isTokenRefreshing = false
          }
        })
      }
    } else {
      const RefereeId = common.getQueryFromUrl(config.url, 'RefereeId')
      config.headers.RefereeId = RefereeId
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          store.dispatch('logout')
          // 只有在当前路由不是登录页面才跳转
          router.currentRoute.path !== 'login' &&
          router.replace({
            path: 'login',
            query: { redirect: router.currentRoute.path }
          })
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error.response.data)
  }
)

/**
 * 封装axios的通用请求
 * @param  {string}   type      get或post
 * @param  {string}   url       请求的接口URL
 * @param  {object}   data      传的参数，没有则传空对象
 * @param  {Function} fn        回调函数
 * @param  {boolean}   tokenFlag 是否需要携带token参数，为true，不需要；false，需要。一般除了登录，都需要
 */
const request = function ({
  type,
  path,
  data,
  fn,
  errFn,
  headers,
  opts
} = {}) {
  const tempUrl = path + ((path.search(/=/i) > 0) ? '&' : '?') + 'timestamp=' + Math.random()

  if (headers || typeof headers !== 'object') {
    headers = {}
  }

  if (type === 'upload') {
    headers['Content-Type'] = 'multipart/form-data'
    const options = {
      headers: headers
    }
    axios.post(tempUrl, data, options).then((res) => {
      // console.log(JSON.stringify(res.data).toString())
      fn(res.data)
    }).catch((error) => {
      errorHandle(error)
    })
  } else {
    headers['Content-Type'] = 'application/json'

    let options = {
      method: type,
      url: tempUrl,
      headers: headers && typeof headers === 'object' ? headers : {},
      [type === 'get' ? 'params' : 'data']: data
    }

    if (opts && typeof opts === 'object') {
      for (let f in opts) {
        options[f] = opts[f]
      }
    }

    axios(options).then((res) => {
      // console.log(JSON.stringify(res.data).toString())
      fn(res.data)
    }).catch((error) => {
      errorHandle(error)
    })
  }

  // 错误处理
  const errorHandle = (error) => {
    console.log(JSON.stringify(error))
    if (error.error) {
      if (error.error.details) {
        common.errorT(error.error.details)
      } else if (error.error.message) {
        common.errorT(error.error.message)
      } else {
        common.errorT('网络出错')
      }
    } else {
      common.errorT('网络出错')
    }
    if (errFn) {
      errFn(error)
    }
  }
}
export default request
