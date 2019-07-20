<template>
  <div class="text-input">
    <div>
      <label>{{title}}</label>
      <textarea type="text"
             :placeholder="placeholder"
             v-bind:value="value"
             :name="name"
             :readonly="readonly"
             @input="handleInput"
      />
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TextAreaInput',
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
    },
    readonly: {
      default: false
    },
    pickerData: null
  },
  methods: {
    _selectHandle (selectedVal, selectedIndex, selectedText) {
      this.$emit('input', selectedVal.length ? selectedVal[0] : '')
    },
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
  background: white;
  & > div{
    display: flex;
    align-items: flex-start;
    border-bottom: 1px solid @light_gray;
    padding: 10px 15px;
    label{
      font-size: @font_size_3;
      margin-right: 10px;
    }
    textarea{
      flex: 1;
      font-size: @font_size_3;
      height: 80px;
      resize:none;
      text-align: right;
      font-weight: normal;
    }
  }
}
</style>
