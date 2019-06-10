import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import store from '@/store'
import storage from '@/utils/storage'
import { common } from '@/utils'

Router.prototype.goBack = function () {
  this.isBack = true
  window.history.back()
}

Vue.use(Router)

const userKeys = storage.get('userKeys')
if (userKeys) {
  store.commit('SET_USER_KEYS', userKeys)
}

const newRouter = new Router({
  // mode: 'history',
  routes
})

newRouter.beforeEach((to, from, next) => {
  const baseUrl = store.getters.baseUrl
  if (!baseUrl) {
    const domain = document.domain
    const projectName = domain.substring(0, domain.indexOf('.m.')) || 'huohuodai'
    if (projectName) {
      const domainUrl = `https://p-${projectName}.jxstudio.cn`
      store.dispatch('setBaseUrl', domainUrl)
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
