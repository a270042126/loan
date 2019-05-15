<template>
  <base-page :navOptions="{ title: '借款', isBack: true, isFixed: true}">
    <div>
      <img src="../assets/images/n-banner.png">
    </div>
    <div class="loan-select">
      <div :class="`selectInput ${isQuotas ? 'active' : '' }`" @click="quotasClick">
        {{quotas.length > 0 ? quotas[quotasIndex].name : '0元'}}
        <div class="material-icons icon">expand_more</div>
      </div>
      <div :class="`selectInput ${!isQuotas ? 'active' : '' }`" @click="termsClick">
        {{terms.length > 0 ? terms[termsIndex].name : '0天'}}
        <div class="material-icons icon">expand_more</div>
      </div>
    </div>
    <div class="loanBtn">
      <button v-if="quotas.length > 0" class="ra-Btn" @click="loanClick">立即借款</button>
    </div>
  </base-page>
</template>

<script>
import { request } from 'js/utils'
import { url } from 'js/const'
export default {
  name: 'LoadProduct',
  data () {
    return {
      isQuotas: true,
      quotas: [],
      terms: [],
      quotasIndex: 0,
      termsIndex: 0
    }
  },
  mounted () {
    this.getLoanProduct()
  },
  computed: {
    quotaItems () {
      let arr = []
      for (let item of this.quotas) {
        arr.push({ text: item.name, vakue: item.name })
      }
      return arr
    },
    termItems () {
      let arr = []
      for (let item of this.terms) {
        arr.push({ text: item.name, vakue: item.name })
      }
      return arr
    }
  },
  methods: {
    showPicker () {
      if (this.isQuotas) {
        if (!this.picker) {
          this.picker = this.$createPicker({
            title: '',
            data: [this.quotaItems],
            onSelect: this.selectHandle
          })
        }
        this.picker.show()
      } else {
        if (!this.picker2) {
          this.picker2 = this.$createPicker({
            title: '',
            data: [this.termItems],
            onSelect: this.selectHandle
          })
        }
        this.picker2.show()
      }
    },
    loanClick () {
      this.$router.push({
        path: 'create-order',
        query: {
          quotaId: this.quotas[this.quotasIndex].id,
          termId: this.terms[this.termsIndex].id
        }
      })
    },
    termsClick () {
      this.isQuotas = false
      this.showPicker()
    },
    quotasClick () {
      this.isQuotas = true
      this.showPicker()
    },

    selectHandle (selectedVal, selectedIndex, _) {
      if (this.isQuotas) {
        this.quotasIndex = selectedIndex
      } else {
        this.termsIndex = selectedIndex
      }
    },
    getLoanProduct () {
      request({
        type: 'post',
        path: url.LoanProduct,
        fn: data => {
          console.log(data)
          this.quotas = data.result.quotas
          this.terms = data.result.terms
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.container {
  img{ width: 100%; }
  .loan-select{
    padding: 20px 0;
    .display-flex();
    .flex-justify-content-center();
    .selectInput{
      position: relative;
      width: 38%;
      height: 36px;
      line-height: 36px;
      .border-radius(18px);
      padding-left: 10px;
      font-size: @font_size_4;
      border:1px solid @light_gray3;
      .icon{
        position: absolute;
        right: 8px;
        top: 0;
      }
    }
    .selectInput:last-child{
      margin-left: 4%;
    }
    .selectInput.active {
      border: 1px solid @theme_color2;
    }
  }
  .loanBtn{
    width: 100%;
    text-align: center;
    padding: 10px 0;
  }
}

</style>
