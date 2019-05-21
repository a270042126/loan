<template>
  <base-page :navOptions="{ title: this.form1.id ? '修改联系人' : '添加联系人', isBack: true}">
    <div slot="navRightItem" class="nav-bar-right-item" @click="saveClick">
      <svg-icon iconClass="save" />
    </div>
    <better-scroll>
      <div class="input-group">
        <text-input
          title="与本人关系"
          placeholder="请选择关系"
          readonly="true"
          v-model="form1.relation"
          :pickerData="pickData1" />
        <text-input title="联系人姓名"
                    placeholder="请输入联系人姓名"
                    v-model="form1.name"/>
        <text-input title="手机号码"
                    placeholder="请输入手机号码"
                    v-model="form1.phoneNumber"/>
      </div>
      <div class="sumbit">
        <button class="simple-btn delete-btn" @click="deleteClick">删除</button>
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
import TextInput from '@/components/TextInput'
import { request, FormValidate } from 'js/utils'
import { url } from 'js/const'
import { baseMixin } from 'js/mixins'
export default {
  name: 'LinkUserContacts',
  components: { TextInput },
  mixins: [baseMixin],
  data () {
    return {
      pickData1: [
        { text: '父母', value: '父母' },
        { text: '兄弟姐妹', value: '兄弟姐妹' },
        { text: '朋友', value: '朋友' },
        { text: '同事', value: '同事' }],
      form1: {
        id: this.$route.query.id,
        name: this.$route.query.name,
        phoneNumber: this.$route.query.phoneNumber,
        relation: this.$route.query.relation
      },
      rules: {
        name: [
          { require: true, message: '姓名不能为空' }
        ],
        phoneNumber: [
          { require: true, message: '电话号码不能为空' }
        ],
        relation: [
          { require: true, message: '关系不能为空' }
        ]
      }
    }
  },
  methods: {
    deleteClick () {
      this.alertT('你确定要删除？', () => {
        this.loadingT()
        request({
          type: 'post',
          data: { id: this.form1.id },
          path: url.UserVerify.DeleteContact,
          fn: data => {
            if (data.success) {
              if (data.success) {
                this.successT('删除成功')
              }
              this.sendNotification()
              this.$router.goBack()
            }
          },
          errFn: () => {
            this.hideT()
          }
        })
      })
    },
    // 跨页刷新
    sendNotification () {
      this.bus.$emit('linkUserContactsRefresh')
    },
    saveClick () {
      const result = FormValidate.checkForm(this.form1, this.rules)
      if (result.length > 0) {
        this.errorT(result[0].message)
      } else {
        this.loadingT()
        request({
          type: 'post',
          data: this.form1,
          path: url.UserVerify.createOrUpdateContact,
          fn: data => {
            if (data.success) {
              if (data.success) {
                this.successT('提交成功')
              }
              this.sendNotification()
              this.$router.goBack()
            }
          },
          errFn: () => {
            this.hideT()
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
.input-group{
  margin-top: 40px;
  background: white;
}
.sumbit{
  padding: 40px 20px;
  .delete-btn{
    background: @light_gray2;
  }
}
</style>
