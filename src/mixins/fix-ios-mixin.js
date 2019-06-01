const fixIosMixin = {
  mounted () {
    document.body.addEventListener('touchmove', this.bodyScroll, { passive: false })
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
