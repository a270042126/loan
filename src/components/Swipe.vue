<template>
  <cube-slide class="loan-swipe" ref="slide" :data="list">
    <cube-slide-item v-for="(item, index) in list" :key="index" @click.native="clickHandler(item, index)">
      <img :src="item.url">
    </cube-slide-item>
  </cube-slide>
</template>

<script>
export default {
  name: 'Swipe',
  props: {
    list: Array
  },
  methods: {
    clickHandler (item) {
      this.$router.push({
        name: item.pathName
      })
    }
  }
}
</script>

<style lang="less" scoped>
img{width: 100%}
</style>
