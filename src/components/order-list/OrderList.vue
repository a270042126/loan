<template>
  <div>
    <div class="cell" @click="gotoDetailOrder(key)"  v-for="(item, key) in list" :key="key">
      <div class="top">
        <div class="material-icons icon">assignment</div>
        <div class="title">简单贷</div>
        <div class="status">{{item.statusName}}</div>
        <div class="time">{{getTime(item.creationTime)}}</div>
      </div>
      <div class="bottom">
        <div class="quota">
          <div>{{item.applyGross}}<span>元</span></div>
          <div class="subtitle">借款金额</div>
        </div>
        <div class="line"></div>
        <div class="term">
          <div>{{item.applyTerm}}<span>天</span></div>
          <div class="subtitle">借款期限</div>
        </div>
        <div class="line"></div>
        <div class="need-verify">
          {{item.statusName}}
        </div>
        <div class="operate-btn" @click.stop>
          <button v-if="getStatusNum(item) === 3"  @click="repayClick(item)">我要还款</button>
        </div>
      </div>
    </div>
    <r-dialog ref="repayDialog" title="我要还款">
      <div class="repay-div">
        <div class="input-group">
          <label>还款金额</label>
          <input v-model="repayGross" placeholder="还款金额...."/>
        </div>
        <button class="simple-btn remark_btn" @click="createRepayClick">创建还款</button>
      </div>
    </r-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { common } from '@/utils'
import { baseMixin, orderOperateMixin } from '@/mixins'
export default {
  name: 'OrderList',
  props: {
    list: Array,
    from: String
  },
  mixins: [baseMixin, orderOperateMixin],
  data () {
    return {
      repayGross: '',
      orderId: ''
    }
  },
  methods: {
    createRepayClick () {
      this.createRepayRequest(this.orderId, this.repayGross)
    },
    repayClick (item) {
      this.orderId = item.id
      this.$refs.repayDialog.open()
    },
    onRefresh () {
      this.bus.$emit('myOrdersRefresh')
    },
    // 跳转认证
    gotoVerifyClick () {
      this.$router.replace({ name: 'verify' })
    },
    getStatusNum (order) {
      return common.getStatusNum(order.statusName)
    },
    getTime (time) {
      return moment(time).format('YYYY-MM-DD')
    },
    gotoDetailOrder (key) {
      this.$router.push({ name: 'detail-order', query: { id: this.list[key].id, from: this.from } })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.cell {
  padding: 10px;
  margin-bottom: 12px;
  border-radius: 2px;
  background: white;
  .top{
    .icon{
      color: @theme_primary;
    }
    display: flex;
    align-items: center;
    .title{
      font-size: @font_size_3;
      margin: 0 6px;
    }
    .status{
      font-size: @font_size_2;
      color: #fff;
      background: @theme_primary;
      height: 24px;
      line-height: 24px;
      width: 50px;
      text-align: center;
    }
    .time{
      flex: 1;
      text-align: right;
    }
  }
  .bottom{
    padding-top: 15px;
    display: flex;
    align-items: center;
    .quota{
      padding-right: 10px;
      & > div:first-child{
        font-size: @font_size_4;
        color: @theme_color3;
      }
    }
    .term{
      padding: 0 12px;
      & > div:first-child{
        font-size: @font_size_4;

      }
    }
    .subtitle{
      margin-top: 2px;
      color: @light_gray2;
      font-size: @font_size_2;
    }
    span{
      font-size: @font_size_1;
    }
    .line{
      height: 22px;
      width: 1px;
      background: @light_gray;
    }
    .need-verify{
      color: @theme_color2;
      font-size: @font_size_2;
      padding-left: 10px;
    }
    .operate-btn{
      flex: 1;
      text-align: right;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      button {
        background: @theme_primary;
        padding: 8px 5px;
        border-radius: 4px;
        font-size: @font_size_2;
        margin-left: 8px;
        color: white;
      }
      .cancel-btn{
        background: @light_gray3
      }
    }
  }
}
</style>
