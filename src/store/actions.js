import * as types from './mutation-types'
import { storage } from 'js/utils'

// 登出
export const logout = ({ commit }) => {
  console.log('logout')
  storage.remove('userKeys')
  commit(types.SET_USER_KEYS, '')
}
export const setToken = ({ commit }, userKeys) => {
  userKeys.loginTime = new Date()
  storage.set('userKeys', userKeys)
  commit(types.SET_USER_KEYS, userKeys)
}
