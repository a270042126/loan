<template>
  <base-page :navOptions="{ title: '紧急联系人', isBack: true}">
    <div slot="navRightItem" class="nav-bar-right-item" @click="gotoOtherClick(-1)">
      <svg-icon iconClass="add" />
    </div>
    <better-scroll>
      <ul>
        <li v-for="(item, key) in list" :key="key" @click="gotoOtherClick(key)">
          <p>{{item.name}}<span>({{item.relation}})</span></p>
          <p>{{item.phoneNumber}}</p>
          <div class="arrow">
            <svg-icon iconClass="arrow-right"/>
          </div>
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
      list: []
    }
  },
  mounted () {
    this.getUserContactList()
    this.accapceNotification()
  },
  destroyed () {
    this.bus.$off('linkUserContactsRefresh')
  },
  methods: {
    accapceNotification () {
      // const that = this
      this.bus.$on('linkUserContactsRefresh', () => {
        this.getUserContactList()
      })
    },
    gotoOtherClick (key) {
      if (key >= 0) {
        const item = this.list[key]
        this.$router.push({
          name: 'addOrUpdateUserContacts',
          query: {
            id: item.id,
            name: item.name,
            phoneNumber: item.phoneNumber,
            relation: item.relation
          }
        })
      } else {
        this.$router.push({
          name: 'addOrUpdateUserContacts'
        })
      }
    },
    getUserContactList () {
      request({
        type: 'post',
        path: url.UserVerify.GetUserContactList,
        fn: (res) => {
          console.log(res)
          this.list = res.result.items
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
ul{
  margin-top: 20px;
  padding: 0 15px;
  background: white;
  li{
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid @light_gray;
    height: 40px;
    line-height: 40px;
    font-size: @font_size_3;
    p:first-child {
      flex: 1;
    }
    p{
      span {
        margin-left: 10px;
        color: @light_gray2;
      }
    }
    .arrow{
      color: @light_gray2;
      margin-left: 5px;
      font-size: @font_size_4;
    }
  }
}
</style>
