const baseMixin = {
  data () {
    return {
      isLoading: true
    }
  },
  methods: {
    successT (text) {
      this.toast = this.$createToast({
        txt: text,
        type: 'correct'
      }).show()
    },
    errorT (text) {
      this.toast = this.$createToast({
        txt: text,
        type: 'error'
      }).show()
    },
    loadingT (text = '提交中...') {
      this.toast = this.$createToast({
        time: 0,
        txt: text,
        mask: true
      })
      this.toast.show()
    },
    hideT () {
      this.toast.hide()
    }
  }
}

export default baseMixin
