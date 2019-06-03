<template>
  <div class="text-input">
    <div>
      <input type="text"
             :placeholder="placeholder"
             v-bind:value="value"
             :name="name"
             :readonly="readonly"
             @input="handleInput"
             @click="_inputClick"
      />
      <div v-if="pickerData" class="icon">
        <svg-icon iconClass="arrow-right"/>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BTextInput',
  props: {
    name: {
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
    _inputClick () {
      if (this.pickerData) {
        if (!this.picker) {
          this.picker = this.$createPicker({
            title: this.title,
            data: [this.pickerData],
            onSelect: this._selectHandle
          })
        }
        this.picker.show()
      }
    },
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
  padding: 0 15px;
  margin-bottom: 10px;
  & > div{
    display: flex;
    align-items: center;
    input{
      border: 1px solid @light_gray3;
      width: 0;
      flex: 1;
      font-size: @font_size_2;
      padding: 6px 8px;
    }
    .icon{
      font-size: @font_size_5;
      color: @light_gray2;
    }
  }
}
</style>
