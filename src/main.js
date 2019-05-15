import Vue from 'vue'
import './cube-ui'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import VueLazyload from 'vue-lazyload'
// 通过components下的index.js文件导入组件
import components from './components'
import { isApp } from 'js/const/'
import { event, apid, push } from 'js/utils/'
import 'amfe-flexible'
import Navigation from './components/navigation'
// 页面App导航
Vue.use(Navigation, { router, store })
// fastclick 坑点 点击高亮不起作用
// import fastclick from 'fastclick'
// fastclick.attach(document.body)
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
