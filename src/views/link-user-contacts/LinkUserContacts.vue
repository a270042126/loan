<template>
  <base-page :navOptions="{ title: '常见问题', isBack: true}">
    <better-scroll>
      <link-user-title title="第一联系人"/>
      <div>
        <label>第一联系人</label>
        <input readonly="true" @click="openPickerClick(1)"/>
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
import LinkUserTitle from './components/LinkUserTitle'
export default {
  name: 'LinkUserContacts',
  components: { LinkUserTitle },
  methods: {
    openPickerClick (key) {
    }
  }
}
</script>

<style lang="less" scoped>

</style>
