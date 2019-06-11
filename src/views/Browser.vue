<template>
  <base-page
    :navOptions="{ title: '网页浏览',isBack: true, setBackClick: true }"
    @navBackClick="backClick"
    @eventGetHeight="getNavBarHeight">
  </base-page>
</template>

<script>
import { apid } from '@/utils'
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
      apid.closeBrowser(() => {
        this.$router.goBack()
      })
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
