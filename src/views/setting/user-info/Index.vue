<template>
  <base-page :navOptions="{ title: '我的信息', isBack: true}">
    <better-scroll>
      <div class="content">
        <div class="avatar">
          <div class="material-icons icon" @click="editUserFace">&#xe438;</div>
          <div style="margin-left: 0.4rem">修改头像</div>
          <input v-if="!app" class="file-input" type="file" accept="image/png,image/gif,image/jpeg" @change="fileUpload($event)"/>
        </div>
        <div>
          <cube-input v-model="user.name" placeholder="请输入用户名" />
          <cube-radio-group v-model="user.sex" :options="sexOptions" />
          <cube-input v-model="user.emailAddress" placeholder="邮箱" />
          <cube-input v-model="user.selfDesc" placeholder="个人介绍" />
        </div>
        <div>
          <button class="simple-btn btn" @click="submitClick">立即提交</button>
        </div>
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
import md5 from 'md5'
import { baseMixin } from '@/mixins'
import { url, isApp } from '@/const'
import { apid, request, common, validate } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  name: 'UserInfo',
  mixins: [baseMixin],
  data () {
    return {
      app: isApp,
      sexOptions: [
        { label: '男', value: '1' },
        { label: '女', value: '0' }
      ],
      user: {
        name: '',
        sex: '1',
        emailAddress: '',
        selfDesc: '',
        profilePictureId: ''
      }
    }
  },
  mounted () {
    console.log('userinfo create')
    this.getUserInfo()
  },
  computed: {
    ...mapGetters([
      'userKeys'
    ])
  },
  methods: {
    sendNotification () {
      this.bus.$emit('mineRefresh')
    },
    getUserInfo () {
      request({
        type: 'post',
        path: url.getUserinfo,
        fn: data => {
          console.log(data.result)
          this.setUserKeyValues(data.result)
        }
      })
    },
    setUserKeyValues (data) {
      this.user = {
        name: data.name,
        sex: data.sex ? '1' : '0',
        emailAddress: data.emailAddress,
        selfDesc: data.selfDesc
      }
    },
    submitClick () {
      if (!this.checkFrom(this.user)) { return }
      const user = this.user
      const params = {
        name: user.name,
        sex: (user.sex === '1' ? 1 : 0),
        emailAddress: user.emailAddress,
        selfDesc: user.selfDesc
      }
      request({
        type: 'post',
        path: url.UpdateUserinfo,
        data: params,
        fn: () => {
          this.successT('修改成功')
        },
        errFn: () => {
        }
      })
    },
    checkFrom (user) {
      if (!user.name) {
        this.errorT('请输入用户名')
        return
      }
      if (user.emailAddress && !validate.email(user.emailAddress)) {
        this.errorT('请输入正确邮箱')
        return false
      }
      return true
    },
    editUserFace () {
      if (!isApp) { return false }
      const that = this
      this.$createActionSheet({
        title: '选择图片',
        active: 0,
        data: [
          {
            content: '从相册选择'
          },
          {
            content: '优雅自拍'
          }
        ],
        onSelect: (item, index) => {
          const type = (index === 0) ? 'album' : 'camera'
          apid.getPicture(type, (ret) => {
            if (ret && ret.base64Data) {
              that.updateface(ret.base64Data)
            }
          })
        }
      }).show()
    },
    fileUpload (event) {
      let file = event.target.files[0]
      this.updateface(file)
    },
    updateface (ret) {
      let params = new FormData()
      params.append('FileType', 'png')
      params.append('FileName', md5('letter', 6))
      params.append('FileToken', common.getFileToken())
      if (isApp) {
        params.append('file', common.dataURItoBlob(ret))
      } else {
        params.append('file', ret)
      }

      request({
        type: 'post',
        path: url.UploadProfilePicture,
        data: params,
        fn: data => {
          this.updateface2(data.result)
        },
        errFn: () => {
        }
      })
    },
    updateface2 (data) {
      const params = {
        FileToken: data.fileToken,
        width: 80,
        height: 80,
        x: 0,
        y: 0
      }
      request({
        type: 'post',
        path: url.UploadProfilePicture2,
        data: params,
        fn: () => {
          this.sendNotification()
          this.successT('保存成功')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.content{
  background: @light_gray;
  padding-top: 30px;
  .avatar{
    position: relative;
    background: white;
    font-size: @font_size_2;
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    padding: 10px 20px;
    .icon {
      font-size: 30px;
    }
    .file-input{
      position: absolute;
      overflow: hidden;
      width: 40px;
      height: 40px;
      .opacity(0);
    }
  }
  .btn{
    margin-top: 30px;
  }
}
</style>
