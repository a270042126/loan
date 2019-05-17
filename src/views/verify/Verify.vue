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
export default {
  name: 'Verify',
  data () {
    return {
      list: [
        { icon: 'featured_play_list', title: '身份证认证', desc: '身份证认证可以提高你的额度', pathName: 'idCardVerify' },
        { icon: 'featured_play_list', title: '银行卡认证', desc: '银行卡认证可以提高你的额度', pathName: 'bankCardVerify' },
        { icon: 'featured_play_list', title: '芝麻分认证', desc: '芝麻分认证可以提高你的额度', pathName: 'zhimeCredit' },
        { icon: 'featured_play_list', title: '紧急联系人', desc: '紧急联系人可以提高你的额度', pathName: 'addOrUpdateUserContacts' },
        { icon: 'featured_play_list', title: '手机运营商', desc: '手机运营商可以提高你的额度' }
      ]
    }
  },
  components: {
    VerifyCell
  },
  methods: {
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
