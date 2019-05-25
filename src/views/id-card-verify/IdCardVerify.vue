<template>
  <base-page :navOptions="{ title: '设置身份证', isBack: true}">
    <better-scroll>
      <div>
        <h2>拍摄/上传您的身份证</h2>
        <ul class="id-card-photos">
          <li>
            <div>
              <svg-icon v-if="!form.identityCardFront" iconClass="id-card-front"/>
              <img v-else :src="getFrontUrl"/>
            </div>
            <upload-image @uploadCallBack="frontUploadCallBack" />
            <p>身份证正面</p>
          </li>
          <li>
            <div>
              <svg-icon v-if="!form.identityCardBack" iconClass="id-card-reverse"/>
              <img v-else :src="getreverseUrl"/>
            </div>
            <p>身份证背面</p>
            <upload-image @uploadCallBack="reverseUploadCallBack"/>
          </li>
          <!--<li>-->
            <!--<svg-icon iconClass="id-card-take"/>-->
            <!--<p>手持身份证</p>-->
          <!--</li>-->
        </ul>
        <div class="sumbit">
          <button class="simple-btn" @click="sumbitClick">立即提交</button>
        </div>
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
import { baseMixin } from '@/mixins'
import UploadImage from '@/components/UploadImage'
import { url } from '@/const'
import { request } from '@/utils'
export default {
  name: 'IdCardVerify',
  components: { UploadImage },
  mixins: [baseMixin],
  data () {
    return {
      frontUrl: '',
      reverseUrl: '',
      form: {
        identityCardFront: '',
        identityCardBack: ''
      }
    }
  },
  computed: {
    getFrontUrl () {
      const id = this.form.identityCardFront
      return `${url.baseUrl}/File/Download?id=${id}`
    },
    getreverseUrl () {
      const id = this.form.identityCardBack
      return `${url.baseUrl}/File/Download?id=${id}`
    }
  },
  methods: {
    // 跨页刷新
    sendNotification () {
      this.bus.$emit('verifyRefresh')
    },
    frontUploadCallBack (result) {
      this.form.identityCardFront = result[0]
    },
    reverseUploadCallBack (result) {
      this.form.identityCardBack = result[0]
    },
    sumbitClick () {
      this.loadingT()
      request({
        type: 'post',
        data: this.form,
        path: url.UserVerify.AuthIdCard,
        fn: data => {
          if (data.success) {
            this.successT('提交成功')
          }
          this.sendNotification()
          setTimeout(() => {
            this.$router.goBack()
          }, 2000)
        },
        errFn: () => {
          this.hideT()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import "~less/variable";
  h2{
    text-align: center;
    color: @light_gray2;
    font-size: @font_size_4;
    padding: 20px 0 10px 0;
  }
  .id-card-photos{
    li{
      position: relative;
      width: 90%;
      border-radius: 10px;
      background: white;
      margin: 20px auto;
      padding: 10px 0;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      & > div {
        width: 200px;
        height: 150px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
          width: 100%;
        }
        svg{
          color: @theme_primary;
          font-size: 150px;
        }
      }
      p{
        padding-top: 10px;
        font-size: @font_size_3;
      }
      input{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        background: red;
        width: 100%;
        opacity: 0;
      }
    }
  }
  .sumbit{
    padding: 20px 0 40px 0;
  }
</style>
