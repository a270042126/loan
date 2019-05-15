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
  }
}
export default mutations
