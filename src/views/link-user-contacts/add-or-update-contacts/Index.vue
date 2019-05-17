<template>
  <base-page :navOptions="{ title: '常见问题', isBack: true}">
    <better-scroll>
      <link-user-title title="第一联系人"/>
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
      <link-user-title title="第二联系人"/>
      <div class="input-group">
        <text-input
          title="与本人关系"
          placeholder="请选择关系"
          readonly="true"
          v-model="form2.relation"
          :pickerData="pickData2" />
        <text-input title="联系人姓名"
                    placeholder="请输入联系人姓名"
                    v-model="form2.name"/>
        <text-input title="手机号码"
                    placeholder="请输入手机号码"
                    v-model="form2.phoneNumber"/>
      </div>
      <div class="sumbit">
        <button class="simple-btn" @click="sumbitClick">立即提交</button>
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
import LinkUserTitle from './components/LinkUserTitle'
import TextInput from '@/components/TextInput'
import { request, FormValidate } from 'js/utils'
import { url } from 'js/const'
import { baseMixin } from 'js/mixins'
export default {
  name: 'LinkUserContacts',
  components: { TextInput, LinkUserTitle },
  mixins: [baseMixin],
  data () {
    return {
      pickData1: [{ text: '父母', value: '父母' }, { text: '兄弟姐妹', value: '兄弟姐妹' }],
      pickData2: [{ text: '朋友', value: '朋友' }, { text: '同事', value: '同事' }],
      form1: {
        contactId: '',
        name: '',
        phoneNumber: '',
        relation: ''
      },
      form2: {
        contactId: '',
        name: '',
        phoneNumber: '',
        relation: ''
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
    sumbitClick () {
      const result = FormValidate.checkForm(this.form1, this.rules)
      const result2 = FormValidate.checkForm(this.form2, this.rules)
      if (result.length > 0) {
        this.errorT(result[0].message)
      } else if (result2.length > 0) {
        this.errorT(result2[0].message)
      } else {
        this.createContacts(this.form1, (data) => {
          if (data.success) {
            this.createContacts(this.form2, (data) => {
              if (data.success) {
                this.successT('提交成功')
              }
              setTimeout(() => {
                this.$router.goBack()
              }, 2000)
            })
          }
        })
      }
    },
    createContacts (form, callBack) {
      this.loadingT()
      request({
        type: 'post',
        data: form,
        path: url.UserVerify.createOrUpdateContact,
        fn: data => {
          callBack(data)
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
.input-group{
  padding: 0 10px;
  background: white;
}
.sumbit{
  padding: 40px 20px;
}
</style>
