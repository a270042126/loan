<template>
  <div class="radio-component">
    <input type="radio"
           :name="name"
           :value="value"
           :class="className"
           :required="required"
           :disabled="disabled"
           @change="onChange"
           :checked="state">
    <label>
      <span class="input-box">
        <svg-icon iconClass="checked"/>
      </span>
      <slot></slot>
    </label>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'modelValue',
    event: 'input'
  },
  props: {
    name: {
      type: String,
      default: null
    },
    value: {
      default: ''
    },
    modelValue: {
      default: undefined
    },
    className: {
      type: String,
      default: null
    },
    checked: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    model: {}
  },
  computed: {
    state () {
      if (this.modelValue === undefined) {
        return this.checked
      }
      return this.modelValue === this.value
    }
  },
  methods: {
    onChange () {
      this.toggle()
    },
    toggle () {
      this.$emit('input', this.state ? '' : this.value)
    }
  },
  watch: {
    checked (newValue) {
      if (newValue !== this.state) {
        this.toggle()
      }
    }
  },
  mounted () {
    if (this.checked && !this.state) {
      this.toggle()
    }
  }
}
</script>

<style lang="less">
@import "~less/variable";
.radio-component {
  label > .input-box {
    font-size: @font_size_5;
    color: @light_gray2;
  }
  > input {
    opacity: 0;
    position: absolute;
    &:checked + label > .input-box  {
      color: @theme_primary;
    }
  }

}
</style>
