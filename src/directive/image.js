const loadimg = (el, binding, vnode) => {
  // el就是img
  let src = el.src
  let newImg = new Image()
  newImg.src = src
  newImg.onload = () => {
    // doSomething
    const callBack = binding.value
    if (callBack && typeof callBack === 'function') {
      callBack()
    }
  }
}
const install = (Vue) => {
  Vue.directive('loadimg', loadimg)
}
loadimg.install = install
export default loadimg
