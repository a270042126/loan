<template>
  <base-page :navOptions="{ title: '用户认证', isBack: true}">
    <better-scroll :data="list" ref="scroll">
      <div class="content">
        <template v-for="(item, index) in list">
          <verify-cell :key="index"
                       :item="item"
                       @gotoOther="gotoOther(item)"/>
        </template>
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
import VerifyCell from './components/VerifyCell'
import { request, apid, common } from '@/utils'
import { url, isApp } from '@/const'
export default {
  name: 'Verify',
  data () {
    return {
      order: {},
      list: [
        { icon: 'bank', flag: 32, flagName: '', pathName: 'bankCardVerify', status: false },
        { icon: 'id-card', flag: 4, flagName: '', pathName: 'idCardVerify', status: false },
        { icon: 'contact', flag: 1, flagName: '', pathName: 'linkUserContacts', status: false },
        { iconName: '征', flag: 8, flagName: '', pathName: 'creditInfo', status: false },
        { iconName: '活', flag: 524288, flagName: '', pathName: 'livingVerify', status: false }
      ]
    }
  },
  components: {
    VerifyCell
  },
  mounted () {
    this.refresh()
    this.accapceNotification()
  },
  destroyed () {
    this.bus.$off('verifyRefresh')
  },
  methods: {
    async refresh () {
      this.getOrder()
      if (!this.$route.query.orderId) {
        this.getAuthList()
      }
    },
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
          const verifyFlows = res.result.verifyFlows
          const verifyFlag = res.result.verifyFlag
          const verifyNames = res.result.verifyNames
          this.handleList(verifyFlows, verifyFlag, verifyNames)
        },
        errFn: () => {
        }
      })
    },
    getOrder () {
      const orderId = this.$route.query.orderId
      if (orderId) {
        request({
          type: 'post',
          path: url.Loan.GetOrderDetail,
          data: { id: orderId },
          fn: (res) => {
            this.order = res.result
            this.getAuthList()
          },
          errFn: () => {
          }
        })
      }
    },
    gotoOther (item) {
      common.trackEvent('按钮点击事件', '认证点击', item.flagName)
      if (item.flagApiName) {
        this.gotoXinyanQuanzhi(item.flagApiName)
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
    },

    handleList (verifyFlows, verifyFlag, verifyNames) {
      const needVerify = this.order.needVerify
      const newList = [
        { icon: 'bank', flag: -1, flagName: '基础信息', pathName: 'baseInfoVerify', status: false }
      ]
      if (verifyNames.indexOf('姓名三要素') !== -1) {
        newList[0].status = true
      }
      verifyFlows.map(item => {
        if (this.showVerify(item, verifyFlag, needVerify)) {
          if (item.flagApiName) {
            item.iconName = common.substr(item.flagName, 0)
            item.status = this.showVerifyText(item, verifyFlag, needVerify)
            newList.push(item)
          } else {
            this.list.some(obj => {
              if (item.flag === obj.flag) {
                obj.status = this.showVerifyText(item, verifyFlag, needVerify)
                newList.push(Object.assign(obj, item))
                return true
              }
            })
          }
        }
      })
      this.list = newList
    },
    showVerifyText (verifyFlow, verifyFlag, needVerify) {
      // 当前订单要求认证
      if (needVerify && this.flagCheck(needVerify, verifyFlow.flag)) return false
      // 用户已认证
      if (verifyFlag && this.flagCheck(verifyFlag, verifyFlow.flag)) return true
      return false
    },
    showVerify (verifyFlow, verifyFlag, needVerify) {
      // 当前订单要求认证，直接显示
      if (needVerify && this.flagCheck(needVerify, verifyFlow.flag)) return true
      // 用户已认证，直接显示
      if (verifyFlag && this.flagCheck(verifyFlag, verifyFlow.flag)) return true
      // 未启用，直接不显示
      if (!verifyFlow.isActive) return false
      // 已启用，按平台显示
      const platform = apid.systemType()
      if (platform === 'web') return verifyFlow.hasWeb
      if (platform === 'android') return verifyFlow.hasAndroid
      if (platform === 'ios') return verifyFlow.hasIos
      return false
    },
    flagCheck (flag, site) {
      return (flag & site) === site
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
