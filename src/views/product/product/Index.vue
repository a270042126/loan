<template>
  <base-page :navOptions="navOptions">
    <div slot="navRightItem">
      <i class="mdui-icon material-icons" v-if="!isProductFavorite" @click="favoriteClick"
         v-stat="{category:'按钮点击事件', action:'产品', name: '收藏'+info.product.name}">favorite_border</i>
      <i class="mdui-icon material-icons" v-else @click="cancelFavoriteClick"
         v-stat="{category:'按钮点击事件', action:'产品', name: '取消收藏'+info.product.name}">favorite</i>
    </div>
    <better-scroll :bounce="false" :data="info">
      <product-info :info="info"/>
      <div class="sumbit">
        <cube-button :light="true" @click="gotoApply"
                     v-stat="{category:'按钮点击事件', action:'产品', name: '立即申请'+info.product.name}"
        >立即申请</cube-button>
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
import ProductInfo from './components/ProductInfo'
import { request } from '@/utils'
import { url, isApp } from '@/const'
import { baseMixin } from '@/mixins'
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
    this.getProductInfo()
  },
  computed: {
    ...mapGetters([
      'userKeys'
    ])
  },
  methods: {
    // 跨页刷新
    sendNotification () {
      this.bus.$emit('favoriteRefresh')
    },
    cancelFavoriteClick () {
      if (!this.info.product.id) {
        this.errorT('请重新加载')
        return
      }
      request({
        type: 'post',
        path: url.Favorite.CancelProductFavorite,
        data: { id: this.info.product.id },
        fn: () => {
          this.isProductFavorite = false
          this.successT('取消收藏成功')
          this.sendNotification()
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
        path: url.Favorite.AddProductFavorite,
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
          path: url.Favorite.IsProductFavorite,
          data: { id: id },
          fn: data => {
            this.isProductFavorite = data.result
          }
        })
      }
    },
    getProductInfo () {
      let params = this.$route.query
      request({
        type: 'post',
        path: url.GetProduct,
        data: { id: params.id },
        fn: data => {
          this.info = data.result
          this.getIsProductFavorite(this.info.product.id)
        },
        errFn: () => {
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
    ProductInfo
  }
}
</script>
<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.container{
  background: white;
  .sumbit{
    padding: 10px 6px 40px 6px;
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
