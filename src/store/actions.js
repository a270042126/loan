import * as types from './mutation-types'
import { storage } from '@/utils'

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
export const setIsLoading = ({ commit }, isLoading) => {
  commit(types.SET_IS_LOADING, isLoading)
}

export const setBaseUrl = ({ commit }, baseUrl) => {
  commit(types.SET_BASE_URL, baseUrl)
}
