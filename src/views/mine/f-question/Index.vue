<template>
  <base-page :navOptions="{ title: '常见问题', isBack: true}">
    <better-scroll>
      <div>
        <div class="title">{{question.displayName}}</div>
        <div class="content" v-html="question.content"></div>
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
import { url } from '@/const'
import { request } from '@/utils'
import { mapGetters } from 'vuex'
import { baseMixin } from '@/mixins'
export default {
  name: 'FQuestion',
  mixins: [baseMixin],
  data () {
    return {
      question: {}
    }
  },
  computed: {
    ...mapGetters([
      'userKeys'
    ])
  },
  methods: {
    getProjectContent () {
      const params = {
        tag: '常见问题'
      }
      request({
        type: 'post',
        path: url.GetProjectContentByTag,
        data: params,
        fn: data => {
          this.question = data.result
        },
        errFn: () => {
        }
      })
    }
  },
  watch: {
    userKeys: {
      immediate: true,
      handler: function () {
        this.getProjectContent()
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.container{
  background: white;
  .title {
    text-align: center;
    font-size: @font_size_4;
    padding: 10px 0;
  }
  .content{
    padding: 0 @space1 20px @space1;
    line-height: 20px;
  }
}
</style>
