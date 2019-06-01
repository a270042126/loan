const fixIosMixin = {
  data () {
    return {
      screenHeight: ''
    }
  },
  mounted () {
    document.body.addEventListener('touchmove', this.bodyScroll, { passive: false })
  },
  updated () {
    let that = this
    this.$nextTick(function () {
      const textareas = Array.from(document.getElementsByTagName('textarea'))
      const inputs = Array.from(document.getElementsByTagName('input'))
      inputs.forEach(item => {
        item.onblur = function () { // onblur是核心方法
          window.scroll(0, 0)
          window.innerHeight = window.outerHeight = that.screenHeight
        }
      })
      textareas.forEach(item => {
        item.onblur = function () { // onblur是核心方法
          window.scroll(0, 0)
          window.innerHeight = window.outerHeight = that.screenHeight
        }
      })
    })
  },
  destroyed () {
    document.body.removeEventListener('touchmove', this.bodyScroll, { passive: false })
  },
  methods: {
    bodyScroll (event) {
      event.preventDefault()
    }
  }
}
export default fixIosMixin
