<template>
  <base-page :navOptions="{ isBack: true, title: '我的收藏'}">
    <better-scroll ref="scroll"
                   :data="productList"
                   :pullUpLoad="false"
                   :pullDownRefresh="true"
                   @pulling-down="onPullingDown"
                   @pulling-up="onPullingUp">
      <product-list :list="productList"/>
    </better-scroll>
  </base-page>
</template>

<script>
import { request } from '@/utils'
import { url } from '@/const'
import ProductList from '@/components/product-list/ProductList'
const MAXCOUNT = 25
export default {
  name: 'Faviorite',
  components: { ProductList },
  data () {
    return {
      isShowMore: false,
      productList: [],
      skipCount: 0
    }
  },
  mounted () {
    this.onPullingDown()
  },
  methods: {
    onPullingDown () {
      this.getProductFavorites()
    },
    onPullingUp () {
      this.skipCount += MAXCOUNT
      this.getProductFavorites()
    },
    // 取消刷新
    foreceUpdate () {
      this.$refs.scroll.forceUpdate()
    },
    getProductFavorites () {
      const params = {
        maxResultCount: MAXCOUNT,
        skipCount: 0
      }
      request({
        type: 'post',
        path: url.GetProductFavorites,
        data: params,
        fn: data => {
          let items = data.result.items
          this.productList = items
          // this.isShowMore = this.productList.length < data.result.totalCount
        },
        errFn: () => {
          this.foreceUpdate()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
