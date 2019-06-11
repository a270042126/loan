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
        { icon: 'bank', title: '银行卡认证', desc: '银行卡认证可以提高你的额度', pathName: 'bankCardVerify', status: false, verifyNames: true },
        { icon: 'id-card', title: '身份证认证', desc: '身份证认证可以提高你的额度', pathName: 'idCardVerify', status: false, verifyNames: true },
        { icon: 'zhime', title: '芝麻分认证', desc: '芝麻分认证可以提高你的额度', pathName: 'zhimeCredit', status: false, verifyNames: true },
        { icon: 'contact', title: '紧急联系人', desc: '紧急联系人可以提高你的额度', pathName: 'linkUserContacts', status: false, verifyNames: true },
        { icon: 'Phone', title: '手机运营商', desc: '手机运营商可以提高你的额度', pathName: 'phoneVerify', status: false, verifyNames: true },
        { iconName: '征', title: '征信', desc: '征信认证可以提高你的额度', pathName: 'creditInfo', status: false, verifyNames: true },
        { icon: 'Phone', title: '淘宝认证', desc: '淘宝认证可以提高你的额度', pathName: 'creditInfo', status: false, verifyNames: true },
        { icon: 'Phone', title: '支付宝认证', desc: '支付宝认证可以提高你的额度', pathName: 'creditInfo', status: false, verifyNames: true }
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
          this.setStatus(verifyNames)
        },
        errFn: () => {
        }
      })
    },
    setStatus (verifyNames) {
      const list = this.list
      verifyNames.some((name) => {
        switch (name) {
          case '姓名三要素':
            list[0].status = true
            break
          case '身份证':
            list[1].status = true
            break
          case '芝麻分':
            list[2].status = true
            break
          case '联系人':
            list[3].status = true
            break
          case '手机运营商':
            list[4].status = true
            break
          case '淘宝':
            list[6].status = true
            break
          case '支付宝':
            list[7].status = true
            break
        }
      })
    },
    gotoOther (item) {
      if (item.title === '手机运营商') {
        this.gotoXinyanQuanzhi('carrier')
      } else if (item.title === '淘宝认证') {
        this.gotoXinyanQuanzhi('taobaoweb')
      } else if (item.title === '支付宝认证') {
        this.gotoXinyanQuanzhi('zhifubao')
      } else if (item.pathName) {
        this.$router.push({
          name: item.pathName
        })
      }
    },
    gotoXinyanQuanzhi (name) {
      const domainUrl = `https;//${document.domain}?form=verify`
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
