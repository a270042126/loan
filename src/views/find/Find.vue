<template>
  <base-page :tabBarIndex="navOptions.isBack ? '-1' : '1'" :navOptions="navOptions">
    <find-filter-tab v-if="!navOptions.isBack" ref="filter" @filter="filterClick" @filter2="filter2Click"/>
    <better-scroll :data="list" ref="scroll"
                 :pullUpLoad="isShowMore"
                 :pullDownRefresh="true"
                 @pulling-down="onPullingDown"
                 @pulling-up="onPullingUp">
      <div class="content">
        <div class="loading" v-if="isLoading">
          <loading />
        </div>
        <product-list v-else :list="list"/>
        <div v-if="!isLoading && list.length === 0" class="empty">
          <img src="@/assets/images/error-article.png">
        </div>
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
import FindFilterTab from './components/FindFilterTab'
import ProductList from '../../components/product-list/ProductList'
import { request, common } from 'js/utils'
import { url } from 'js/const'
import { mapGetters, mapMutations } from 'vuex'
import { baseMixin } from 'js/mixins'

const MAXCOUNT = 25
let filterParams = {
  skipCount: 0
}
export default {
  name: 'Find',
  mixins: [baseMixin],
  data () {
    return {
      isShowMore: true,
      navOptions: {
        title: '发现',
        isBack: !!this.$route.query.from
      },
      list: []
    }
  },
  mounted () {
    if (!this.$route.query.from) {
      this.setFilterParams('')
    }
    this.filter2Click(this.filterParams)
  },
  computed: {
    ...mapGetters([
      'filterParams'
    ])
  },
  methods: {
    filter2Click (key) {
      this.isLoading = true
      for (let index in filterParams) {
        delete filterParams[index]
      }
      filterParams.filter = key
      filterParams.skipCount = 0
      this.getFindProducts(filterParams)
    },

    filterClick (key, value) {
      this.isLoading = true
      for (let index in filterParams) {
        delete filterParams[index]
      }
      filterParams.skipCount = 0
      filterParams.flag = {
        isRed: false,
        isHot: false,
        isTop: false
      }
      switch (key) {
        case 'all':
          break
        case 'flag':
          filterParams.flag[value] = true
          break
        default:
          filterParams[key] = value
          break
      }
      this.getFindProducts(filterParams)
    },

    // 取消刷新
    foreceUpdate () {
      this.$refs.scroll.forceUpdate()
    },

    onPullingDown () {
      filterParams.skipCount = 0
      this.getFindProducts(filterParams)
    },

    onPullingUp () {
      filterParams.skipCount += MAXCOUNT
      this.getFindProducts(filterParams)
    },
    getFindProducts (params) {
      const type = common.platform()
      let platform = {
        maxResultCount: MAXCOUNT,
        platform: {
          hasWeb: false,
          hasAndroid: type === 2,
          hasIos: type === 1
        }
      }
      let newParams = Object.assign(params, platform)
      request({
        type: 'post',
        path: url.productsUrl,
        data: newParams,
        fn: data => {
          this.isLoading = false
          let items = data.result.items
          if (newParams.skipCount === 0) {
            this.list = items
          } else {
            this.list = this.list.concat(items)
          }
          this.isShowMore = this.list.length < data.result.totalCount
          console.log(this.isShowMore)
        },
        errFn: () => {
          this.isLoading = false
          if (typeof params.errback === 'function') {
            this.foreceUpdate()
          }
        }
      })
    },
    ...mapMutations({
      setFilterParams: 'SET_FILTER_PARAMS'
    })
  },
  components: {
    FindFilterTab,
    ProductList
  }
}
</script>

<style lang="less" scoped>
.content{
  padding-bottom: 40px;
}
</style>
