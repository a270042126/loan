<template>
  <base-page :navOptions="{ title: '邀请', isBack: true, isFixed: true, isScrollShow:isScrollShow}">
    <better-scroll
      :probeType="3"
      :listenScroll="true"
      @scroll="onScroll">
      <div class="banner">
        <img src="@/assets/images/invite/p1.jpg">
      </div>
      <div class="yqinfo">
        <dot-invite-item num="1">
          <p slot="info">
            登录秒借APP或微信端，点击“分享好友”，<br>
            被邀好友完成注册且授权成功（仅限首次授权），<br>
            邀请人可得<span>2元/人</span>授权现金奖励。
          </p>
          <img src="@/assets/images/invite/p3.png" slot="photo">
        </dot-invite-item>
        <dot-invite-item num="2">
          <p slot="info">
            被邀好友成功申请畅卡，且首次借款签约成功，<br>
            邀请人可得<span>3元/人</span>首借现金奖励。
          </p>
          <img src="@/assets/images/invite/p4.png" slot="photo">
        </dot-invite-item>
        <dot-invite-item num="3">
          <p slot="info">
            同时，被邀好友通过秒借畅卡首次借款签约成功<br>
            累计每满10人，邀请人可再次获得<span>50元</span>终极现金奖励。
          </p>
          <img src="@/assets/images/invite/p5.png" slot="photo">
        </dot-invite-item>
      </div>
      <div class="new-user">
        <div class="header">
          <p class="mess">财富需要挖掘，你准备好了吗？</p>
          <button class="simple-btn invite-btn" @click="shareClick">立即分享</button>
          <div class="record">
            <button class="record-btn" @click="recordClick">邀请记录</button>
            <button class="record-btn" @click="goldClick">推广佣金</button>
          </div>
        </div>
        <div class="desc">
          <dot-two-invite-item num="1">
            <p>活动时间：2017年12月29日起；</p>
          </dot-two-invite-item>
          <dot-two-invite-item num="2">
            <p>本次秒借邀请活动<span>新老注册用户均可参与；</span></p>
          </dot-two-invite-item>
          <dot-two-invite-item num="3">
            <p>被邀好友完成注册，填写邀请人的推荐码或手机号，完成实名认证、授权（首次），即视为邀请成功；</p>
          </dot-two-invite-item>
          <dot-two-invite-item num="4">
            <p>被邀好友完成授权（首次），畅卡首借签约步骤，邀请人均可获得对应的现金奖励，畅卡首借成功签约人数达到一定数量，即可再获一重现金奖励，现金奖励系统自动发放，再次邀请好友成功可再次获取，现金可提现；</p>
          </dot-two-invite-item>
          <dot-two-invite-item num="5">
            <p>现金奖励实时发放，邀请成功即发放至用户个人账户，您可通过活动页面中，点击【我的钱脉】查看邀请奖励明细；
            </p>
          </dot-two-invite-item>
          <dot-two-invite-item num="6">
            <p>邀请人需开通新浪委托代扣，需完成“注册-实名认证-授权-申请畅乐卡-激活畅乐卡-签约”，方可获得邀请奖励。</p>
          </dot-two-invite-item>
        </div>
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
import DotInviteItem from './components/DotInviteItem'
import DotTwoInviteItem from './components/DotTwoInviteItem'
export default {
  name: 'Index',
  components: { DotTwoInviteItem, DotInviteItem },
  data () {
    return {
      isScrollShow: false
    }
  },
  methods: {
    onScroll (pos) {
      if (pos.y < -150) {
        this.isScrollShow = true
      } else {
        this.isScrollShow = false
      }
    },
    goldClick () {
      this.$router.push({
        name: 'inviteGold'
      })
    },
    recordClick () {
      this.$router.push({
        name: 'invateRecord'
      })
    },
    shareClick () {
      this.$router.push({
        name: 'share'
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
.container{
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  img{
    width: 100%;
  }
  .banner{
    width: 100%;
    height: 280px;
    overflow: hidden;
  }
  .yqinfo{
    padding: 0 @space1;
    span{
      color: @theme_color3;
    }
  }
  .new-user{
    margin-top: 120px;
    background: @theme_primary;
    position: relative;
    padding-top: 240px;
    .header{
      background: url("../../../../assets/images/invite/p6.png") no-repeat;
      background-size: 100% auto;
      height: 300px;
      width: 100%;
      position: absolute;
      top: -120px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-top: 60px;
      .mess {
        background: #806f45;
        padding: 20px 30px;
        border-radius: 10px;
        margin-bottom: 20px;
        color: #ffec56;
      }
      .record{
        display: flex;
        justify-content: center;
        button{
          padding-top: 10px;
          color: @light_gray2;
          border-bottom: 1px solid @light_gray2;
          padding-bottom: 2px;
        }
        button:last-child{
          margin-left: 20px;
        }
      }
      .invite-btn{
        width: 80%;
        margin-bottom: 10px;
      }
    }
    .desc{
      padding: 0 @space1;
    }
  }
}
</style>
