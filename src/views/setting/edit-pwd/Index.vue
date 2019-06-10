<template>
  <base-page :navOptions="navOptions">
    <div>
      <cube-input v-model="user.currentPassword" placeholder="请输入旧密码" type="password" eye="reverse"></cube-input>
      <cube-input v-model="user.newPassword" placeholder="请输入新密码" type="password" eye="reverse"></cube-input>
      <cube-input v-model="user.rePassword" placeholder="确认新密码" type="password" eye="reverse"></cube-input>
      <cube-button class="submit" @click="submitClick">提交</cube-button>
    </div>
  </base-page>
</template>

<script>
import { baseMixin } from '@/mixins'
import { validate, request } from '@/utils'
import { url } from '@/const'
export default {
  name: 'EditPwd',
  mixins: [baseMixin],
  data () {
    return {
      navOptions: {
        title: '修改密码',
        isBack: true
      },
      user: {
        currentPassword: '',
        newPassword: '',
        rePassword: ''
      }
    }
  },
  methods: {
    submitClick () {
      const user = this.user
      if (!user.currentPassword) {
        this.errorT('请输入旧密码')
      } else if (user.newPassword !== user.rePassword) {
        this.errorT('两次设置的新密码不一致')
      } else {
        request({
          type: 'post',
          path: url.ChangePassword,
          data: user,
          fn: () => {
            this.successT('修改成功')
          },
          errFn: () => {
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
.submit{
  margin-top: 40px;
  background: @theme_primary;
  height: 40px;
  padding: 0;
  line-height: 1;
}
</style>
