<template>
  <base-page :navOptions="{ title: '用户认证', isBack: true}">
    <better-scroll>
      <div class="content">
        <template v-for="(item, index) in list">
          <verify-cell :key="index" :item="item" @gotoOther="gotoOther(item.pathName)"/>
        </template>
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
import VerifyCell from './components/VerifyCell'
import { request } from 'js/utils'
import { url } from 'js/const'
export default {
  name: 'Verify',
  data () {
    return {
      verifyNames: [],
      list: [
        { icon: 'featured_play_list', title: '银行卡认证', desc: '银行卡认证可以提高你的额度', pathName: 'bankCardVerify', status: false, verifyNames: true },
        { icon: 'featured_play_list', title: '身份证认证', desc: '身份证认证可以提高你的额度', pathName: 'idCardVerify', status: false, verifyNames: true },
        { icon: 'featured_play_list', title: '芝麻分认证', desc: '芝麻分认证可以提高你的额度', pathName: 'zhimeCredit', status: false, verifyNames: true },
        { icon: 'featured_play_list', title: '紧急联系人', desc: '紧急联系人可以提高你的额度', pathName: 'linkUserContacts', status: false, verifyNames: true },
        { icon: 'featured_play_list', title: '手机运营商', desc: '手机运营商可以提高你的额度', pathName: 'phoneVerify', status: false, verifyNames: true }
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
  methods: {
    accapceNotification () {
      // const that = this
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
          case '身份证':
            list[0].status = true
            break
          case '姓名三要素':
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
        }
      })
    },
    gotoOther (pathName) {
      if (pathName) {
        this.$router.push({
          name: pathName
        })
      }
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
