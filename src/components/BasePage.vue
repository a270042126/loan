<template>
  <article class="container">
    <slot name="header">
      <header v-if="navOptions"  ref="navBar"
              :class="`nav-bar ${navOptions.isShadow ? 'shadow': ''} ${navOptions.isFixed ? 'fixed' : ''}`">
        <div>
          <div v-if="navOptions.isBack" class="arrow material-icons" @click="_navBackClick">&#xe5c4;</div>
          <div v-if="navOptions.title" class="title">{{navOptions.title}}</div>
          <div class="right-item">
            <slot name="navRightItem"></slot>
          </div>
        </div>
      </header>
    </slot>
    <div class="main-body">
      <slot/>
    </div>
    <footer v-if="tabBarIndex && tabBarIndex !== '-1'" ref="tabBar" class="tab-bar">
      <ul>
        <li v-for="(item,key) in tabBarlist" :key="key" @click="tabBarClick(key)"
            :class="`${key === Number(tabBarIndex) ? 'active':''}`">
          <div class="material-icons">
            {{item.icon}}
          </div>
          <div class="title">{{item.title}}</div>
        </li>
      </ul>
    </footer>
  </article>
</template>

<script>
import { apid } from 'js/utils'
export default {
  name: 'BasePage',
  props: {
    navOptions: {
      title: '',
      rightItem: '',
      isBack: true,
      isShadow: false,
      isFixed: true
    },
    tabBarIndex: String
  },
  data () {
    return {
      tabBarlist: [
        {
          title: '首页',
          pathName: '/',
          icon: 'home',
          info: 0
        },
        {
          title: '发现',
          pathName: 'find',
          icon: 'redeem',
          info: 0
        },
        {
          title: '消息',
          pathName: 'message',
          icon: 'message',
          info: 0
        },
        {
          title: '我的',
          pathName: 'mine',
          icon: 'person',
          info: 0
        }
      ]
    }
  },
  mounted () {
    this.resetNavBarTop()
    this.resetTabBarBottom()
  },
  methods: {
    resetNavBarTop () {
      if (!this.navOptions) { return }
      this.$refs.navBar.style.paddingTop = apid.getSafeAreaTop() + 'px'
      this.$nextTick(() => {
        // 使用nextTick为了保证dom元素都已经渲染完毕
        this.$emit('eventGetHeight', this.$refs.navBar.offsetHeight)
      })
    },
    _navBackClick () {
      this.$emit('navBackClick')
      this.$router.goBack()
    },
    resetTabBarBottom () {
      if (!this.tabIndex) { return }
      const padding = apid.getSafeAreaBottom()
      if (padding > 0) {
        this.$refs.tabBar.style.paddingBottom = padding + 'px'
      }
    },
    tabBarClick (index) {
      let path = this.tabBarlist[index].pathName
      this.$router.push({
        path: path
      })
    }
  }
}
</script>
