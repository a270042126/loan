import Vue from 'vue'
import './cube-ui'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import VueLazyload from 'vue-lazyload'
import './icons' // icon
// 通过components下的index.js文件导入组件
import components from './components'
import { isApp } from '@/const/'
import { event, apid, push } from '@/utils/'
import 'amfe-flexible'
import Navigation from './components/navigation'
import './directive'
import fastclick from 'fastclick'
import * as filters from '@/filters' // global filters
import VueMatomo from 'vue-matomo'

fastclick.attach(document.body)

// 页面App导航
Vue.use(Navigation, { router, store })
Vue.use(VueLazyload, {
  loading: require('assets/images/zmverified_grey.png')
})
// 调用同级页面方法
Vue.prototype.bus = event

Vue.config.productionTip = true

// 对导入的组件进行全局组件注册
Object.keys(components).forEach((key) => {
  Vue.component(key, components[key])
})
// 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// matomo用户统计--类似于友盟
Vue.use(VueMatomo, {
  // 这里配置你自己的piwik服务器地址和网站ID
  host: 'https://analytics.jxstudio.cn',
  siteId: 1,
  // 根据router自动注册
  router: router,
  enableLinkTracking: true,
  // 是否需要在发送追踪信息之前请求许可
  // 默认false
  requireConsent: false,
  // 是否追踪初始页面
  // 默认true
  trackInitialView: true,
  // 最终的追踪js文件名
  // 默认 'piwik'
  trackerFileName: 'piwik',
  debug: true
})

if (isApp) {
  window.apiready = function () {
    apid.ready()
    push.ready()
    new Vue({
      router,
      store,
      render: h => h(App),
      data: {} // 这里留空，后面ajax返回后动态添加 app.$data=ret
    }).$mount('#app')
  }
} else {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}
