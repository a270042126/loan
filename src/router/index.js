import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import store from '../store'
import storage from '../assets/js/utils/storage'

Router.prototype.goBack = function () {
  this.isBack = true
  window.history.back()
}

Vue.use(Router)

let userKeys = storage.get('userKeys')
if (userKeys) {
  store.commit('SET_USER_KEYS', userKeys)
}

const newRouter = new Router({
  base: process.env.BASE_URL,
  routes
})
export default newRouter
