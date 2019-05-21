<template>
  <div id='app'>
    <template v-if="isWelcome">
      <welcome />
    </template>
    <template v-else>
      <router-view/>
    </template>
    <div class="bg-cover loading-bg" v-if="isLoading">
      <loading class="my-loading"/>
    </div>
  </div>
</template>
<script>
import { storage, apid } from 'assets/js/utils'
import { isApp } from 'js/const'
import { mapMutations, mapGetters, mapActions } from 'vuex'
import Welcome from '@/views/Welcome'
export default {
  data: () => ({}),
  created () {
    this.setWelcome()
  },
  computed: {
    ...mapGetters([
      'isWelcome',
      'userKeys',
      'isLoading'
    ])
  },
  methods: {
    // 设置欢迎页
    setWelcome () {
      if (!isApp) {
        return false
      }
      const oldVersion = storage.get('appVersion')
      const appVersion = apid.getAppVersion()
      if (!oldVersion || oldVersion !== appVersion) {
        this.setIsWelcome(true)
        storage.set('appVersion', appVersion)
      } else {
        this.setIsWelcome(false)
      }
    },
    ...mapMutations({
      setIsWelcome: 'SET_IS_WELCOME'
    }),
    ...mapActions([
      'setToken'
    ])
  },
  components: {
    Welcome
  }
}
</script>
<style lang='less'>
@import 'assets/less/index';
#app{
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.loading-bg{
  background-color: rgba(255,255,255,.1) !important;
}
</style>
