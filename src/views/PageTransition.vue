<template>
  <div class="page-transition">
    <div class="nav-bar" ref="navBar">
      <div></div>
    </div>
    <transition :enter-active-class="enterTransition"
                :leave-active-class="leaveTransition">
      <navigation>
        <router-view class="child-view"></router-view>
      </navigation>
    </transition>
  </div>
</template>

<script>
import { apid } from 'js/utils'
export default {
  data () {
    return {
      enterTransition: 'animated fadeIn',
      leaveTransition: 'animated fadeOut'
    }
  },
  created () {
    this.setTransition()
  },
  mounted () {
    this.resetNavBarTop()
  },
  methods: {
    setTransition () {
      this.$navigation.on('forward', (to, from) => {
        const meta = to.route.meta
        if (meta.hasOwnProperty('isKeepAlive') && meta.isKeepAlive) {
          this.enterTransition = ''
          this.leaveTransition = ''
        } else {
          this.enterTransition = 'animated fadeInRight'
          this.leaveTransition = 'animated fadeOutLeft'
        }
      })
      this.$navigation.on('back', (to, from) => {
        this.enterTransition = 'animated fadeInLeft'
        this.leaveTransition = 'animated fadeOutRight'
      })
      this.$navigation.on('replace', (to, from) => {
        this.enterTransition = 'animated fadeIn'
        this.leaveTransition = 'animated fadeOut'
      })
    },
    resetNavBarTop () {
      if (this.$refs.navBar) {
        this.$refs.navBar.style.paddingTop = apid.getSafeAreaTop() + 'px'
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
.child-view {
  position: absolute;
  width:100%;
  transition: all .3s cubic-bezier(.55,0,.1,1);
}
</style>
