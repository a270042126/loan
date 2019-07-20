import { common } from '@/utils'
const stat = (el, binding, vnode) => {
  el.addEventListener('click', () => {
    const data = binding.value
    console.log(data)
    common.trackEvent(data.category, data.action, data.name, data.value)
  }, false)
}
const install = (Vue) => {
  Vue.directive('stat', stat)
}
stat.install = install
export default stat
