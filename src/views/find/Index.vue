<template>
  <base-page :tabBarIndex="navOptions.isBack ? '-1' : '1'" :navOptions="navOptions">
    <find-filter-tab v-if="!navOptions.isBack" ref="filter" @filter="filterClick" @filter2="filter2Click"/>
    <better-scroll :data="list" ref="scroll"
                 :pullUpLoad="true"
                 :pullDownRefresh="true"
                 @pulling-down="onPullingDown"
                 @pulling-up="onPullingUp">
      <div class="content">
        <product-list :list="list"/>
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
import { request, common } from '@/utils'
import { url } from '@/const'
import { mapGetters, mapMutations } from 'vuex'
import { baseMixin } from '@/mixins'

const MAXCOUNT = 20
let filterParams = {
  skipCount: 0
}
export default {
  name: 'Find',
  mixins: [baseMixin],
  data () {
    return {
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
      for (let index in filterParams) {
        delete filterParams[index]
      }
      filterParams.filter = key
      filterParams.skipCount = 0
      this.getFindProducts(filterParams)
    },

    filterClick (key, value) {
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
          hasWeb: type === 3,
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
          let items = data.result.items
          if (newParams.skipCount === 0) {
            this.list = items
          } else {
            this.list = this.list.concat(items)
          }
          const totalCount = data.result.totalCount
          if (this.list.length >= totalCount) {
            this.$refs.scroll.closePullUp()
          } else {
            this.$refs.scroll.openPullUp()
          }
        },
        errFn: () => {
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
