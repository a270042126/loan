<template>
  <base-page :navOptions="{ title: '网页浏览',isBack: true }" @navBackClick="backClick" @eventGetHeight="getNavBarHeight">
  </base-page>
</template>

<script>
import { apid } from 'js/utils'
export default {
  name: 'Browser',
  mounted () {
    const that = this
    apid.setListenKeyBack(() => {
      that.$router.goBack()
    })
  },
  methods: {
    backClick () {
      apid.closeBrowser()
    },
    getNavBarHeight (height) {
      let url = this.$route.query.url
      const that = this
      apid.openBrowser(url, height, (title) => {
        that.navOptions.title = title
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
