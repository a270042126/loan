import * as types from './mutation-types'
const mutations = {
  [types.SET_IS_WELCOME] (state, isWelcome) {
    state.isWelcome = isWelcome
  },
  [types.SET_USER_KEYS] (state, userKeys) {
    state.userKeys = userKeys
  },
  [types.SET_FILTER_PARAMS] (state, filterParams) {
    state.filterParams = filterParams
  },
  [types.SET_IS_LOADING] (state, isLoading) {
    state.isLoading = isLoading
  },
  [types.SET_BASE_URL] (state, baseUrl) {
    state.baseUrl = baseUrl
  }
}
export default mutations
