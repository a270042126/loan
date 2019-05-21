import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import store from '@/store'
import storage from 'js/utils/storage'

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
  mode: 'history',
  routes
})

newRouter.beforeEach((to, from, next) => {
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
