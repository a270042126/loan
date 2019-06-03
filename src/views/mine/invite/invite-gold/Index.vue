<template>
  <base-page :navOptions="{ title: '推广佣金', isBack: true}">
    <div slot="navRightItem">
      <button @click="withdrawClick" style="color: white">提现</button>
    </div>
    <better-scroll class="record" :data="list" ref="scroll"
                   :pullUpLoad="true"
                   :pullDownRefresh="true"
                   @pulling-down="onPullingDown"
                   @pulling-up="onPullingUp">
      <ul class="list">
        <li>
          <p>客户</p>
          <p>类型</p>
          <p>佣金</p>
          <p>时间</p>
        </li>
        <li v-for="(item, key) in list" :key="key">
          <p>{{item.invitedUserName}}</p>
          <p>{{item.typeName}}</p>
          <p>{{item.amount}}</p>
          <p>{{item.creationTime|dateFormat}}</p>
        </li>
      </ul>
    </better-scroll>
  </base-page>
</template>

<script>
import { request } from '@/utils'
import { url } from '@/const'
export default {
  name: 'Index',
  data () {
    return {
      list: [],
      params: {
        sorting: '',
        maxResultCount: 20,
        skipCount: 0
      }
    }
  },
  methods: {
    onPullingDown () {
      this.params.skipCount = 0
      this.getEarningRecordList()
    },
    onPullingUp () {
      this.params.skipCount += this.params.maxResultCount
      this.getEarningRecordList()
    },
    getEarningRecordList () {
      request({
        type: 'post',
        path: url.Affiliate.GetEarningRecordList,
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
      this.$router.push({ name: 'withdraw' })
    }
  }
}
</script>

<style lang="less" scoped>
  @import "~less/variable";
  .record{
    .list{
      background: white;
      padding: 0 5px;
      font-size: @font_size_2;
      li:first-child {
        border-bottom: 1px solid @light_gray3;
        padding: 15px 0;
      }
      li{
        display: flex;
        justify-content: space-between;
        text-align: center;
        padding: 10px 0;
        p{
          flex: 1;
        }
      }
    }
  }
</style>
