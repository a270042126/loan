import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import store from '@/store'
import storage from '@/utils/storage'
import { common } from '@/utils'
import { isApp } from '@/const'

Router.prototype.goBack = function () {
  this.isBack = true
  window.history.back()
}

Vue.use(Router)

let routeT = {
  routes
}
if (!isApp) {
  routeT.mode = 'history'
}
const newRouter = new Router(routeT)

newRouter.beforeEach((to, from, next) => {
  const baseUrl = store.getters.baseUrl
  if (!baseUrl) {
    const domain = document.domain
    const projectName = domain.substring(0, domain.indexOf('.m.')) || 'huohuodai'
    if (projectName) {
      store.dispatch('isProjectAvailable', projectName)
    } else {
      common.errorT('项目不能为空')
    }
  }

  let refereeId = to.query.RefereeId || to.query.refereeId
  if (refereeId) {
    if (!storage.get('refereeId')) {
      storage.set('refereeId', refereeId)
    }
  }
  store.dispatch('setIsLoading', false)
  next()
})

export default newRouter
