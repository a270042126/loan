const baseMixin = {
  data () {
    return {
      isLoading: true
    }
  },
  methods: {
    toastT (text) {
      this.toast = this.$createToast({
        txt: text,
        type: 'none'
      }).show()
    },
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
    },
    alertT (text, okCallBack) {
      this.$createDialog({
        type: 'confirm',
        title: '提示',
        content: text,
        confirmBtn: {
          text: '确定',
          active: true,
          disabled: false,
          href: 'javascript:;'
        },
        cancelBtn: {
          text: '取消',
          active: false,
          disabled: false,
          href: 'javascript:;'
        },
        onConfirm: () => {
          if (okCallBack && typeof okCallBack === 'function') {
            okCallBack()
          }
        },
        onCancel: () => {}
      }).show()
    }
  }
}

export default baseMixin
