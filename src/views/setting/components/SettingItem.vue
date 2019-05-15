<template>
  <div class="setting_item" @click="_click">
    <div class="icon material-icons">{{item.icon}}</div>
    <div class="title">{{item.title}}</div>
    <div v-if="item.switch" class="switch">
      <cube-switch v-model="checked"/>
    </div>
    <div class="subtitle" v-else>
      {{item.subTitle}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingItem',
  props: {
    num: Number,
    item: {
      icon: '',
      title: '',
      subTitle: '',
      switch: false,
      path: '',
      onSwitch: false
    }
  },
  data () {
    return {
      checked: this.item.onSwitch
    }
  },
  mounted () {
    this.checked = this.item.onSwitch
  },
  methods: {
    _click () {
      if (!this.item.switch) {
        this.$emit('onClick', this.num)
      }
    }
  },
  watch: {
    checked (newValue) {
      this.$emit('onSwitchChange', this.num, newValue)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.setting_item{
  .display-flex();
  .flex-align-items-center();
  padding: 0 @space1;
  height: 44px;
  background: white;
  margin-bottom: 10px;
  .icon{width: 30px; color: @light_gray2}
  .title{
    .flex();
    font-size: @font_size_1;
  }
}
</style>
