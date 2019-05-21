<template>
  <base-page :navOptions="{ title: '芝麻分认证', isBack: true}">
    <better-scroll>
      <div class="input-div">
        <text-input title="芝麻分" v-model="form.zhimaValue" placeholder="请输入芝麻分">
          <a class="help" @click.stop="openZhimaHelp">芝麻分认证帮助</a>
        </text-input>
        <div class="photo">
          <p style="margin-left: 15px">请上传你的芝麻分照片</p>
          <div>
            <svg-icon v-if="!form.zhimaImage" iconClass="upload"/>
            <img v-else :src="getZhimaImageUrl">
            <upload-image @uploadCallBack="uploadCallBack"/>
          </div>
        </div>
      </div>
      <div class="sumbit-div">
        <button class="simple-btn" @click="sumbitClick">立即提交</button>
      </div>
    </better-scroll>
    <r-dialog ref="zhimaDialog">
      <div class="zhima-dialog">
        <p>
          1. 登陆支付宝，进入个人中心；<br>
          2. 进入 芝麻信用 界面，获取个人芝麻分数；
        </p>
      </div>
    </r-dialog>
  </base-page>
</template>

<script>
import { baseMixin } from 'js/mixins'
import TextInput from '@/components/TextInput'
import UploadImage from '../../components/UploadImage'
import { url } from 'js/const'
import { request } from 'js/utils'
export default {
  name: 'ZhimeCredit',
  components: { UploadImage, TextInput },
  mixins: [baseMixin],
  data () {
    return {
      form: {
        zhimaValue: '',
        zhimaImage: ''
      }
    }
  },
  computed: {
    getZhimaImageUrl () {
      const id = this.form.zhimaImage
      return `${url.baseUrl}/File/Download?id=${id}`
    }
  },
  methods: {
    sumbitClick () {
      this.loadingT()
      request({
        type: 'post',
        data: this.form,
        path: url.UserVerify.AuthZhiMa,
        fn: data => {
          if (data.success) {
            this.successT('提交成功')
          }
          setTimeout(() => {
            this.$router.goBack()
          }, 2000)
        },
        errFn: () => {
          this.hideT()
        }
      })
    },
    uploadCallBack (result) {
      this.form.zhimaImage = result[0]
    },
    openZhimaHelp () {
      this.$refs.zhimaDialog.open()
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
.input-div{
  background: white;
}
.help{
  width: 120px;
  font-size: @font_size_3;
  margin-left: 10px;
  color: #1f88fe;
}
.zhima-dialog{
  font-size: @font_size_3;
  line-height: 24px;
}
.photo{
  padding: 20px 0;
  & > div{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    color: @light_gray2;
    font-size: 200px;
    width: 200px;
    height: 180px;
    overflow: hidden;
    margin: 20px auto;
    input{
      position: absolute;
      background: red;
      opacity: 0;
    }
  }
}
  .sumbit-div{
    padding: 40px 20px;
  }
</style>
