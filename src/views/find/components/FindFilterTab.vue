<template>
  <div class="filter" ref="filter">
    <div class="menu">
      <transition  enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <div ref="cover" class="bg-cover" v-show="isCoverShow" @click="coverClick"></div>
      </transition>
      <div class="down-menu" @click="menuClick(0)">
        <button>排序</button>
        <transition name="slide-fade">
          <div v-show="current === 0"  class="menu-btns">
            <ul>
              <li><button @click="filterClick('sorting','IsRed desc')">推荐排序</button></li>
              <li><button @click="filterClick('sorting','Rate asc')">贷款费率</button></li>
            </ul>
          </div>
        </transition>
      </div>
      <div class="down-menu" @click="menuClick(1)">
        <button>金额</button>
        <transition name="slide-fade">
          <div v-show="current === 1" class="menu-btns">
            <ul>
              <li><button @click="filterClick('all')">不限金额</button></li>
              <li><button @click="filterClick('minQuota',1000)">1 千以内</button></li>
              <li><button @click="filterClick('minQuota',3000)">3 千</button></li>
              <li><button @click="filterClick('minQuota',5000)">5 千</button></li>
              <li><button @click="filterClick('minQuota',10000)">1 万</button></li>
              <li><button @click="filterClick('minQuota',50000)">5 万</button></li>
              <li><button @click="filterClick('minQuota',100000)">10 万以上</button></li>
            </ul>
          </div>
        </transition>
      </div>
      <div class="down-menu" @click="menuClick(2)">
        <button>期限</button>
        <transition name="slide-fade">
          <div v-show="current === 2" class="menu-btns">
            <ul>
              <li><button @click="filterClick('all')">不限期限</button></li>
              <li><button @click="filterClick('minTerm',30)">1 个月</button></li>
              <li><button @click="filterClick('minTerm',90)">3 个月</button></li>
              <li><button @click="filterClick('minTerm',540)">6 个月</button></li>
              <li><button @click="filterClick('minTerm',365)">1 年</button></li>
              <li><button @click="filterClick('minTerm',1095)">3 年</button></li>
              <li><button @click="filterClick('minTerm',1825)">5 年以上</button></li>
            </ul>
          </div>
        </transition>
      </div>
      <div class="down-menu">
        <button class="ripple" @click="menuClick(3)">筛选</button>
        <transition name="slide-fade">
          <div v-show="current === 3" class="menu-filter">
            <cube-radio-group v-model="filterType" :options="options"/>
            <button class="simple-btn submit" @click="filterSubmit">确认</button>
          </div>
        </transition>
      </div>
    </div>

  </div>
</template>

<script>
import { apid } from '@/utils'
export default {
  name: 'FindFilterTab',
  data () {
    return {
      filterType: '',
      current: -1,
      isCoverShow: false,
      tablist: ['排序', '金额', '期限', '筛选'],
      options: ['上班族', '千元速贷', '小额贷', '大额贷款', '工薪贷', '闪电速贷', '只看芝麻分', '免审核', '新口子', '高通过']
    }
  },
  mounted () {
    this.updateMenuUI()
  },
  methods: {
    filterClick (key, value) {
      this.$emit('filter', key, value)
    },

    updateMenuUI () {
      let top = this.$refs.filter.offsetTop + this.$refs.filter.offsetHeight
      const safeTop = apid.getSafeAreaTop()
      if (safeTop > 0) {
        top += safeTop
      }
      this.$refs.cover.style.top = top + 'px'
    },

    filterSubmit () {
      this.$emit('filter2', this.filterType)
      this.closeMenus()
    },

    menuClick (index) {
      if (this.current === index) {
        this.closeMenus()
      } else {
        this.current = index
        this.isCoverShow = true
      }
    },

    closeMenus (index = -1) {
      this.isCoverShow = false
      this.current = index
    },

    coverClick () {
      this.closeMenus()
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less/variable";
@import "~less/mixin";
.filter{
  .menu{
    background: white;
    display: flex;
    .shadow(0, 1px, 2px, @light_gray3);
    .down-menu{
      font-size: @font_size_2;
      width: 25%;
      text-align: center;
      position: relative;
      & > button {
        width: 100%;
        height: 40px;
        line-height: 40px;
        display: block;
        background: white;
      }
      .menu-filter, .menu-btns{
        /*display: none;*/
        position: absolute;
        top: 40px;
        background: white;
        z-index: 999;
        .shadow(0, 1px, 2px, @light_gray2);
        padding: 10px 0;
        ul{
          li{
            text-align: center;
            height: 30px;
            line-height: 30px;
          }
        }
      }
      .menu-btns{
        left: 0;
        width: 120%;
        button{
          display:block;
          width: 100% ;
          height: 30px;
          line-height: 30px;
        }
        button:active{
          background: @light_gray;
        }
      }
    }
  }
  .slide-fade-enter-active {
    transition: all .2s ease;
  }
  .slide-fade-leave-active {
    transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateY(-1rem);
    opacity: 0;
  }
}
</style>
