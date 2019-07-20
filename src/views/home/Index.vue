<template>
  <base-page tabBarIndex="0">
    <better-scroll :data="recommendList" ref="scroll"
                   :pullDownRefresh="true"
                 @pulling-down="onPullingDown">
      <div class="content">
        <home-header/>
        <home-apply />
        <home-ys-product :list="ysList"/>
        <home-recommend :list="recommendList"/>
        <home-footer/>
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
// @ is an alias to /src
import HomeFooter from './components/HomeFooter'
import HomeApply from './components/HomeApply'
import HomeHeader from './components/HomeHeader'
import HomeYsProduct from './components/HomeYsProduct'
import HomeRecommend from './components/HomeRecommend'
import { request, common } from '@/utils'
import { url } from '@/const'
import { baseMixin } from '@/mixins'
export default {
  name: 'home',
  mixins: [ baseMixin ],
  data () {
    return {
      ysList: [],
      recommendList: []
    }
  },
  mounted () {
    this.getYSProducts()
    this.getRecommendProducts()
    const orderId = this.$route.query.orderId
    if (orderId) {
      this.$router.push({
        name: 'detail-order',
        query: {
          id: orderId
        }
      })
    } else if (this.$route.query.from) {
      this.$router.push({
        name: this.$router.query.form
      })
    }
  },
  methods: {
    onPullingDown () {
      this.getYSProducts(true)
      this.getRecommendProducts(true)
    },
    // 取消刷新
    foreceUpdate () {
      this.$refs.scroll.forceUpdate()
    },
    // 优势产品
    getYSProducts () {
      const platform = common.platform()
      let params = {
        platform: {
          hasWeb: platform === 3,
          hasAndroid: platform === 2,
          hasIos: platform === 1
        },
        flag: {
          isRed: false,
          isHot: false,
          isTop: true
        },
        maxResultCount: '10',
        skipCount: 0
      }
      request({
        type: 'post',
        path: url.productsUrl,
        data: params,
        fn: data => {
          this.ysList = data.result.items
        },
        errFn: () => {
          this.foreceUpdate()
        }
      })
    },
    // 热门产品
    getRecommendProducts () {
      const platform = common.platform()
      let params = {
        platform: {
          hasWeb: platform === 3,
          hasAndroid: platform === 2,
          hasIos: platform === 1
        },
        flag: {
          isRed: true
        },
        maxResultCount: '30',
        skipCount: 0
      }
      request({
        type: 'post',
        path: url.productsUrl,
        data: params,
        fn: data => {
          this.recommendList = data.result.items
        },
        errFn: () => {
          this.foreceUpdate()
        }
      })
    }
  },
  components: {
    HomeHeader,
    HomeYsProduct,
    HomeRecommend,
    HomeApply,
    HomeFooter
  }
}
</script>
<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";

</style>
