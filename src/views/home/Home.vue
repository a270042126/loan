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
import { request, common, storage } from 'js/utils'
import { url } from 'js/const'
import { baseMixin } from 'js/mixins'
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
    getYSProducts (refresh = false) {
      const list = storage.get('ys-products')
      if (list && !refresh) {
        this.ysList = list
      } else {
        const platform = common.platform()
        let params = {
          platform: {
            hasWeb: false,
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
            storage.sessionSet('ys-products', this.ysList)
          },
          errFn: () => {
            this.foreceUpdate()
          }
        })
      }
    },
    // 热门产品
    getRecommendProducts (refresh = false) {
      const list = storage.get('recommend-products')
      if (list && !refresh) {
        this.recommendList = list
      } else {
        const platform = common.platform()
        let params = {
          platform: {
            hasWeb: false,
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
            storage.sessionSet('recommend-products', this.recommendList)
          },
          errFn: () => {
            this.foreceUpdate()
          }
        })
      }
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
