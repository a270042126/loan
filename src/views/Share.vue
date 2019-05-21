<template>
  <base-page :navOptions="{ title: '邀请好友', isBack: true}">
    <div class="content">
      <img class="image" src="../assets/images/launch.png">
      <div>
        <button class="share-btn" @click="shareClick">立即分享</button>
      </div>
    </div>
    <r-dialog ref="shareDialog">
      <p class="tag-read">{{shareUrl}}</p>
      <cube-button class="copy-btn" @click="copyClick">复制链接</cube-button>
    </r-dialog>
  </base-page>
</template>

<script>
import { baseMixin } from 'js/mixins'
import { url, isApp } from 'js/const'
import { apid } from 'js/utils'
import { mapGetters } from 'vuex'
import Clipboard from 'clipboard'
export default {
  name: 'Share',
  mixins: [baseMixin],
  data () {
    return {
      shareUrl: ''
    }
  },
  computed: {
    ...mapGetters([
      'userKeys'
    ])
  },
  methods: {
    copyClick () {
      const shareUrl = this.shareUrl
      let clipboard = new Clipboard('.copy-btn', { text: () => shareUrl })
      clipboard.on('success', e => {
        this.successT('复制成功')
        this.$refs.shareDialog.close()
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.errorT('复制出错，请手动复制')
        // 释放内存
        clipboard.destroy()
      })
    },
    shareClick () {
      const shareUrl = 'https://m.jxstudio.cn/?RefereeId=' + this.userKeys.refereeId
      this.shareUrl = shareUrl
      if (this.userKeys.hasOwnProperty('refereeId')) {
        if (isApp) {
          apid.systemShare(shareUrl)
        } else {
          this.$refs.shareDialog.open()
        }
      } else {
        this.errorT('请登录')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.content{
  background: white;
  position: relative;
  height: 100%;
  & > div:last-child{
    position: absolute;
    bottom: 20%;
    left: 0;
    right: 0;
    z-index: 99;
    text-align: center;
    .share-btn{
      color: white;
      font-size: @font_size_2;
      background: @theme_primary;
      width: 140px;
      height: 40px;
      line-height: 40px;
      border-radius: 20px;
      .shadow(1px, 1px, 2px, @light_gray3);
    }
  }
  p{
    font-size: @font_size_3;
    word-wrap:break-word;
    line-height: 20px;
  }
  .copy-btn{
    padding: 0;
    height: 40px;
    margin-top: 20px;
  }
}
</style>
