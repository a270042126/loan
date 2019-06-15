<template>
  <base-page :navOptions="{ title: '用户认证', isBack: true}">
    <better-scroll>
      <div class="content">
        <template v-for="(item, index) in list">
          <verify-cell :key="index" :item="item" @gotoOther="gotoOther(item)"/>
        </template>
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
import VerifyCell from './components/VerifyCell'
import { request } from '@/utils'
import { url, isApp } from '@/const'
export default {
  name: 'Verify',
  data () {
    return {
      verifyNames: [],
      list: [
        { icon: 'bank', code: 32, title: '银行卡认证', pathName: 'bankCardVerify', status: false, verifyNames: true },
        { icon: 'id-card', code: 4, title: '身份证认证', pathName: 'idCardVerify', status: false, verifyNames: true },
        { icon: 'zhime', code: 64, title: '芝麻分认证', pathName: 'zhimeCredit', status: false, verifyNames: true },
        { icon: 'contact', code: 1, title: '紧急联系人', pathName: 'linkUserContacts', status: false, verifyNames: true },
        { icon: 'Phone', code: 16, title: '手机运营商', xinyan: 'carrier', status: false, verifyNames: true },
        { iconName: '征', code: 8, title: '征信', pathName: 'creditInfo', status: false, verifyNames: true },
        { iconName: '淘', code: 256, title: '淘宝认证', xinyan: 'taobaoweb', status: false, verifyNames: true },
        { iconName: '支', code: 128, title: '支付宝认证', xinyan: 'zhifubao', status: false, verifyNames: true },
        { iconName: '京', code: 16384, title: '京东认证', xinyan: 'jingdong', status: false, verifyNames: true },
        { iconName: '学', code: 32768, title: '学信网认证', xinyan: 'education', status: false, verifyNames: true },
        { iconName: '饿', code: 65536, title: '饿了么认证', xinyan: 'ele', status: false, verifyNames: true },
        { iconName: '美', code: 131072, title: '美团认证', xinyan: 'meituan', status: false, verifyNames: true },
        { iconName: '百', code: 262144, title: '百度云认证', xinyan: 'baiduyun', status: false, verifyNames: true },
        { iconName: 'Q', code: 1048576, title: 'QQ同步助手认证', xinyan: 'qqyun', status: false, verifyNames: true },
        { iconName: '米', code: 2097152, title: '小米云认证', xinyan: 'xiaomiyun', status: false, verifyNames: true },
        { iconName: '信', code: '', title: '信用卡办卡进度查询', xinyan: 'card_progress', status: false, verifyNames: true },
        { iconName: '社', code: 4194304, title: '社保数据认证', xinyan: ' social_insurance', status: false, verifyNames: true },
        { iconName: '公', code: 8388608, title: '公积金数据认证', xinyan: ' housingfund', status: false, verifyNames: true },
        { iconName: '芝', code: 16777216, title: '芝麻信用查验认证', xinyan: 'zhimafen', status: false, verifyNames: true },
        { iconName: '信', code: 33554432, title: '信用卡邮箱账单', xinyan: 'credit_bill_mail', status: false, verifyNames: true },
        { iconName: '车', code: 67108864, title: '车险保单查验认证', xinyan: 'auto_insurance', status: false, verifyNames: true }
      ]
    }
  },
  components: {
    VerifyCell
  },
  mounted () {
    this.getAuthList()
    this.accapceNotification()
  },
  destroyed () {
    this.bus.$off('verifyRefresh')
  },
  methods: {
    accapceNotification () {
      this.bus.$on('verifyRefresh', () => {
        this.getAuthList()
      })
    },
    getAuthList () {
      request({
        type: 'post',
        path: url.UserVerify.GetAuthList,
        fn: (res) => {
          const verifyNames = res.result.verifyNames
          if (res.result.verifyFlag) {
            this.setStatus(verifyNames)
          }
        },
        errFn: () => {
        }
      })
    },
    setStatus (verifyNames) {
      const list = this.list
      list.map((item) => {
        verifyNames.some((name) => {
          if (name === '姓名三要素') {
            list[0].status = true
            return true
          } else if (item.title.indexOf(name) !== -1) {
            item.status = true
            return true
          }
        })
      })
    },
    gotoOther (item) {
      if (item.xinyan) {
        this.gotoXinyanQuanzhi(item.xinyan)
      } else if (item.pathName) {
        this.$router.push({
          name: item.pathName
        })
      }
    },
    gotoXinyanQuanzhi (name) {
      const domainUrl = `http://${document.domain}?form=verify`
      const params = {
        name: name,
        returnUrl: domainUrl
      }
      request({
        type: 'post',
        path: url.Credit.XinyanQuanzhi,
        data: params,
        fn: (res) => {
          const result = res.result
          if (isApp) {
            this.$router.push({
              name: 'browser',
              query: {
                url: result
              }
            })
          } else {
            window.location = result
          }
        },
        errFn: () => {
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
  padding: 20px @space1;
}
</style>
