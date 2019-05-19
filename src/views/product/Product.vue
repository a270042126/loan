<template>
  <base-page :navOptions="navOptions">
    <div slot="navRightItem">
      <i class="mdui-icon material-icons" v-if="!isProductFavorite" @click="favoriteClick">favorite_border</i>
      <i class="mdui-icon material-icons" v-else @click="cancelFavoriteClick">favorite</i>
    </div>
    <div class="loading" v-if="isLoading">
      <loading />
    </div>
    <better-scroll v-else :bounce="false">
      <product-list :info="info"/>
      <div class="sumbit">
        <cube-button :light="true" @click="gotoApply">立即申请</cube-button>
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
import ProductList from './components/ProductInfo'
import { request } from 'js/utils'
import { url, isApp } from 'js/const'
import { baseMixin } from 'js/mixins'
import { mapGetters } from 'vuex'
export default {
  name: 'Product',
  mixins: [baseMixin],
  data () {
    return {
      navOptions: {
        title: '',
        rightItem: true,
        isBack: true,
        isShadow: true
      },
      isProductFavorite: false,
      info: {
        product: {
          logo: '',
          quota: '',
          term: '',
          rate: ''
        }
      }
    }
  },
  mounted () {
    console.log('product mounted')
    this.getProductInfo()
  },
  destroyed () {
    console.log('destroyed')
  },
  computed: {
    ...mapGetters([
      'userKeys'
    ])
  },
  methods: {
    cancelFavoriteClick () {
      if (!this.info.product.id) {
        this.errorT('请重新加载')
        return
      }
      request({
        type: 'post',
        path: url.CancelProductFavorite,
        data: { id: this.info.product.id },
        fn: () => {
          this.isProductFavorite = false
          this.successT('取消收藏成功')
        }
      })
    },
    favoriteClick () {
      if (!this.info.product.id) {
        this.errorT('请重新加载')
        return
      }
      request({
        type: 'post',
        path: url.AddProductFavorite,
        data: { id: this.info.product.id },
        fn: () => {
          this.isProductFavorite = true
          this.successT('收藏成功')
        }
      })
    },
    getIsProductFavorite (id) {
      const userKeys = this.userKeys
      if (userKeys && userKeys.hasOwnProperty('userId')) {
        request({
          type: 'post',
          path: url.IsProductFavorite,
          data: { id: id },
          fn: data => {
            this.isProductFavorite = data.result
          }
        })
      }
    },
    getProductInfo () {
      this.isLoading = true
      let params = this.$route.query
      request({
        type: 'post',
        path: url.GetProduct,
        data: { id: params.id },
        fn: data => {
          this.isLoading = false
          this.info = data.result
          this.getIsProductFavorite(this.info.product.id)
        },
        errFn: () => {
          this.isLoading = false
        }
      })
    },
    gotoApply () {
      const userKeys = this.userKeys
      if (userKeys && userKeys.hasOwnProperty('userId')) {
        if (isApp) {
          this.$router.push({
            name: 'browser',
            query: {
              url: this.info.product.referralLink
            }
          })
        } else {
          window.location.href = this.info.product.referralLink
        }
      } else {
        this.$router.push({
          name: 'login'
        })
      }
    }
  },
  components: {
    ProductList
  }
}
</script>
<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.container{
  background: white;
  .sumbit{
    margin: 10px 6px 20px 6px;
    border-top: 1px solid @light_gray;
    button{
      color: black;
      height: 40px;
      line-height: 1px;
      width: 100%;
      background: @theme_primary;
    }
  }
}
</style>
