<template>
  <div class="welcome">
    <cube-slide  :loop="false"  :auto-play="false">
      <cube-slide-item v-for="(item, index) in items" :key="index" @click.native="clickHandler(item, index)">
        <div class="item">
          <img :src="item.image">
        </div>
      </cube-slide-item>
    </cube-slide>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'Splash',
  data () {
    return {
      items: [
        {
          image: require('../assets/images/guide1.png')
        },
        {
          image: require('../assets/images/guide2.png')
        },
        {
          image: require('../assets/images/guide3.png')
        },
        {
          image: require('../assets/images/guide4.png')
        }
      ]
    }
  },
  methods: {
    clickHandler (_, index) {
      if (index === this.items.length - 1) {
        this.setIsWelcome(false)
      }
    },
    ...mapMutations({
      setIsWelcome: 'SET_IS_WELCOME'
    })
  }
}
</script>

<style lang="less" scoped>
.welcome{
  .item{
    width: 100vw;
    height: 100vh;
    position: relative;
    overflow: hidden;
  }
}
img{
  position: absolute;
  max-width: none;
  top: 50%;
  left: 50%;
  height: 100%;
  width: auto;
  transform: translate(-50%, -50%);
}
/*@media screen and (max-width:519px){*/
  /*img{*/
    /*height: 100%;*/
    /*width: auto;*/
  /*}*/
/*}*/
/*@media screen and (min-width:520px){*/
  /*img{*/
    /*height: auto;*/
    /*width: 100%;*/
  /*}*/
/*}*/
</style>
