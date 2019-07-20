import * as types from './mutation-types'
import { storage, request, common } from '@/utils'
import { url } from '@/const'
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

export const isProjectAvailable = ({ commit, state }, projectName) => {
  const domainUrl = `https://p-${projectName}.jxstudio.cn`
  commit(types.SET_BASE_URL, domainUrl)
  if (!state.firstLoad) {
    request({
      type: 'post',
      path: url.Project.IsProjectAvailable,
      data: { projectName: projectName },
      fn: data => {
        document.title = data.result.projectName
        const state = data.result.state
        if (state === 1) {
          commit(types.SET_FIRST_LOAD, true)
          commit(types.SET_PROJECT_NAME, projectName)
          commit(types.SET_BASE_URL, data.result.projectRootAddress)
        } else if (state === 2) {
          common.errorT('项目未激活')
        } else {
          common.errorT('项目不存在')
        }
      },
      errFn: () => {
      }
    })
  }
}
