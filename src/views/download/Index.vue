<template>
  <base-page>
    <better-scroll>
      <div>
        <img src="@/assets/images/bg-login.png">
      </div>
      <div class="content">
        <button @click="downloadClick"
                v-stat="{category:'按钮点击事件', action:'下载', name: 'app下载'}"
        >app下载</button>
        <div @click="gotoH5Click"
             v-stat="{category:'按钮点击事件', action:'下载', name: '直接h5操作'}"
        >
          <a>直接H5操作</a>
        </div>
        <div class="title-div">
          <h2>{{getTitle}}· 您的首选贷款平台 </h2>
          <p>简单 快捷 安全</p>
        </div>
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
import { request } from '@/utils'
import { url } from '@/const'
import { mapGetters } from 'vuex'
import { baseMixin } from '@/mixins'
export default {
  name: 'Index',
  mixins: [baseMixin],
  data () {
    return {
      downloadUrl: ''
    }
  },
  computed: {
    getTitle () {
      return document.title
    },
    ...mapGetters(['projectName'])
  },
  mounted () {
    if (this.projectName) {
      this.getDownloadUrl()
    }
  },
  watch: {
    projectName () {
      this.getDownloadUrl()
    }
  },
  methods: {
    downloadClick () {
      if (!this.downloadUrl) {
        this.errorT('请重新刷新页面')
      } else {
        window.location.href = this.downloadUrl
      }
    },
    getDownloadUrl () {
      request({
        type: 'post',
        path: url.Project.IsProjectAvailable,
        data: { projectName: this.projectName },
        fn: data => {
          this.downloadUrl = data.result.downloadUrl
          console.log(data)
        }
      })
    },
    gotoH5Click () {
      this.$router.replace({ name: 'home' })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
.container{
  background: @login_bg;
  img{
    width: 100%;
  }
  .content{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 40px;
    button{
      background: @login_button_bg;
      font-size: @font_size_6;
      padding: 10px 20px;
      width: 80%;
      border-radius: 6px;
      margin-bottom: 20px;
      color: white;
    }
    a{
      font-size: @font_size_4;
      color: white;
    }
    .title-div{
      text-align: center;
      padding-top: 20px;
      color: white;
      h2{
        font-size: @font_size_4;
      }
      p{
        padding-top: 10px;
        font-size: @font_size_2;
        color: @light_gray;
      }
    }
  }
}
</style>
