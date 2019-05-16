<template>
  <div class="text-input">
    <label>{{title}}</label>
    <input type="text"
           :placeholder="placeholder"
           v-bind:value="value"
           :name="name"
           @input="handleInput"/>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'TextInput',
  props: {
    name: {
      default: ''
    },
    title: {
      default: ''
    },
    placeholder: {
      default: ''
    },
    value: {
      default: ''
    }
  },
  methods: {
    handleInput (event) {
      const value = event.target.value
      // 触发 input 事件，并传入新值
      this.$emit('input', value)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
.text-input{
  @height: 44px;
  background: white;
  display: flex;
  align-items: center;
  border-bottom: 1px solid @light_gray;
  height: @height;
  label{
    width: 80px;
    font-size: @font_size_3;
  }
  input{
    height: @height;
    text-align: right;
    width: 0;
    flex: 1;
    font-size: @font_size_3;
  }
}
</style>
