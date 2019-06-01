const windowHeight = window.innerHeight
const fixedInput = (el, binding) => {
  el.addEventListener('blur', function () {
    let windowFocusHeight = window.innerHeight
    if (windowHeight === windowFocusHeight) {
      return
    }
    console.log(windowHeight + '--' + windowFocusHeight);
    console.log('修复');
    let currentPosition;
    let speed = 1; // 页面滚动距离
    currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
    currentPosition -= speed;
    window.scrollTo(0, currentPosition); //页面向上滚动
    currentPosition += speed; //speed变量
    window.scrollTo(0, currentPosition); //页面向下滚动
  })
}
const install = (Vue) => {
  Vue.directive('fixedInput', fixedInput)
}
fixedInput.install = install
export default fixedInput
