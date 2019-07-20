<template>
  <base-page :navOptions="{ title: '征信查询结果', isBack: true}">
    <better-scroll :data="result">
      <div class="content">
        <h2>基本信息</h2>
        <div>
          <text-cell title="姓名" :text="result.id_name"/>
          <text-cell title="身份证" :text="result.id_no"/>
        </div>
        <div v-if="result.result_detail">
          <h2>报告详情</h2>
          <div v-if="result.result_detail.apply_report_detail">
            <div v-show="false">
              {{apply_report_detail = result.result_detail.apply_report_detail}}
            </div>
            <text-cell title="申请准入置信度" :text="apply_report_detail.apply_credibility"/>
            <text-cell title="申请准入分" :text="apply_report_detail.apply_score"/>
            <text-cell title="查询网络贷款类机构数" :text="apply_report_detail.query_cash_count"/>
            <text-cell title="查询消费金融类机构数" :text="apply_report_detail.query_finance_count"/>
            <text-cell title="查询机构数" :text="apply_report_detail.query_org_count"/>
            <text-cell title="总查询次数" :text="apply_report_detail.query_sum_count"/>
            <text-cell title="最近查询时间" :text="apply_report_detail.latest_query_time | dateFormat"/>
            <text-cell title="近1个月总查询笔数" :text="apply_report_detail.latest_one_month"/>
            <text-cell title="近3个月贷款笔数" :text="apply_report_detail.latest_three_month"/>
            <text-cell title="近6个月总查询笔数" :text="apply_report_detail.latest_six_month"/>
          </div>
          <div v-if="result.result_detail.behavior_report_detail">
            <h2>行为报告详情</h2>
            <div v-show="false">
              {{behavior_report_detail = result.result_detail.behavior_report_detail}}
            </div>
            <text-cell title="贷款行为分" :text="apply_report_detail.loans_score"/>
            <text-cell title="贷款行为置信度" :text="apply_report_detail.loans_credibility"/>
            <text-cell title="贷款放款总订单数" :text="apply_report_detail.loans_count"/>
            <text-cell title="贷款已结清订单数" :text="apply_report_detail.loans_settle_count"/>
            <text-cell title="贷款逾期订单数" :text="apply_report_detail.consfin_org_count"/>
            <text-cell title="消费金融类机构数" :text="apply_report_detail.loans_org_count"/>
            <text-cell title="网络贷款类机构数" :text="apply_report_detail.loans_cash_count"/>
            <text-cell title="近1个月贷款笔数" :text="apply_report_detail.latest_one_month"/>
            <text-cell title="近3个月贷款笔数" :text="apply_report_detail.latest_three_month"/>
            <text-cell title="近6个月贷款笔数" :text="apply_report_detail.latest_six_month"/>
            <text-cell title="历史贷款机构成功扣款笔数" :text="apply_report_detail.history_suc_fee"/>
            <text-cell title="历史贷款机构失败扣款笔数" :text="apply_report_detail.history_fail_fee"/>
            <text-cell title="近1个月贷款机构成功扣款笔数" :text="apply_report_detail.latest_one_month_suc"/>
            <text-cell title="近1个月贷款机构失败扣款笔数" :text="apply_report_detail.latest_one_month_fail"/>
            <text-cell title="信用贷款时长" :text="apply_report_detail.loans_long_time"/>
            <text-cell title="最近一次贷款时间" :text="apply_report_detail.loans_latest_time | dateFormat"/>
          </div>
          <div v-if="result.result_detail.current_report_detail">
            <h2>信用现状报告详情</h2>
            <div v-show="false">
              {{current_report_detail = result.result_detail.current_report_detail}}
            </div>
            <text-cell title="网贷建议授信额度" :text="apply_report_detail.loans_credit_limit"/>
            <text-cell title="网贷额度置信度" :text="apply_report_detail.loans_credibility"/>
            <text-cell title="网络贷款类机构数" :text="apply_report_detail.loans_org_count"/>
            <text-cell title="网络贷款类产品数" :text="apply_report_detail.loans_product_count"/>
            <text-cell title="网络贷款机构最大授信额度" :text="apply_report_detail.loans_max_limit"/>
            <text-cell title="网络贷款机构平均授信额度" :text="apply_report_detail.loans_avg_limit"/>
            <text-cell title="消金建议授信额" :text="apply_report_detail.consfin_credit_limit"/>
            <text-cell title="消金额度置信度" :text="apply_report_detail.consfin_credibility"/>
            <text-cell title="消费金融类机构数" :text="apply_report_detail.consfin_org_count"/>
            <text-cell title="消费金融类产品数" :text="apply_report_detail.consfin_product_count"/>
            <text-cell title="消费金融类机构最大授信额度" :text="apply_report_detail.consfin_max_limit"/>
            <text-cell title="消费金融类机构平均授信额度" :text="apply_report_detail.consfin_avg_limit"/>
          </div>
        </div>
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
import { request } from '@/utils'
import { url } from '@/const'
import TextCell from '@/components/TextCell'
export default {
  name: 'Index',
  components: { TextCell },
  data () {
    return {
      result: ''
    }
  },
  mounted () {
    this.getCreditReport()
  },
  methods: {
    getCreditReport () {
      const id = this.$route.query.id
      request({
        type: 'post',
        path: url.Credit.GetCreditReport,
        data: { id: id },
        fn: data => {
          if (data.result) {
            this.result = JSON.parse(data.result)
            console.log(this.result)
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
  padding-bottom: 20px;
  h2{
    padding: 10px 15px;
    color: @light_gray2;
  }
}

</style>
