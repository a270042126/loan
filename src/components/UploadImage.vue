<template>
  <input ref="fileupload" type="file" accept="image/*" @change="handleImageSuccess">
</template>

<script>
import { baseMixin } from '@/mixins'
import { request } from '@/utils'
import { url } from '@/const'
export default {
  name: 'UploadImage',
  mixins: [baseMixin],
  methods: {
    handleImageSuccess (e) {
      const files = e.target.files
      const rawFile = files[0]
      if (!rawFile && !this.beforeAvatarUpload(rawFile)) return
      this.$refs['fileupload'].value = null

      const params = new FormData()
      params.append('file', rawFile)

      this.loadingT()
      request({
        type: 'post',
        path: url.upload,
        data: params,
        fn: data => {
          this.$emit('uploadCallBack', data.result)
        },
        errFn: () => {
        }
      })
    },

    beforeAvatarUpload (file) {
      const isJPG = /\/(?:jpeg|png|gif)/i.test(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.errorT('只能上传图片')
      }
      if (!isLt2M) {
        this.errorT('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style scoped>

</style>
