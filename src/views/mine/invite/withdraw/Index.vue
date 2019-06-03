<template>
  <base-page :navOptions="{ title: '提现', isBack: true}">
    <better-scroll :data="list" ref="scroll"
                    :pullUpLoad="true"
                    :pullDownRefresh="true"
                    @pulling-down="onPullingDown"
                    @pulling-up="onPullingUp">
      <div class="withdraw">
        <div class="earning-info">
          <h1>可提金额：{{earningInfo.earningsUnpiad}}</h1>
          <p>推广总额：{{earningInfo.earnings}}</p>
          <p>已提现金额：{{earningInfo.earningsPaid}}</p>
        </div>
        <div class="btns">
          <button class="simple-btn" @click="withdrawClick">提现</button>
        </div>
        <div class="record">
          <ul>
            <li>
              <p>申请金额</p>
              <p>打款金额</p>
              <p>支付方式</p>
              <p>状态名称</p>
              <p>创建时间</p>
            </li>
            <li v-for="(item, key) in list" :key="key">
              <p>{{item.applyAmount}}</p>
              <p>{{item.paidAmount}}</p>
              <p>{{item.paymentMethodName}}</p>
              <p>{{item.statusName}}</p>
              <p>{{item.creationTime|dateFormat}}</p>
            </li>
          </ul>
        </div>
      </div>
    </better-scroll>
    <form-dialog :isDialogShow="isFormShow" @onClose="isFormShow = false" @onRefresh="onPullingDown"/>
  </base-page>
</template>

<script>
import { request } from '@/utils'
import { url } from '@/const'
import FormDialog from './components/FormDialog'
export default {
  name: 'Index',
  components: { FormDialog },
  data () {
    return {
      isFormShow: false,
      list: [],
      params: {
        sorting: '',
        maxResultCount: 40,
        skipCount: 0
      },
      earningInfo: {},
      form: {
        applyAmount: 0,
        paymentMethod: 0,
        paymentAccount: ''
      }
    }
  },
  mounted () {
    this.onPullingDown()
  },
  methods: {
    onPullingDown () {
      this.params.skipCount = 0
      this.getEarningInfo()
      this.getEarningApplyList()
    },
    onPullingUp () {
      this.params.skipCount += this.params.maxResultCount
      this.getEarningApplyList()
    },
    getEarningInfo () {
      request({
        type: 'post',
        path: url.Affiliate.GetEarningInfo,
        fn: data => {
          this.earningInfo = data.result
        },
        errFn: () => {
        }
      })
    },
    getEarningApplyList () {
      request({
        type: 'post',
        path: url.Affiliate.GetEarningApplyList,
        data: this.params,
        fn: data => {
          const totalCount = data.result.totalCount
          if (this.list.length >= totalCount) {
            this.$refs.scroll.closePullUp()
          } else {
            this.$refs.scroll.openPullUp()
          }
          const items = data.result.items
          if (this.params.skipCount === 0) {
            this.list = items
          } else {
            this.list = this.list.concat(items)
          }
        },
        errFn: () => {
          this.foreceUpdate()
        }
      })
    },
    withdrawClick () {
      this.isFormShow = true
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
.withdraw{
  .earning-info{
    padding: 20px 0;
    background: white;
    border-bottom: 1px solid @light_gray;
    h1{
      font-size: @font_size_4;
      text-align: center;
      color: @theme_color3;
    }
    p{
      padding-top: 8px;
      font-size: @font_size_3;
      text-align: center;
    }
  }
  .btns {
    padding: 40px @space1;
  }
  .record {
    background: white;
    padding: 15px 0;
    ul{
      li {
        display: flex;
        justify-content: center;
        padding: 10px 0;
         & > p{
           text-align: center;
           flex: 1;
        }
      }
      li:first-child{
        border-bottom: 1px solid @light_gray;
      }
    }
  }
}
</style>
