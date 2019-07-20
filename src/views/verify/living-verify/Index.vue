<template>
  <base-page :navOptions="{ title: '活体识别', isBack: true}">
    <better-scroll :data="result">
      <div v-if="!result" class="face-div">
        <svg-icon iconClass="face" class="face-icon"/>
      </div>
      <div v-else>
        <text-cell title="认证状态"
                   :text="result.ret_code !== '000000' ? '认证失败' : (result.result_auth === 'T' ? '认证通过' : '认证未通过')"/>
        <text-cell title="身份证号码" :text="result.id_no"/>
        <text-cell title="身份证姓名" :text="result.id_name"/>
        <text-cell title="民族" :text="result.state_id"/>
        <text-cell title="性别" :text="result.flag_sex"/>
        <text-cell title="生日" :text="result.date_birthday"/>
        <text-cell title="证件地址" :text="result.addr_card"/>
        <text-cell title="签发机构" :text="result.branch_issued"/>
        <text-cell title="证件有效期" :text="result.start_card"/>
      </div>
      <button class="simple-btn" @click="htClick"
              v-stat="{category:'按钮点击事件', action:'活体识别', name: '活体识别'}">
        {{(result.ret_code !== '000000' || result.result_auth !== 'T') ? '活体识别' : '重新活体识别'}}
      </button>
    </better-scroll>
  </base-page>
</template>

<script>
import { apid, request, common } from '@/utils'
import { url } from '@/const'
import { mapGetters } from 'vuex'
import TextCell from '@/components/TextCell'
export default {
  name: 'Index',
  components: { TextCell },
  data () {
    return {
      result: ''
    }
  },
  computed: {
    ...mapGetters(['projectName', 'userKeys'])
  },
  methods: {
    htClick () {
      if (!this.userKeys.userId || !this.userKeys.userId) {
        this.$router.push({
          name: 'login'
        })
        return false
      }
      apid.runFaceAuth(this.projectName, (res, outOrderId) => {
        this.result = res
        if (res.result_auth === 'F') {
          common.errorT('认证不通过！请重新认证')
        } else if (res.ret_code === '000000') {
          const params = {
            userId: this.userKeys.userId,
            outOrderId: outOrderId,
            classify_tag: JSON.stringify(res.classify_tag),
            risk_tag: JSON.stringify(res.risk_tag),
            flag_sex: res.flag_sex,
            ret_msg: res.ret_msg,
            id_name: res.id_name,
            be_idcard: res.be_idcard,
            id_no: res.id_no,
            date_birthday: res.date_birthday,
            result_status: res.result_status,
            addr_card: res.addr_card,
            branch_issued: res.branch_issued,
            state_id: res.state_id,
            ret_code: res.ret_code,
            result_auth: res.result_auth,
            start_card: res.start_card,
            url_backcard: res.url_backcard,
            url_frontcard: res.url_frontcard,
            url_photoliving: res.url_photoliving,
            url_photoget: res.url_photoget
          }
          request({
            type: 'post',
            path: url.LivingIdentifyInfo.LivingIdentify,
            data: params,
            fn: data => {
              if (data.success) {
                common.successT('上传成功')
              }
              // 跨页刷新
              this.bus.$emit('verifyRefresh')
            },
            errFn: () => {
            }
          })
        }
      }, (err) => {
        common.errorT(JSON.stringify(err))
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
.face-div{
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 20px;
  .face-icon{
    width: 200px;
    height: 200px;
  }
}
.simple-btn{
  margin-top: 20px;
}
</style>
