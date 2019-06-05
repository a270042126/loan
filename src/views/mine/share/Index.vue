<template>
  <base-page :navOptions="{ title: '邀请好友', isBack: true}">
    <div class="content" ref="content" :style="shareUrl ? 'background: none' : ''">
      <div v-if="!shareUrl" class="launch">
        <img :src="getFaceImg" class="face">
        <img class="share" :src="getShareUrl" v-loadimg="loadImgChange"/>
      </div>
      <img v-else :src="shareUrl" style="width: 100%">
    </div>
  </base-page>
</template>

<script>
import { baseMixin } from '@/mixins'
import { isApp, url } from '@/const'
import { apid } from '@/utils'
import { mapGetters } from 'vuex'
import html2canvas from 'html2canvas'
export default {
  name: 'Share',
  mixins: [baseMixin],
  data () {
    return {
      shareUrl: '',
      isApp: isApp
    }
  },
  computed: {
    getShareUrl () {
      return `${this.baseUrl}/Affiliate/Page?refereeId=${this.userKeys.refereeId}&type=index`
    },
    getFaceImg () {
      if (this.userKeys && this.userKeys.userId) {
        return this.baseUrl + url.GetProfilePicture + '/' + this.userKeys.userId
      } else {
        return require('@/assets/images/error-userface.png')
      }
    },
    ...mapGetters([
      'userKeys',
      'baseUrl'
    ])
  },
  methods: {
    loadImgChange () {
      setTimeout(() => {
        html2canvas(this.$refs.content, { useCORS: true }).then(canvas => {
          this.shareUrl = canvas.toDataURL()
        })
      }, 300)
    },
    saveClick () {
      apid.savePicture(this.getShareUrl)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.container{
  background: white;
}
.content{
  width: 100%;
  height: 100%;
  background: url("../../../assets/images/launch.png") center center no-repeat;
  background-size: auto 100%;
  & > div {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    .face{
      width: 80px;
      height: 80px;
      border-radius: 40px;
      overflow: hidden;
      margin: 20px;
    }
    .share{
      margin: 20px;
      width: 90px;
      height: 90px;
    }
  }
}
</style>
